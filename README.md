
# Pawfiles

## Summary of App:
Wouldn't it be nice to keep a timeline of your pet's life?
From their medical records to remembering something hilarious they did
the other day, it can be easy to forget important things about your
furry best friend. Well now you can keep track of it all with
Pawfiles! Pawfiles helps you keep a simple timeline on your pet:
whether it's what the vet said at their last appointment, a record of
their vaccination schedule, or a cute memory you just don't want to
forget, this is the place to document it all :)

## User Stories/MVP: 
- [x] 1. User can create an account for themselves with a first name, last name, username, and password
- [x] 2. User will be directed to a home page where they can see all their pets, can add a new pet pawfile by filling out a form (name, species, breed, birthday, gender, profile photo, brief bio.), can sort their pets by age or name, and search their pets
- [x] 3. Single user can have as many "pawfiles" as they wish if they own more than one pet
- [x] 4. User can add posts for each pet - it can be a memory post with a title, description, date, and a photo URL corresponding to the memory, OR a medical related post where they can include a title, description, symptoms, labs, vet, location, date, and a link to a file. Once posted, only the info filled out will show (empty fields will not be displayed).
- [x] 5. Posts will be organized on the Pawfile chronologically by the date the user inputted
- [x] 6. User can search for specific posts on the Pawfile, and filter it by category
- [x] 7. There will be a sidebar on the Pawfile with a brief bio about the pet as well as a list of reminders for that pet: for
example, need to buy more litter, or go get groomed next week, etc.
- [x] 8. The URL of the image the user links will show an actual image once posted, and the user can click on that image to see an enlarged version of it (images should be standard size) 
- [x] 9. Navbar with Home/My Pets, About, Settings, Logout.
- [x] 10. User can edit and delete their posts and info about their pets (and pictures). 

## Extension Features: 
- [x] 1. User can change their password, first name, last name, username under a Settings tab when they're logged in
- [ ] 2. Users can see other user's Pawfiles (read-only) via a link
- [x] 3. Users can edit/delete their posts, reminders, update their pet's profile photo, etc.
- [x] 4. Users will only be logged out after a certain amount of time, not every time they refresh or leave the browser
- [x] 5. When requests are sent via a GET method, they will be queried to the end of the url so the user can click back or search their history (use React Routers) 
- [ ] 6. Users can search for vets in their area (Yelp api?) 
- [ ] 7. User can directly upload a photo or file from their computer (for posts or profile photo) and not via an external link (that way they can upload files/records etc.) Can do this by either using GridFs, or saving that file to another db (like AWS), and storing a ref to it in my db. 
- [ ] 8. Reminders can push notifications to the user (to their notification center) - like for daily pills (https://medium.com/@jasminejacquelin/integrating-push-notifications-in-your-node-react-web-app-4e8d8190a52c)
- [ ] 9. Use some of these pet puns throughout the app: https://www.lifelearn.com/2016/02/24/the-jumbo-reference-list-of-pet-puns/
- [ ] 10. Parts of the design (and puns) will change based on whether it's a cat vs dog, male vs female. Design will hopefully look like an actual timeline
- [ ] 11. "See more" at bottom of timeline to load more posts so db doesn't load all of them at once
- [ ] 12. Make it an app for flex week!
- [ ] 13. When a user adds a vaccination, prescription, or doctor to their medical post, it will be added to a history tab for that category so they can easily view a list of vaccinations, prescriptions, and doctors for a given pet
- [ ] 14. Ability to reset password (this would involve storing user's emails, a security issue. Or they would have to report a problem, and then I'd need some way of verifying their identity). https://nodemailer.com/about/, https://www.mailgun.com/blog/how-to-send-transactional-email-in-a-nodejs-app-using-the-mailgun-api, https://www.w3schools.com/nodejs/nodejs_email.asp
- [ ] 15. Use an API for maps so when user types in address for vet, it loads and comes up and they can click it. It'll link to Google Maps 
