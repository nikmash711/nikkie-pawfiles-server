'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');

const router = express.Router();

/* ========== CREATE A REMINDER ========== */
router.post('/:pawfileId', (req, res, next) => {
  const newReminder = req.body;
  const {pawfileId} = req.params;
  const userId = req.user.id;
  newReminder.userId = userId;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  if(!newReminder.note){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing a note for the reminder!',
      reason: 'MissingContent',
      status: 400,
      location: 'reminder'
    };
    return next(err);
  }

  ///trying to update the pawfile and just send back the reminder so im not sending back everything
  let reminderResponse;

  //Need to first check that the reminder being added to the pawfile a) belongs to this user and b) is a valid Pawfile id
  Pawfile.find({_id: pawfileId, userId})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      return Reminder.create(newReminder);
    })
    .then(reminder => {
      reminderResponse=reminder;
      return Pawfile.findByIdAndUpdate(pawfileId, {$push: {reminders: reminder.id}}, {new: true})
        .populate('reminders')
        .populate('posts');
    })
    .then(()=>{
      return res.location(`http://${req.headers.host}/api/reminders/${reminderResponse.id}`).status(201).json(reminderResponse);
    })
    .catch(err => {
      next(err);
    });
});


/* ========== UPDATE A REMINDER ========== */
router.put('/:pawfileId/:reminderId', (req, res, next) => {
  const{ pawfileId, reminderId }= req.params;
  const updatedReminder = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(reminderId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }
  
  if(!updatedReminder.note){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing a note for the reminder!',
      reason: 'MissingContent',
      status: 400,
      location: 'reminder'
    };
    return next(err);
  }
  
  let reminderResponse;
  

  //check if user is authorized to update this pawfile, and the pawfile has this reminder: 
  Pawfile.find({_id: pawfileId, userId, reminders:{$in: reminderId}})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      //check to see if user has access to this reminder: 
      return Reminder.find({_id: reminderId, userId});
    })
    .then(reminder=>{
      if(reminder.length===0){
        return Promise.reject();
      }
      return Reminder.findOneAndUpdate({_id: reminderId, userId}, updatedReminder, {new: true});
    })
    .then(reminder=>{
      reminderResponse = reminder;
      //now that reminder has been updated, resend the updated Pawfile
      return Pawfile.findById (pawfileId)
        .populate('reminders')
        .populate('posts');
    })
    .then(() => {
      if(reminderResponse){
        return res.status(200).json(reminderResponse);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

//Reminder gets deleted, but not from the pawfiles reminders - the pawfileReminderPullPromise is not working

/* ========== DELETE A REMINDER ========== */
router.delete('/:pawfileId/:reminderId', (req, res, next) => {
  const { pawfileId, reminderId } = req.params;
  const userId = req.user.id;
  console.log('deleting reminder with userId', userId);

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(reminderId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }
    
  //remove the reminder
  const reminderRemovePromise = Reminder.findOneAndDelete({_id:reminderId, userId});

  // Don't delete the pawfile associated with the reminder to be deleted, but just remove the reminder from the reminder array
  const pawfileReminderPullPromise = Pawfile.findOneAndUpdate({pawfileId, userId},
    { $pull: { reminders: reminderId } }
  );

  Pawfile.find({_id: pawfileId, userId, reminders:{$in: reminderId}})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      //check to see if user has access to this reminder: 
      return Reminder.find({_id: reminderId, userId});
    })
    .then(reminder=>{
      if(reminder.length===0){
        return Promise.reject();
      }
      // delete the reminder and update the pawfile in parallel using .all
      return Promise.all([reminderRemovePromise, pawfileReminderPullPromise]);
    })
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