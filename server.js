'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const pawfilesRouter = require('./routes/pawfiles');

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

app.use('/api/pawfiles', pawfilesRouter);

// app.get('/api/:pawfileId', (req, res, next) => {
  
//   let pawfile = pawfiles.find(pawfile=>req.params.pawfileId==pawfile.id);

//   console.log('in server, pawfile is', pawfile);
//   if(pawfile){
//     console.log('sending back response');
//     res.json({
//       pawfile: pawfile
//     });
//   }
//   else{
//     console.log('jumping to error');
//     next();
//   }

// });

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