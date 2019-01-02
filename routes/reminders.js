'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

/* ========== CREATE A REMINDER ========== */
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


/* ========== UPDATE A REMINDER ========== */
router.put('/:pawfileId/:reminderId', (req, res, next) => {
  const{ pawfileId, reminderId }= req.params;
  const updatedReminder = req.body;
  
  Reminder.findOneAndUpdate({_id: reminderId}, updatedReminder, {new: true})
    .then(reminder=>{
      //now that reminder has been updated, resend the updated Pawfile
      return Pawfile.findById (pawfileId)
        .populate('reminders')
        .populate('posts');
    })
    .then(pawfile => {
      if(pawfile){
        console.log('pawfile being sent back is', pawfile);
        res.status(200).json(pawfile);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


/* ========== DELETE A REMINDER ========== */
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