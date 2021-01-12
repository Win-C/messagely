"use strict";


const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const router = new Router();
const User = require("../models/user.js")
const { SECRET_KEY, JWT_OPTIONS } = require("../config.js");
const { UnauthorizedError } = require("../expressError.js");

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  if (User.authenticate(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY);
    req.body._token = token;
    console.log("token = ", token);
    return res.json({ token });
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
  User.register({ username, password, first_name, last_name, phone });
  const token = jwt.sign({ username }, SECRET_KEY, JWT_OPTIONS);
  req.body._token = token;

  return res.json({ token });
});
// end

module.exports = router;