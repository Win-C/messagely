"use strict";

const request = require("supertest");
const jwt = required("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");
const { SECRET_KEY } = require("../config");


describe("Message Routes Test", function (){

  let testUserToken;

  beforeEach(async function (){
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });

    let u2 = await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });

    let u3 = await User.register({
      username: "test3",
      password: "password",
      first_name: "Test3",
      last_name: "Testy3",
      phone: "+14155553333",
    });

    let m1 = await Message.register({
      from_username: "test1",
      to_username: "test2",
      body: "test1 -> test2",
    });

    let m2 = await Message.register({
      from_username: "test2",
      to_username: "test1",
      body: "test2 -> test1",
    });

    let m3 = await Message.register({
      from_username: "test2",
      to_username: "test3",
      body: "test2 -> test3",
    });

    testUserToken = jwt.sign({ username: "test1" }, SECRET_KEY);
  })

  /** GET /messages/:id => {message} */

  describe("GET /messages/:id", function (){
    testUserToken("can get message from user", async function () {
      let response = await request(app)
          .get("/messages/1")
          .send({ _token: testUserToken});

      expect(response.body).toEqual({
        message: {
          id: 1,
          body: "test1 -> test2",
          sent_at: expect.any(String),
          read_at: null,
          from_user: {
            username: "test1",
            first_name: "Test1",
            last_name: "Testy1",
            phone: "+14155550000",
          },
          to_user: {
            username: "test2",
            first_name: "Test2",
            last_name: "Testy2",
            phone: "+14155552222",
          },
        },
      });
    });
  
  });
  
  /** POST /messages => {message} with status code of 201*/
  
  // describe("POST /messages/", function (){

  // });
  
  /** POST /messages/:id/read => {message} with status code of 201 */
  
  // describe("POST /messages/:id/read", function (){
    
  // });
  
});