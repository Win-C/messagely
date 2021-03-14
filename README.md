# Messagely

TODO: Add description

Check out the deployed app <a href="">here</a>.

Note: the following documentation focuses on the backend. For frontend related documentation and commentary, please go <a href="">here</a> 

## Screenshots

TODO: TBU with application screenshots

**Database Entity Relationships**

<img src="/static/images/database-er-diagram.png" width="500" height="250">

- Key relationships:
    - Each user may have sent many messages 
    - Each user may have received many messages 

## Current features
- 

## Upcoming features
- 

## Tech stack
- PostgreSQL for database
- Express / JavaScript for backend

## Dependencies
**Backend dependencies** include:
- 

Note: See package.json file for full list and associated package versions.

**Frontend dependencies** include:
- 

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

Note: any time you run our tests here, you will need to use the -i flag for Jest so that the tests run "in band" (in order, not at the same time).

**Coverage Report**:

<img src="" width="600" height="250">


## Deployment


## Authors
- Winnie Chou
- Tracy Jiang (pair programming partner)