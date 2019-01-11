
# [Pawfiles](https://pawfiles.herokuapp.com/)

## Description
Wouldn't it be nice to keep a timeline of your pet's life? From a list of their vets, vaccination schedule, and medical history to remembering something hilarious or cute they did the other day, it can be easy to forget important things about your pet. Fur-tunately Pawfiles is here to help you keep track of your pet's most memorable moments! Whether it's a medical record or a cute memory you just don't want to forget, this is the purr-fect place to document it all!

## Features: 
:white_check_mark: Users can create an account for themselves with their first and last name, a username, and password
<img src="https://drive.google.com/uc?export=view&id=1VDqMikkH2TIo6T85rhvAGw-WoEPQyWWf" alt="homepage" width="400px" />
<img src="https://drive.google.com/uc?export=view&id=1BFI7bm8jbBtEjPOkyOR7vn2UR1drR98V" alt="homepage" width="400px" />

:white_check_mark: Users will be directed to a home page where they can see all of their pets, can add a new pet pawfile by filling out a brief form, can sort their pets by age or name, and search their pets. Users can have as many pawfiles as they do pets!

<img src="https://drive.google.com/uc?export=view&id=1G6W9OH4WxP-sSxTApCLP4OE8E8b-vOwA" alt="homepage" width="400px" />

:white_check_mark: Users can add posts for each pet - it can be a memory post with a photo corresponding to the memory, or a medical post to document symptoms, vet diagnosis, medications, and vaccinations

<img src="https://drive.google.com/uc?export=view&id=1vIca4Q-ds8yC1khECwNbc9AJYBmupGbg" alt="homepage" width="400px" />

:white_check_mark: Posts are organized on the Pawfile chronologically by the date the user inputted, but users can search for a specific post and filter categorically

:white_check_mark: Users can create reminders for each pet, with an optional time or date

:white_check_mark: Users can edit and delete posts, reminders, pictures, or any information in their pet's pawfile 

:white_check_mark: Users can update their password, first name, last name, or username after they're logged in

## Specifics: 
Full-stack app with React for the frontend, Redux for state management, Node/Express for the backend, MongoDB for the database, JWTs for authentication, Mocha/Chai for server-side testing, Enzyme for React component testing.

[Server Repo](https://github.com/thinkful-ei26/nikkie-pawfiles-server)

##### Codebase:
- public
- src
  - actions
  - components
    - home
    - onboarding
    - pawfilepage
    - settings
  - reducers

## Future Updates
:point_right: Users can upload photos and files directly from their device rather than needing to provide a URL to an image

:point_right: Users will provide emails at login and can consequently reset passwords if they're unable to login 

:point_right: Users will have a more convenient way of accessing their pet's full vaccination, prescription, and doctor history depending on the posts they've created

:point_right: Users can filter their posts by date 
