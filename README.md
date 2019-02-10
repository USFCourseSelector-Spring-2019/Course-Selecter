# USF Course Selecter

> You handle college, we’ll handle registration

Course Selector is a web application whose goal is to make course selecting a simpler, faster and more pleasing experience for students of the University of San Francisco (USF). It achieves this by offering an experience that is superior in every way to the USF course selection website.

[See it in action at https://usf.nickthesick.com](https://usf.nickthesick.com/courses)

------

Picking classes have to be one of the worst experiences in college. Constantly trying to make sure that you are progressing with your degree yet also juggling making sure that you have interesting (even fun if you are ambitious) classes while also creating a schedule that you won’t dread for the whole semester. On top of all those things you have to keep in mind, you have to deal with the college’s terrible system for picking courses and have at least a million tabs open to the point that you forget which tab shows which little bit of info you need to make a reasonable schedule for a semester. It sure is a lot of pressure on students and the tools *should* make the process easier not harder, so I made a course selector for USF students like you so that you can pick your courses with ease and still be on your way to your goal of graduating.

## How everything works

We extract courses every so often (can be set to any interval) and store those courses into a [CouchDB Database](http://couchdb.apache.org/). These courses are then pulled in entirety to the frontend API (the backend for the frontend) which are served to the frontend to show all of the course options.

Within the frontend users are able to create "plans"(possible schedules that the user can use to plan their next schedule). These plans are viewable in two formats: a list of courses and a calendar view. All plans are stored to the user's browser (using [localStorage browser API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).

There are multiple folders within this folder
- [client/](client/README.md)
    - the frontend of course selector with it's own frontend API
- [usf/](usf/README.md)
    - all the USF specific attachments for Course Selector
    - has all of the browser scrapers to pull data from USF's website
- [server/](usf/README.md)
    - puts all of the data we pull from the USF scrapers into the DB (CouchDB)

## New Features to be made

 - We are in the process of creating a dashboard to which users can see their current progress into their degree. This dashboard will have access to all of the courses which the user is required to take and therefore can be recommending courses which the user can take.
    - How we are able to peer into the user's required classes and progress into their degree is through one of two methods: their degree audit, or their USF credentials to then automatically grab the degree audit. If the user is uncomfortable with giving their USF credentials then they may just supply a file upload of their current degree audit from which we will extract all of the information.
    - If given the USF credentials though we would be able to do more advanced things such as enrolling in courses for the user
 - We are going to need to update our landing page to be more inviting to users and explain what everything is all about.
     - This will require some design skills and teach CSS layout very well
 - Enrollment of courses for the user
     - We will need to instruct a browser scraper to login as the user and perform the addition of the course for the user
         - Also providing feedback along the way so the user knows what is happening and if maybe an error happened so that they can go login for themselves if need be.
 - Watching for open seats
     - This can be attached to our current course scraper to have some sort of queue of courses that all users want to be notified about and notify each user individually that such course is available if it is.


## Development

A guide to getting started with development [can be found at docs/development.md](docs/development.md)

