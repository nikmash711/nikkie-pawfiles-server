'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

/* ========== CEATE A POST ========== */
router.post('/:pawfileId', (req, res, next) => {
  console.log('in post request');
  const newPost = req.body;
  const {pawfileId} = req.params;
  let postResponse;
  
  Post.create(newPost)
    .then(post => {
      postResponse = post;
      return Pawfile.findByIdAndUpdate(pawfileId, {$push: {posts: post.id}}, {new: true})
        .populate('reminders')
        .populate('posts');
    })
    .then(()=>{
      return res.location(`http://${req.headers.host}/api/posts/${postResponse.id}`).status(201).json(postResponse);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== UPDATE A POST ========== */
router.put('/:pawfileId/:postId', (req, res, next) => {
  const{ pawfileId, postId }= req.params;
  const updatedPost = req.body;
  let postResponse;
  
  Post.findOneAndUpdate({_id: postId}, updatedPost, {new: true})
    .then(post=>{
      postResponse=post;
      return Pawfile.findById (pawfileId)
        .populate('reminders')
        .populate('posts');
    })
    .then(() => {
      if(postResponse){
        res.status(200).json(postResponse);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE A POST ========== */
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