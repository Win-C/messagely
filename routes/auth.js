"use strict";

const Router = require("express").Router;
const router = new Router();
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user.js")
const { SECRET_KEY, JWT_OPTIONS } = require("../config.js");

/** POST /login: {username, password} => {token} */

router.post("/login-1", authenticateJWT, async function (req, res, next) {
  const { username, password } = req.body;

  if (user) {
    if (await bcrypt.compare(password, user.password) === true) {
      return res.json({ message: "Logged in!" });
    }
  }
  throw new UnauthorizedError("Invalid user/password");
});

// end

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
  const { username, password, first_name, last_name, phone } = req.body;

  const newUser = User.register({ username, password, first_name, last_name, phone });
  let payload = { username: newUser.username };
  let token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);

  return { token };
});

// end

module.exports = router;