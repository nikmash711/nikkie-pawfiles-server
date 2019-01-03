'use strict';

const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  note: { type: String, required: true },
  date: { type: String },
  time: { type: String, }
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
reminderSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Reminder = mongoose.model('Reminder', reminderSchema); 

module.exports = Reminder;
