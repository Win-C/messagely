# Messagely

Messagely is a backend RESTful API for users to send messages privately to each other. Users can sign up with their name, phone number, and password. Messages can be sent user-to-user. The API includes creating and reading messages including getting all messages and specific messages sent to or received from a user. 

<!-- TODO: Check out the deployed app <a href="">here</a>. -->

Note: the following documentation focuses on the backend with a simple frontend. A more interactive frontend is in the works - stay tuned!

## Motivation

Messagely was an opportunity to work with authentication and authorization routing patterns as well as working with the popular Twilio app. 

## Screenshots

<!-- TODO: TBU with application screenshots -->

**Database Entity Relationships**

<img src="/static/images/database-er-diagram.png" width="500" height="250">

- Key relationship: each user may have sent and received many messages (many-to-many)

## Build status
- Initial users and messages routes with authentication and authorization completed
- Successful incorporation of Twilio API - sending message to users via SMS
- WIP on minimum viable product

## Current features
- user model includes register, authenticate, updateLoginTimestamp, all, get, messagesFrom, and messagesTo methods
- message model includes create, markRead, and get methods
- auth routes include /login and /register using JSON web tokens
- users routes include
    - GET / - get list of users
    - GET /:username - get detail of users
    - GET /:username/to - get messages to user
    - GET /:username/from - get messages from user
- messages routes include 
    - GET /:id - get detail of a message
    - POST / - create a message
    - POST /:id/read - mark message as read
- Note: all routes check for security:
    - any logged-in user can see the list of users 
    - only that user can view their get-user-detail route, or their from-messages or to-messages routes
    - only the sender or recipient of a message can view the message-detail route
    - only the recipient of a message can mark it as read
    - any logged-in user can send a message to any other user
- Integration tests written for routes
- SMS is sent with a new message

## Upcoming features
- SMS-backed password reset feature - WIP
- Build out of CRUD routes for messages to include updating and deleting messages
- Build out of CRUD routes for users to include updating user informaing and deleting users by admin
- Build a front end for application
- Refactor classes for instance methods instead of static methods

## Tech stack
- PostgreSQL for database
- Express.js / Node.js for backend
- Twilio for sending SMS of messages

## Dependencies
**Backend dependencies** include:
- bcrypt
- body-parser
- cors
- dotenv
- express
- express-cors
- jsonwebtoken
- pg
- supertest
- twilio

Note: See package.json file for full list and associated package versions.

## Installation
**Backend Development Setup**

A starter database is provided which can be used to create and seed a messagely database:
```console
createdb messagely 
psql messagely < messagely.sql
```

We used Node.js for our back-end JavaScript runtime environment. To install the backend dependencies from the package.json file:
```console
npm install
```

Then start up the server (which we have set to start on port 3001):
```console
npm start
```

## Testing

To run tests:
```console
npm test
```

Note: any time you run our tests here, you will need to use the -i flag for Jest so that the tests run "in band" (in order, not at the same time). A npm script has been used to do this. See package.json file.

**Coverage Report**:

<img src="/static/images/test-coverage-report.png" width="600" height="250">

## Authors
- Winnie Chou
- Tracy Jiang (pair programming partner)