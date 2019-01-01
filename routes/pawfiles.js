'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Pawfile = require('../models/pawfile');
const Reminder = require('../models/reminder');
const Post = require('../models/post');

const router = express.Router();

router.get('/', (req, res, next) => {
  Pawfile.find()
    .then(pawfiles => {
      res.json(pawfiles);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:pawfileId', (req, res, next) => {
  const {pawfileId} = req.params;

  Pawfile.findOne({_id: pawfileId})
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

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const newPawfile = req.body;
  console.log('the new pawfile is', newPawfile);
  Pawfile.create(newPawfile)
    .then(pawfile => {
      res.location(`http://${req.headers.host}/api/pawfiles/${pawfile.id}`).status(201).json(pawfile);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;