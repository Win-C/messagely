"use strict";

/** Twilio client for message.ly */

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

module.exports = client;