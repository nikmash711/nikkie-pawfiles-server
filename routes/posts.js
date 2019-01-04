'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Post = require('../models/post');

const router = express.Router();

/* ========== CREATE A POST ========== */
router.post('/:pawfileId', (req, res, next) => {
  console.log('in post request');
  const newPost = req.body;
  const {pawfileId} = req.params;
  const userId = req.user.id;
  newPost.userId = userId;

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
  const userId = req.user.id;
  let postResponse;
  
  Post.findOneAndUpdate({_id: postId, userId: userId}, updatedPost, {new: true})
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
  const userId = req.user.id;


  //remove the post
  const postRemovePromise = Post.findOneAndDelete({_id: postId, userId: userId});

  // Don't delete the pawfile associated with the post to be deleted, but just remove the post from the posts array
  const pawfilePostPullPromise = Pawfile.findOneAndUpdate({pawfileId, userId},
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