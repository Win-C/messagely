"use strict";

/** Common config for message.ly */

// read .env files and make environmental variables
// Note: eads your .env file that you created with SECRET_KEY
require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///messagely_test"
    : "postgresql:///messagely";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;

const JWT_OPTIONS = { expiresIn: 60*60 }; // 1 hour

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  JWT_OPTIONS,
};