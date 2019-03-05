'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String}, 
  memory_img: { type: Object, required: true},
  symptoms: [{type: String}],
  vaccinations: [{ type: String }],
  prescriptions: [{ type: String }],
  doctor: { type: String },
  office: { type: String },
  notes: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

//// Customize output for `res.json(data)`, `console.log(data)` etc.
postSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v; //delete _v
  }
});

const Post = mongoose.model('Post', postSchema); 

module.exports = Post;