"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");


describe("User Routes Test", function () {

  let testUserToken;

  beforeEach(async function (){
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    testUserToken = jwt.sign({ username: "test1" }, SECRET_KEY);
  });

  /** GET /users => {users: [...]}  */

  test("can get list of users", async function () {
    let response = await request(app)
        .get("/users")
        .send({ _token: testUserToken });

    expect(response.body).toEqual({
      users: [
        {
          username: "test1",
          first_name: "Test1",
          last_name: "Testy1",
        },
      ],
    });
  });

  /** GET /users/:username => {user}  */


  /** GET /users/:username/to => {messages: [...]}  */


  /** GET /users/:username/from => {messages: [...]}  */


})