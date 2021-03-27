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

- Key relationships:
    - Each user may have sent and received many messages (many-to-many)

## Build status
- Initial users and messages routes with authentication and authorization completed
- Successful incorporation of Twilio API - sending message to users via SMS
- WIP on minimum viable product

## Current features
- 

## Upcoming features
- Build out of CRUD routes for messages to include updating and deleting messages
- Build out of CRUD routes for users to include updating user informaing and deleting users by admin

## Tech stack
- PostgreSQL for database
- Express / JavaScript for backend

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

<img src="" width="600" height="250">

## Authors
- Winnie Chou
- Tracy Jiang (pair programming partner)