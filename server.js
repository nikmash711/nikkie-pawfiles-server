'use strict';

const express = require('express');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/pawfiles', (req, res) => {
  res.json({
    user: {firstName: 'Nikkie', lastName: 'Mashian'},
    sortingPetsMethod: '',
    showPawfileForm: false,
    showMedicalForm: false,
    showMemoryForm: false,
    currentPetId: undefined,
    currentSearchTerm: '',
    categoryFilter: '',
    toggleNavbar:false,
    pawfiles: [
      {
        id: 0,
        name: 'Mushy',
        species: 'Cat',
        gender: 'Female',
        breed: 'Domestic Mix',
        weight: '8 lbs',
        birthday: '2016-10-26',
        bio: 'Meow. I\'m a cute troublemaker. I\'ll purr then hiss. Give me scritches?',
        img: 'https://i.ibb.co/y8hFnkL/2.jpg',
        reminders: [
          {
            id: 0,
            note: 'Trim Nails',
            date: '2016-10-26',
          },
          {
            id: 1,
            note: 'Vet Appointment',
            date: '2016-11-26',
          },
        ],
        posts: [
          {
            id: 0,
            type: 'memory',
            title: 'Mushy learns how to open the door',
            date: 'Fri Dec 14 2018',
            description: 'I walked into the living room and saw her opening it with her claws. How dare she!',
            memory_img: 'https://i.ibb.co/YXHrzCq/Screen-Shot-2018-12-31-at-8-30-37-AM.png" alt="Screen-Shot-2018-12-31-at-8-30-37-AM'
          },
          {
            id: 1,
            type: 'medical',
            title: 'Shes throwing up again:(',
            date: 'Fri Dec 14 2017',
            symptoms: ['lethargic', 'no appetite'],
            vaccinations:['rabies'],
            prescriptions:['Frontline flea'],
            doctor: 'Dr. Moon',
            notes: 'Gave her fluids for the day. Wont let her eat until tomorrow. Try laxatives.',
          }
        ],
        vaccinations: [
          {
            name: 'Rabies',
            date: '2018-10-12'
          }
        ],
        prescriptions:[]
      },
      {
        id: 1,
        name: 'Muffin',
        species: 'Dog',
        gender: 'Male',
        breed: 'Pom/Yorkie Mix',
        birthday: '2010-01-10',
        bio: 'Ruff. I want to always play and go on walks. Did you say snack?',
        img: 'https://i.ibb.co/stMyFMp/IMG-6267.png',
        reminders: [
          {
            id: 0,
            note: 'Give Shot',
            date: 'Daily'
          },
        ]
      }, 
    ]
  });
});

app.listen(8080);
