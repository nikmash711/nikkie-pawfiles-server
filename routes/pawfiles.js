'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

router.get('/', (req, res, next) => {
  Pawfile.find()
    .populate('reminders')
    .populate('posts')
    .then(pawfiles => {
      res.json(pawfiles);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;