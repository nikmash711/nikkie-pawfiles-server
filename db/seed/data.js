'use strict';

const pawfiles =[
  {
    _id: '111111111111111111111101',
    name: 'Mushy',
    species: 'Cat',
    gender: 'Female',
    breed: 'Domestic Mix',
    weight: '8 lbs',
    birthday: '2016-10-26',
    bio: 'Meow. I\'m a cute troublemaker. I\'ll purr then hiss. Give me scritches?',
    img: 'https://i.ibb.co/y8hFnkL/2.jpg',
    reminders: ['333333333333333333333301', '333333333333333333333302'],
    posts: ['222222222222222222222201', '222222222222222222222202'],
  },
  {
    _id: '111111111111111111111102',
    name: 'Muffin',
    species: 'Dog',
    gender: 'Male',
    breed: 'Pom/Yorkie Mix',
    birthday: '2010-01-10',
    bio: 'Ruff. I want to always play and go on walks. Did you say snack?',
    img: 'https://i.ibb.co/stMyFMp/IMG-6267.png',
    reminders: ['333333333333333333333303'],
    posts: ['222222222222222222222203']
  }, 
];

const reminders = [
  {
    _id: '333333333333333333333301',
    note: 'Trim Nails',
    date: '2019-10-26',
  },
  {
    _id: '333333333333333333333302',
    note: 'Vet Appointment',
    date: '2019-11-26',
  },
  {
    _id: '333333333333333333333303',
    note: 'Daily Injection',
    date: '2019-01-26',
  },
];

const posts = [
  {
    _id: '222222222222222222222201',
    type: 'memory',
    title: 'Mushy learns how to open the door',
    date: 'Fri Dec 14 2018',
    description: 'I walked into the living room and saw her opening it with her claws. How dare she!',
    memory_img: 'https://i.ibb.co/YXHrzCq/Screen-Shot-2018-12-31-at-8-30-37-AM.png" alt="Screen-Shot-2018-12-31-at-8-30-37-AM'
  },
  {
    _id: '222222222222222222222202',
    type: 'medical',
    title: 'Shes throwing up again:(',
    date: 'Fri Dec 14 2017',
    symptoms: ['lethargic', 'no appetite'],
    vaccinations:['rabies'],
    prescriptions:['Frontline flea'],
    doctor: 'Dr. Moon',
    notes: 'Gave her fluids for the day. Wont let her eat until tomorrow. Try laxatives.',
  },
  {
    _id: '222222222222222222222203',
    type: 'medical',
    title: 'Diabetes',
    date: 'Fri Dec 11 2018',
    symptoms: ['peeing alot', 'drinking a lot'],
    prescriptions:['Insulin'],
    doctor: 'Dr. Ezra',
    notes: 'Have to give her a daily shot of insulin. Uh oh',
  }
];

module.exports = {pawfiles, reminders, posts};