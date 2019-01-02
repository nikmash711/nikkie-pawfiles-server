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

/* DELETE REMINDER */
router.delete('/:pawfileId/:reminderId', (req, res, next) => {
  const { pawfileId, reminderId } = req.params;

  //remove the reminder
  const reminderRemovePromise = Reminder.findOneAndDelete({_id:reminderId});

  // Don't delete the pawfile associated with the reminder to be deleted, but just remove the reminder from the reminder array
  const pawfileReminderPullPromise = Pawfile.findByIdAndUpdate(pawfileId,
    { $pull: { reminders: reminderId } }
  );

  // delete the reminder and update the pawfile in parallel using .all
  Promise.all([reminderRemovePromise, pawfileReminderPullPromise])
    .then((reminder) => {
      // We want to make sure that it doesn't try to delete a reminder that no longer exists or never existed. To prevent that, we need to check this: 
      if(reminder[0]!==null){
        res.status(204).end();
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;