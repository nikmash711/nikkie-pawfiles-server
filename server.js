'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const pawfilesRouter = require('./routes/pawfiles');
const remindersRouter = require('./routes/reminders');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const {CLIENT_ORIGIN, PORT, MONGODB_URI } = require('./config');

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Log all requests, skip during tests
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Parse request body
app.use(express.json());

//Configure Passport to utilize the strategies, use them to create middleware fns, and pass in those middleware fns to the endpoints to authenticate and authorize access!
passport.use(localStrategy);
passport.use(jwtStrategy);

//we include this here so we don't have to for every single router endpoint
const options = {session: false, failWithError: true};
const jwtAuth = passport.authenticate('jwt', options);
const localAuth = passport.authenticate('local', options);

app.use('/api/pawfiles', jwtAuth, pawfilesRouter);
app.use('/api/reminders', jwtAuth, remindersRouter);
app.use('/api/posts', jwtAuth, postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', localAuth, authRouter); //for login
app.use('/api', jwtAuth, authRouter); //for refresh
//Any endpoint that passes the jwtAuth strategy and is validted: The `req.user` has a value now because of `done(null, payload.user)` in JWT Strategy

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

if (require.main === module) {
  //  // Connect to DB and Listen for incoming connections
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true }) //Mongo will automatically create the db here if it doesnt exist, and then mongoose will automatically create any collections that dont already exist by going through your models
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error('\n === Did you remember to start `mongod`? === \n');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app; // Export for testing