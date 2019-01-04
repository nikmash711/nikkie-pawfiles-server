'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

//Need to do some validation to make sure the reminders/posts belong to the user: 

function validatePosts(posts, userId){
  //need to make sure each post in the posts array is associated with this userId. IF at any point it isn't, return false

  if(posts.length===0){
    return Promise.resolve(); //if arent even posts, move on 
  }

  //ADD IN A CHECK IF ITS AN ARRAY 

  const invalidIds = posts.filter((post) => !mongoose.Types.ObjectId.isValid(post));
  if (invalidIds.length) {
    const err = {
      message: 'The `posts` array contains an invalid `id`',
      status: 400,
    };
    return Promise.reject(err);
  }

  const filter = {};
  filter.$and = [{'_id':{$in: posts}}, {'userId':userId}]; //check every tag in the  collection and match if its one of the ones listed in the array. Userid must match and these ids have to be in the collection
  //do a single tag.find that looks for all the tags
  //count the number of valid tags and make sure it's the same 
  return Post.find(filter)
    .then(results=>{
      if(results.length!==posts.length){
        const err ={
          message: 'The `postId` is not valid',
          status:400,
        };
        return Promise.reject(err);
      }
      else{
        return Promise.resolve();
      }
    });
}

function validateReminders(reminders, userId){
  //need to make sure each reminder in the reminders array is associated with this userId. IF at any point it isn't, return false

  if(reminders.length===0){
    return Promise.resolve(); //if arent even reminders, move on 
  }

  //ADD IN A CHECK IF ITS AN ARRAY 

  const invalidIds = reminders.filter((reminder) => !mongoose.Types.ObjectId.isValid(reminder));
  if (invalidIds.length) {
    const err = {
      message: 'The `reminders` array contains an invalid `id`',
      status: 400,
    };
    return Promise.reject(err);
  }

  const filter = {};
  filter.$and = [{'_id':{$in: reminders}}, {'userId':userId}]; //check every reminder in the  collection and match if its one of the ones listed in the array. Userid must match and these ids have to be in the collection
  //do a single tag.find that looks for all the reminders
  //count the number of valid reminders and make sure it's the same 
  return Reminder.find(filter)
    .then(results=>{
      if(results.length!==reminders.length){
        const err ={
          message: 'The `reminderId` is not valid',
          status:400,
        };
        return Promise.reject(err);
      }
      else{
        return Promise.resolve();
      }
    });

}

/* GET ALL PAWFILES */
router.get('/', (req, res, next) => {
  const userId = req.user.id;

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

  console.log('the new pawfile is', newPawfile);

  Promise.all([
    //but what if there are no folders or tags? shouldn't it not do this? that'll resolve in the validate
    // validatePosts(newPawfile.posts, userId),
    // validateReminders(newPawfile.reminders, userId)
  ])
    .then(()=> Pawfile.create(newPawfile))
    .then(pawfile => {
      res.location(`http://${req.headers.host}/api/pawfiles/${pawfile.id}`).status(201).json(pawfile);
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

  Promise.all([
    //but what if there are no folders or tags? shouldn't it not do this? that'll resolve in the validate
    // validatePosts(updatedPawfile.posts, userId),
    // validateReminders(updatedPawfile.reminders, userId)
  ])
    .then(()=>{
      return  Pawfile.findOneAndUpdate({_id: pawfileId, userId}, updatedPawfile, {new: true})
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

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:pawfileId', (req, res, next) => {
  const { pawfileId } = req.params;
  const userId = req.user.id;

  Pawfile.findOneAndDelete({_id:pawfileId, userId})
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