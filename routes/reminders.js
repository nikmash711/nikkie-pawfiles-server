'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

/* ========== POST/CREATE A REMINDER ========== */
router.post('/:pawfileId', (req, res, next) => {
  const newReminder = req.body;
  const {pawfileId} = req.params;
  console.log('the new reminder is', newReminder);
  Reminder.create(newReminder)
    .then(reminder => {
      return Pawfile.findByIdAndUpdate(pawfileId, {$push: {reminders: reminder.id}}, {new: true})
        .populate('reminders')
        .populate('posts');
    })
    .then(pawfile=>{
      return res.json(pawfile);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;