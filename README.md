Wanderlog
======
This application allows users to upload curated lists of destinations with topics of their choosing from ‘Best Cliff Diving Spots in the World’ to ‘The Must See Sights of Italy.’  Integrated with Google Maps API, this application allows users to share their lists of destinations in a fun and useful way. 

Technologies Used
------
React, JavaScript,  Express, MongoDB, Mongoose, HTML, CSS, Bootstrap

![AppScreenshot](https://i.imgur.com/LXK19Uu.png)

User Stories
------
* New user can sign up
* Signed up user can sign in, change password, and sign out
* All users can view destination lists
* Signed in users can rate lists
* Signed in users can create new destination lists
* Signed in users can edit and delete lists they created

Links
------
* Front End Repo: https://github.com/natalynyu/wanderlog-client
* Deployed Front End: https://natalynyu.github.io/wanderlog-client
* Deployed Back End: https://fathomless-hamlet-78828.herokuapp.com/

API Paths & Methods
------
### Authentication

| Method   | URL
|--------|------------------------
| POST   | `/sign-up`
| POST   | `/sign-in`
| PATCH  | `/change-password/`
| DELETE | `/sign-out/`

### Surveys

| Method   | URL
|--------|------------------------
| POST   | `/itineraries`
| GET    | `/itineraries`
| GET    | `/itineraries/:id`
| PATCH  | `/itineraries/:id`
| DELETE | `/itineraries/:id`

Planning
------
* Reviewed project requirements
* Brainstormed project ideas with colleagues based on requirements
* Mapped out the application with a wireframe
* Wrote user stories
* Created a relationship entity diagram

Process
------
* Created a running list of daily goals to complete
* Methodically wrote code feature-by-feature
* Tested code after each feature was written

Problem Solving Strategy
------
* Used debugger to target and resolve bugs
* Utilized online resources such as StackOverflow to research issues
* Discussed bugs with General Assembly instructors through the Github project issue queue


Plans for Future Improvements
------
* Include a dropdown for each list so that users can categorize the list (e.g. with options such as travel, food, relationships, education, health, etc.) 
* Categorize lists by topics outlined above
* Update success and failure messages to fade out on a timer
* Allow users to rate each other's lists

Wireframe
------
https://docs.google.com/drawings/d/1aMM_TJhwGMRmR8Iu0IzrF3FGK97EBKLqjf9Y2Wc8pL8/edit?usp=sharing

Entity Relationship Diagram
------
https://docs.google.com/drawings/d/1rFQOkek8Geo34VZA_voBQAi_fltmMO9Iyt66vG4GgwU/edit?usp=sharing

 Set up & Installation Instructions for Back End
 ------
 * Fork and clone repository
 * Checkout to a new branch
 * Install dependencies with terminal command `npm install`
 * Make sure mongodb is running with terminal command `brew services list`. If it's not, use command 'brew services restart mongodb'
 * Run the following two commands to generate the secret keys:  
 `echo SECRET_KEY_BASE_TEST=$(openssl rand -base64 66 | tr -d '\n') >> .env`  
 `echo SECRET_KEY_BASE_DEVELOPMENT=$(openssl rand -base64 66 | tr -d '\n') >> .env`
 * Use the command `npm run server` to run locally
