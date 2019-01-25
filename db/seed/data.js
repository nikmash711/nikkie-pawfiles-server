'use strict';

const pawfiles =[
  {
    _id: '111111111111111111111101',
    userId: '000000000000000000000001',
    name: 'Mushy',
    species: 'Cat',
    gender: 'Female',
    breed: 'Domestic Mix',
    weight: '8 lbs',
    birthday: '2016-10-26',
    bio: 'Meow. I\'m a cute troublemaker. I\'ll purr then hiss. Give me scritches?',
    img: {
      public_id: 'a0t3vhjkae7chm6ncoau',
      url: 'https://res.cloudinary.com/dnn1jf0pl/image/upload/v1548123621/a0t3vhjkae7chm6ncoau.jpg',
    },
    reminders: ['333333333333333333333301', '333333333333333333333302'],
    posts: ['222222222222222222222201', '222222222222222222222202'],
  },
  {
    _id: '111111111111111111111102',
    userId: '000000000000000000000002',
    name: 'Muffin',
    species: 'Dog',
    gender: 'Male',
    breed: 'Pom/Yorkie Mix',
    birthday: '2010-01-10',
    bio: 'Ruff. I want to always play and go on walks. Did you say snack?',
    img: {
      public_id: 'w4luypagygysrauycbag',
      url: 'https://res.cloudinary.com/dnn1jf0pl/image/upload/v1548282108/w4luypagygysrauycbag.jpg',
    },
    reminders: ['333333333333333333333303'],
    posts: ['222222222222222222222203']
  }, 
];

const reminders = [
  {
    _id: '333333333333333333333301',
    note: 'Trim Nails',
    date: '2019-10-26',
    time: '18:00',
    userId: '000000000000000000000001',
  },
  {
    _id: '333333333333333333333302',
    note: 'Vet Appointment',
    date: '2019-11-26',
    time: '04:00',
    userId: '000000000000000000000001',
  },
  {
    _id: '333333333333333333333303',
    note: 'Daily Injection',
    date: '2019-01-26',
    time: '01:00',
    userId: '000000000000000000000002',
  },
];

const posts = [
  {
    _id: '222222222222222222222201',
    type: 'memory',
    title: 'Mushy learns how to open the door',
    date: '2016-10-26',
    description: 'I walked into the living room and saw her opening it with her claws. How dare she!',
    memory_img: 'https://i.ibb.co/YXHrzCq/Screen-Shot-2018-12-31-at-8-30-37-AM.png" alt="Screen-Shot-2018-12-31-at-8-30-37-AM',
    userId: '000000000000000000000001',
  },
  {
    _id: '222222222222222222222202',
    type: 'medical',
    title: 'Shes throwing up again:(',
    date: '2017-10-26',
    symptoms: ['lethargic', 'no appetite'],
    vaccinations:['rabies'],
    prescriptions:['Frontline flea'],
    doctor: 'Dr. Moon',
    notes: 'Gave her fluids for the day. Wont let her eat until tomorrow. Try laxatives.',
    userId: '000000000000000000000001',
  },
  {
    _id: '222222222222222222222203',
    type: 'medical',
    title: 'Diabetes',
    date: '2018-10-26',
    symptoms: ['peeing alot', 'drinking a lot'],
    prescriptions:['Insulin'],
    doctor: 'Dr. Ezra',
    notes: 'Have to give her a daily shot of insulin. Uh oh',
    userId: '000000000000000000000002',
  }
];

const users = [
  {
    _id: '000000000000000000000001',
    firstName: 'Nikkie',
    lastName: 'Mashian',
    username: 'nikmash',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  },
  {
    _id: '000000000000000000000002',
    firstName: 'Nate',
    lastName: 'Pazooky',
    username: 'npazooky',
    // hash for "password"
    password: '$2a$10$QJCIX42iD5QMxLRgHHBJre2rH6c6nI24UysmSYtkmeFv6X8uS1kgi'
  }
];

module.exports = {pawfiles, reminders, posts, users};