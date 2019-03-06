'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

router.use(formData.parse());


/* GET ALL PAWFILES */
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  Pawfile.find({userId})
    .populate('reminders')
    .populate('posts')
    .then(pawfiles => {
      res.json(pawfiles);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:pawfileId', (req, res, next) => {
  const {pawfileId} = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  Pawfile.findOne({_id: pawfileId, userId})
    .populate('reminders')
    .populate('posts')
    .then(pawfile => {
      if(pawfile){
        res.json(pawfile);
      }
      else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE A PAWFILE ========== */
router.post('/', (req, res, next) => {
  const newPawfile = req.body;
  const userId = req.user.id;
  newPawfile.userId = userId;

  const file = Object.values(req.files);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }

  if(!newPawfile.name || !newPawfile.gender || !newPawfile.species || !file){
    const err = {
      message: 'Missing information for the pawfile!',
      reason: 'MissingContent',
      status: 400,
      location: 'pawfile'
    };
    return next(err);
  }

  // first upload the image to cloudinary
  cloudinary.uploader.upload(file[0].path)
    .then(results => {
      newPawfile.img = {
        public_id: results.public_id,
        url: results.secure_url,
      };
      return Pawfile.create(newPawfile);
    })
    .then(pawfile => {
      res.location(`http://${req.headers.host}/pawfiles/${pawfile.id}`).status(201).json(pawfile);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE PAWFILE ========== */
router.put('/:pawfileId', (req, res, next) => {
  const{ pawfileId }= req.params;
  const updatedPawfile = req.body;
  const userId = req.user.id;

  const file = Object.values(req.files);

  if (!mongoose.Types.ObjectId.isValid(pawfileId) || !mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `id` is not a valid Mongoose id!');
    err.status = 400;
    return next(err);
  }
   
  if((!updatedPawfile.name || !updatedPawfile.gender || !updatedPawfile.species) && !file){
    const err = {
      message: 'Missing information for the pawfile!',
      reason: 'MissingContent',
      status: 400,
      location: 'pawfile'
    };
    return next(err);
  }

  //if theres an image/file being updated, we need to upload that to cloudinary, and then do the next step: 
  if(file.length===1){
    cloudinary.uploader.upload(file[0].path)
      .then(results => {
        updatedPawfile.img = {
          public_id: results.public_id,
          url: results.secure_url,
        };
        return updatedPawfile;
      })
      .then(updatedPawfile=>{
        return Pawfile.findOneAndUpdate({_id: pawfileId, userId}, updatedPawfile, {new: true}).populate('reminders') .populate('posts');
      })
      .then(pawfile => {
        if(pawfile){
          res.status(200).json(pawfile);
        }
        else{
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  }
  else{
    Pawfile.findOneAndUpdate({_id: pawfileId, userId}, updatedPawfile, {new: true}).populate('reminders') .populate('posts')
      .then(pawfile => {
        if(pawfile){
          res.status(200).json(pawfile);
        }
        else{
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  }
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:pawfileId', (req, res, next) => {
  const { pawfileId } = req.params;
  const userId = req.user.id;

  const postsRemovePromise = Post.deleteMany({userId: userId});
  const remindersRemovePromise = Reminder.deleteMany({userId: userId});
  const pawfileDeletePromise =  Pawfile.findOneAndDelete({_id:pawfileId, userId});


  return Promise.all([postsRemovePromise, remindersRemovePromise, pawfileDeletePromise])
    .then((pawfile) => {
      if(!pawfile){
        // if trying to delete something that no longer exists or never did
        return next();
      }
      else{
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;