"use strict";

const Router = require("express").Router;
const router = new Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.js")
const { SECRET_KEY } = require("../config.js");
const { UnauthorizedError } = require("../expressError.js");

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  if (await User.authenticate(username, password) !== true) {
    throw new UnauthorizedError("Invalid user/password");
  }

  const token = jwt.sign({ username }, SECRET_KEY);
  await User.updateLoginTimestamp(username);

  return res.json({ token });
});
// end

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res, next) {
  const { username, password, first_name, last_name, phone } = req.body;
  await User.register({ username, password, first_name, last_name, phone });
  
  const token = jwt.sign({ username }, SECRET_KEY);
  await User.updateLoginTimestamp(username);
  
  return res.json({ token });
});
// end

module.exports = router;