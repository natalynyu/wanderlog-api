Wanderlog
======

Technologies Used
------
React, JavaScript,  Express, MongoDB, Mongoose, HTML, CSS, Bootstrap

![AppScreenshot](https://i.imgur.com/AQy4AT1.png)

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
 * Downloaded Express template - https://git.generalassemb.ly/ga-wdi-boston/express-api-template
 * Created a git repository
 * Installed npm packages and nodemon
 * Added secret keys for development and testing
 * Ran npm server
 * Made initial commit on Github
