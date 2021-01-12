"use strict";


const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const router = new Router();
const User = require("../models/user.js")
const { SECRET_KEY, JWT_OPTIONS } = require("../config.js");
const { BadRequestError } = require("../expressError.js");

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  if (await User.authenticate(username, password) !== true) {
    throw new BadRequestError("Invalid user/password");
  }

  await User.updateLoginTimestamp(username);

  const token = jwt.sign({ username }, SECRET_KEY, JWT_OPTIONS);

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
  
  const token = jwt.sign({ username }, SECRET_KEY, JWT_OPTIONS);
  return res.json({ token });
});
// end

module.exports = router;