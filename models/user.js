'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');
const cryptoRandomString = require('crypto-random-string');
const { NotFoundError } = require('../expressError');
const client = require("../twilio.js");
const { TWILIO_NUMBER } = require("../config.js");

/** User of the site. */

class User {

	/** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

	static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO users (username,
                          password,
                          first_name,
                          last_name,
                          phone,
                          join_at,
                          last_login_at)
        VALUES
        ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
        RETURNING username, password, first_name, last_name, phone`,
			[ username, hashedPassword, first_name, last_name, phone ]
		);

		return result.rows[0];
	}

	/** Send a random 6-digit code to user via SMS to reset password */

	static async resetCode(username){
		const user = await User.get(username);
		const code = cryptoRandomString({length: 6, type: 'numeric'});
		const hashedCode = await bcrypt.hash(code, BCRYPT_WORK_FACTOR);

		await db.query(
			`INSERT INTO login_resets (
				username,
				random_code,
				reset_at
				)
			VALUES
			($1, $2, current_timestamp)`,
			[ username, hashedCode ]
		);

		const body = `Here is your reset code: ${code}. Go to /:username/reset-verification/ to reset password.`;
    const from = TWILIO_NUMBER;
    const to = `+${user.phone}`;

    const message = await client.messages.create({ body, from, to })
    console.log(message.sid);
	}

	/** Authenticate: is code sent is valid? Return boolean. */

	static async isValidCode(username, code){
		// TODO: Update password reset to evaluate code based on timestamp in SQL
		const result = await db.query(
			`SELECT username, random_code, reset_at
				FROM login_resets
				WHERE username = $1`,
			[ username ]
		);
		const user = result.rows[0];
		
		if (!user) throw new NotFoundError(`No such user: ${username}`);

		const hashedCode = user.random_code;
		const timestamp = user.reset_at;

		return (await bcrypt.compare(code, hashedCode) === true);
	}

	/** Update password for user */
  
	static async updatePassword(username, newPassword) {
		const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`UPDATE users
				SET password = $1
				WHERE username = $2
				RETURNING username, password, first_name, last_name, phone `,
		 [ hashedNewPassword, username ]
		);
		const user = result.rows[0];

		return user;
	}

	/** Delete password reset code for user */
  
	static async deleteResetCode(username) {
		await db.query(
			`DELETE FROM login_resets
				WHERE username = $1`,
		 [ username ]
		);
		console.log("reset code removed");
	}
  
  /** Authenticate: is username/password valid? Returns boolean. */
  
	static async authenticate(username, password) {
		const result = await db.query(
			`SELECT password
        FROM users
        WHERE username = $1`,
			[ username ]
		);
		const user = result.rows[0];
 
    return (user && 
           (await bcrypt.compare(password, user.password)) === true);
	}

  /** Update last_login_at for user */
  
	static async updateLoginTimestamp(username) {
		const result = await db.query(
			`UPDATE users
       SET last_login_at = current_timestamp
         WHERE username = $1
         RETURNING username `,
			[ username ]
		);
    const user = result.rows[0]; 

    if (!user) throw new NotFoundError(`No such user: ${username}`);
	}

	/** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

	static async all() {
		const results = await db.query(
			`SELECT username,
              first_name,
              last_name
        FROM users
        ORDER BY username`
		);

		return results.rows;
	}

	/** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

	static async get(username) {
		const result = await db.query(
			`SELECT username,
              first_name,
              last_name,
              phone,
              join_at,
              last_login_at
         FROM users
         WHERE username = $1`,
			[ username ]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No such user: ${username}`);

		return user;
	}

	/** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

	static async messagesFrom(username) {
		const results = await db.query(
			`SELECT m.id,
              m.from_username,
              m.to_username,
              u.first_name AS to_first_name,
              u.last_name AS to_last_name,
              u.phone AS to_phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
        JOIN users AS u ON m.to_username = u.username
        WHERE m.from_username = $1`,
			[ username ]
		);
		const messages = results.rows;

		if (messages.length === 0) throw new NotFoundError(`No messages from user: ${username}`);

		return messages.map( m => ({
				id: m.id,
				to_user: {
					username: m.to_username,
					first_name: m.to_first_name,
					last_name: m.to_last_name,
					phone: m.to_phone
				},
				body: m.body,
				sent_at: m.sent_at,
				read_at: m.read_at
		}));
	}

	/** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

	static async messagesTo(username) {
		const results = await db.query(
			`SELECT m.id,
              m.from_username,
              m.to_username,
              u.first_name AS from_first_name,
              u.last_name AS from_last_name,
              u.phone AS from_phone,
              m.body,
              m.sent_at,
              m.read_at
          FROM messages AS m
          JOIN users AS u ON m.from_username = u.username
          WHERE m.to_username = $1`,
			[ username ]
		);
		const messages = results.rows;

		if (messages.length === 0) throw new NotFoundError(`No messages to user: ${username}`);

		return messages.map( m => ({
				id: m.id,
				from_user: {
					username: m.from_username,
					first_name: m.from_first_name,
					last_name: m.from_last_name,
					phone: m.from_phone
				},
				body: m.body,
				sent_at: m.sent_at,
				read_at: m.read_at
		}));
	}
}

module.exports = User;
