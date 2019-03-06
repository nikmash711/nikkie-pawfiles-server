'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');

const Pawfile = require('../models/pawfile');
const Post = require('../models/post');

const router = express.Router();
router.use(formData.parse());

function isEmpty(obj) {
  for(let key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

/* ========== CREATE A POST ========== */
router.post('/:pawfileId', (req, res, next) => {
  const newPost = req.body;
  const {pawfileId} = req.params;
  const userId = req.user.id;
  newPost.userId = userId;

  console.log('post is', newPost);

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(userId) ) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  if(!newPost.type || !newPost.date || !newPost.title){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing information for the post!',
      reason: 'MissingContent',
      status: 400,
      location: 'post'
    };
    return next(err);
  }

  let photo, post;
  
  //Need to first check that the post being added to the pawfile a) belongs to this user and b) is a valid Pawfile id
  Pawfile.find({_id: pawfileId, userId})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      return Post.create(newPost);
    })
    .then(newPost=> {
      console.log('created new post')
      post = newPost;
      if(!isEmpty(req.files)){
        console.log('1')
        photo = Object.values(req.files);
        // first upload the image to cloudinary
        return cloudinary.uploader.upload(photo[0].path);
      }
      else{
        console.log('2')
        return null;
      }
    })
    .then(results => {
      if(results){
        photo = {
          public_id: results.public_id,
          url: results.secure_url,
        };
        return Post.findOneAndUpdate({_id: post._id}, {memory_img: photo}, {new: true} );
      }
      else{
        console.log('3')
        return Post.findById(post._id);
      }
    })
    .then(updatedPost => {
      console.log('4')
      post=updatedPost;
      return Pawfile.findByIdAndUpdate(pawfileId, {$push: {posts: post.id}}, {new: true})
        .populate('reminders')
        .populate('posts');
    })
    .then(()=>{
      return res.location(`http://${req.headers.host}/posts/${post.id}`).status(201).json(post);
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

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)  ) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }
  
  if(!updatedPost.type || !updatedPost.date || !updatedPost.title){
    //this error should be displayed to user incase they forget to add a note. Dont trust client!
    const err = {
      message: 'Missing information for the post!',
      reason: 'MissingContent',
      status: 400,
      location: 'post'
    };
    return next(err);
  }
  
  //check if user is authorized to update this pawfile, and the pawfile has this post: 
  Pawfile.find({_id: pawfileId, userId, posts:{$in: postId}})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      //check to see if user has access to this post: 
      return Post.find({_id: postId, userId});
    })
    .then(post=>{
      if(post.length===0){
        return Promise.reject();
      }
      return Post.findOneAndUpdate({_id: postId, userId: userId}, {title: updatedPost.title, date: updatedPost.date, description: updatedPost.description} , {new: true});
    })
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

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  //remove the post
  const postRemovePromise = Post.findOneAndDelete({_id: postId, userId: userId});

  // Don't delete the pawfile associated with the post to be deleted, but just remove the post from the posts array
  const pawfilePostPullPromise = Pawfile.findOneAndUpdate({_id: pawfileId, userId}, { $pull: { posts: postId } }, {new: true});

  Pawfile.find({_id: pawfileId, userId, posts:{$in: postId}})
    .then(pawfile=>{
      if(pawfile.length===0){
        return Promise.reject();
      }
      //check to see if user has access to this post: 
      return Post.find({_id: postId, userId});
    })
    .then(post=>{
      if(post.length===0){
        return Promise.reject();
      }
      // delete the reminder and update the pawfile in parallel using .all
      return Promise.all([postRemovePromise, pawfilePostPullPromise]);
    })
    .then(([post, pawfile]) => {
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