'use strict';

const mongoose = require('mongoose');

const pawfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  gender: { type: String, required: true }, 
  img: { type: Object, required: true},
  breed: { type: String },
  weight: { type: String }, 
  birthday: { type: String },
  bio: { type: String },
  reminders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'}],
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
pawfileSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Pawfile = mongoose.model('Pawfile', pawfileSchema); 

module.exports = Pawfile;