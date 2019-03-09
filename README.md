
# [Pawfiles](https://pawfiles.herokuapp.com/)

From a list of their vets, vaccination schedule, and medical history, to remembering something hilarious they did the other day, it can be easy to forget important things about your pet. Fur-tunately Pawfiles is here to help you keep track of your pet's most memorable moments! Whether it's a medical record or a cute memory you just don't want to forget, this is paws-itively the purr-fect place to document it all and keep a timeline of your pet's life!

## Features: 
:white_check_mark: Users can create an account for themselves with their first and last name, a username, and password
<img src="https://drive.google.com/uc?export=view&id=1VDqMikkH2TIo6T85rhvAGw-WoEPQyWWf" alt="homepage" width="400px" />
<img src="https://drive.google.com/uc?export=view&id=1BFI7bm8jbBtEjPOkyOR7vn2UR1drR98V" alt="homepage" width="400px" />

:white_check_mark: Users will be directed to a home page where they can see all of their pets, can add a new pet pawfile by filling out a brief form, can sort their pets by age or name, and search their pets. Users can have as many pawfiles as they do pets!

<img src="https://drive.google.com/uc?export=view&id=1G6W9OH4WxP-sSxTApCLP4OE8E8b-vOwA" alt="homepage" width="900px" />

:white_check_mark: Users can add posts for each pet - it can be a memory post with a photo corresponding to the memory, or a medical post to document symptoms, vet diagnosis, medications, and vaccinations

<img src="https://drive.google.com/uc?export=view&id=1vIca4Q-ds8yC1khECwNbc9AJYBmupGbg" alt="homepage" width="900px" />

:white_check_mark: Posts are organized on the Pawfile chronologically by the date the user inputted, but users can search for a specific post and filter categorically

:white_check_mark: Users can create reminders for each pet, with an optional time or date

:white_check_mark: Users can edit and delete posts, reminders, pictures, or any information in their pet's pawfile 

:white_check_mark: Users can update their password, first name, last name, or username after they're logged in

## Tech Specs: 
**Front-end:**
- React
- Redux
- Javascript
- Socket.io 
- HTML5
- CSS
- Enzyme

**Back-end**
- Node
- Express
- MongoDB hosted on mLab
- JWT 
- Passport 
- Mocha/Chai

**Workflow**
- Agile/SCRUM 

## Schemas: 

### User
```
{
  firstName:  {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
}
```

### Pawfile
```
{
  name: { type: String, required: true },
  species: { type: String, required: true },
  gender: { type: String, required: true }, 
  img: { type: Object, required: true},
  breed: { type: String },
  weight: { type: String }, 
  birthday: { type: String },
  bio: { type: String },
  reminders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reminder'}],
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}
```

### Post 
```
{
  type: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String}, 
  memory_img: { type: Object},
  symptoms: [{type: String}],
  vaccinations: [{ type: String }],
  prescriptions: [{ type: String }],
  doctor: { type: String, },
  office: { type: String },
  notes: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}
```

### Reminder
```
{
  note: { type: String, required: true },
  date: { type: String },
  time: { type: String, },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}
```

## Future Updates
:point_right: Users will provide emails at login and can consequently reset passwords if they're unable to login 

:point_right: Users will have a more convenient way of accessing their pet's full vaccination, prescription, and doctor history depending on the posts they've created

:point_right: Users can upload pdfs of invoices with a medical post

## Links
[Client Repo](https://github.com/nikmash711/pawfiles-client)

[Deployed Client On Heroku](https://pawfiles.herokuapp.com/)

[Deployed Server On Heroku](https://pawfiles-server.herokuapp.com/)

## Demo Info:
Username: demo123

Password: demo123
