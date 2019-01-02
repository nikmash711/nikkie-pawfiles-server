'use strict';

const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  vaccination: { type: String, required: true },
  date: { type: String, required: true },
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
vaccinationSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Vaccination = mongoose.model('Vaccination', vaccinationSchema); 

module.exports = Vaccination;
