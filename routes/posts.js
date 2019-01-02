'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

/* ========== POST/CREATE A POST ========== */
router.post('/:pawfileId', (req, res, next) => {
  console.log('in post request');
  const newPost = req.body;
  // const vaccinations = newPost.vaccinations;
  const {pawfileId} = req.params;
  Post.create(newPost)
    .then(post => {
      return Pawfile.findByIdAndUpdate(pawfileId, {$push: {posts: post.id}}, {new: true})
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

/* PUT */
router.put('/:pawfileId/:postId', (req, res, next) => {
  const{ pawfileId, postId }= req.params;
  const updatedPost = req.body;
  
  Post.findOneAndUpdate({_id: postId}, updatedPost, {new: true})
    .then(post=>{
      //Goal is to return an updated Pawfile with the updated post
      //the below line doesn't update a post in the pawfile, but replaces all posts with that post
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

/* DELETE Post */
router.delete('/:pawfileId/:postId', (req, res, next) => {
  const { pawfileId, postId } = req.params;

  //remove the post
  const postRemovePromise = Post.findOneAndDelete({_id: postId});

  // Don't delete the pawfile associated with the post to be deleted, but just remove the post from the posts array
  const pawfilePostPullPromise = Pawfile.findByIdAndUpdate(pawfileId,
    { $pull: { posts: postId } }
  );

  // delete the reminder and update the pawfile in parallel using .all
  Promise.all([postRemovePromise, pawfilePostPullPromise])
    .then((post) => {
      // We want to make sure that it doesn't try to delete a post that no longer exists or never existed. To prevent that, we need to check this: 
      if(post[0]!==null){
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