"use strict";

const Router = require("express").Router;
const router = new Router();
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user.js")
const { SECRET_KEY, JWT_OPTIONS } = require("../config.js");

/** POST /login: {username, password} => {token} */

router.post("/login", authenticateJWT, async function (req, res, next) {
  const { username, password } = req.body;

  const result = await db.query(
    `SELECT password
         FROM users
         WHERE username = $1`,
    [username]);
  const user = result.rows[0];
  const hashedPassword = user.password; 

  if (user && (await bcrypt.compare(password, hashedPassword) === true)) {
    return res.json({ req.body._token }); 
  } else {
      throw new UnauthorizedError("Invalid user/password");
  }
});
// end

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
  const { username, password, first_name, last_name, phone } = req.body;

  const { username } = User.register({ username, password, first_name, last_name, phone });
  const payload = { username };
  const token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);

  return res.json({ token });
});
// end

module.exports = router;