'use strict';
const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');
const User = require('../models/user');

const { pawfiles, reminders, posts, users } = require('../db/seed/data');

console.log(`Connecting to mongodb at ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useCreateIndex : true })
  .then(() => {
    console.log('Dropping the Database...');
    mongoose.connection.db.dropDatabase();
  })
  .then(()=> {
    console.log('Seeding Database...');
    return Promise.all([
      Pawfile.insertMany(pawfiles),
      Reminder.insertMany(reminders),
      Post.insertMany(posts),
      User.insertMany(users),
      // User.createIndexes()
    ]);
  })
  .then(([pawfiles, reminders, posts, users]) => {
    console.log(`Inserted ${pawfiles.length} Pawfiles and ${reminders.length} reminders and ${posts.length} posts and ${users.length} users`);
  })
  .then(() => {
    console.log('Disconnecting...');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
  });

// this drops whatever is currently in the database and repopulates it when we run it with node ./utils/seed-database.js