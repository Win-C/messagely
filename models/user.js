"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { NotFoundError } = require("../expressError");

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
      [username, hashedPassword, first_name, last_name, phone]);

    return result.rows[0];
  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
              password
        FROM users
        WHERE username = $1`,
       [username]);
    const user = result.rows[0];

    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users
       SET last_login_at = current_timestamp
         WHERE username = $1`,
       [username]);
    
    // QUESTION: Is there a pro coding way to ensure this is done besides testing? (i.e. console.log message)
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT username,
              first_name,
              last_name
        FROM users`
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
       [username]);
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
              f.first_name AS from_first_name,
              f.last_name AS from_last_name,
              f.phone AS from_phone,
              m.to_username,
              t.first_name AS to_first_name,
              t.last_name AS to_last_name,
              t.phone AS to_phone,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
        JOIN users AS f ON m.from_username = f.username
        JOIN users AS t ON m.to_username = t.username
        WHERE f.username = $1`,
        [username]);
    const messages = results.rows;
    console.log("messages = ", messages);

    if (!messages) throw new NotFoundError(`No messages for user: ${username}`);

    return messages.map( m => {
      return {
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
      };
    });

    
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
  }
}


module.exports = User;
