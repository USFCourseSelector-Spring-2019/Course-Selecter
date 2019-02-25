# Local development

First, `cd` into the repository:

```sh
cd course-selecter
```

# Dependencies

First, install couchdb, nodejs and yarn (MacOS only):

```sh
brew install node yarn couchdb
```

# Asana Workflow

![Course Selector Workflow](Course%20Selector%20Workflow.png)

## Things To Do (Figure 1.1)

This is a column in Asana, this will be the queue of all the tasks which are to be completed. The tasks that are ready for you to complete will be assigned to you inside of this column.

## In Progress (Figure 1.2)

This column will be where you will show that you have begun to work on a task by dragging it from Figure 1.1 to Figure 1.2. Before begining your work you should create a branch as described below in the "Code Sharing Practices" section. Once you have completed your work within your branch you should open up a Pull Request into the master branch and once this is done you will move the task into Figure 1.3

## Ready to Check (Figure 1.3)

This column are all of the tasks which are currently in the review stage to be handled by Nick. Once you've made your PR with all the changes you've made I'll be notified that you made a Pull Request so just sit tight for the review of your code. If you feel so inclined you can go continue to work on your next task or you can just chill out.

## Done (Figure 1.4)

This column will signify all the work that is completed, Nick will move the task in here once the task's Pull Request is approved.


# Code Sharing Practices

In order to not conflict and constantly deal with merge conflicts as we develop together we will use [Pull Requests in GitHub](https://help.github.com/articles/about-pull-requests/).
This flow of development is called [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) will look similar to this example:

First, you go into the master branch and pull the latest changes by executing:

```sh
git checkout master
git pull
```

Second, you create a branch of your own using the naming scheme author_name/feature_name by executing:

```sh
# replace first_name with your name and feature with the name of the feature that you are working on
git branch first_name/feature
git checkout first_name/feature
```

Third you add your changes and make a commit by executing:
```sh
# adds all changes in the current directory
git add .
# commits the changes with the message: message_here which should describe the changes made in that commit
git commit -m  "message_here"
# send the changes to GitHub
git push
```

Lastly, you'll go into GitHub and create a Pull Request from your branch into the master branch: Writing a short documentation of all the changes that you made that will be reviewed.
From this point your changes will be reviewed by the project manager: @nperez0111 you can then begin to work on another feature (starting this process again) while the changes are being reviewed.


# Usage
This section offers how to run certain sections of the project

## Prerequisite To Scraping Courses

Must copy usf/sample.creds.js to usf/creds.js by executing:

```sh
cp usf/sample.creds.js usf/creds.js
```

Edit usf/creds.js to use your USF credentials (making sure to never check this file into GitHub).

Now we need to install couchdb onto our systems using:

```sh
brew install couchdb
```
This is where all of the files will be stored into when scraping so we need to have it running when attempting to scrape but we won't run it just yet. 

Now we need to install the dependencies in the USF project (remember this folder stores all of the USF specific scraping code)

```sh
cd usf/
yarn
```

If you don't have yarn already you can install it using:
```sh
brew install yarn
```

If you had to install yarn remember to rerun the `yarn` command. This is a package manager like NPM but faster at installing packages and dependencies.

Now we could run these scrapers directly in this folder and they will run and print the output but that is not very useful so let's switch to the server folder to be able to put the scraped data into the couchdb.

```sh
cd ../server
# Install it's dependencies
yarn 
```

So before we can actually input into the database we have to actually set some things up in the database first. Let's start with running the database in the first place:

```sh
couchdb
# You should now see that Apache CouchDB has started on http://127.0.0.1:5984/ by default
```

Now this is a long running command so we will leave this terminal window open and open a new one. But let's just leave that open for now and head over to your browser at: [http://127.0.0.1:5984/_utils/](http://127.0.0.1:5984/_utils/) This is the database configuration page from here you can manage your CouchDB instance. For now all we really need is to create two empty databases that we can fill up later.

Click the "Create Database" link in the top right. Now just type the name of the database in this case just `usf` in all lower case. And that's all the database is now initiliazed! Do the same for a `users` database by clicking "Overview" in the top left to get to the page prior.

## Running the Course scraper (inside the server folder)

Now let's fill the database with fresh course data:

```sh 
yarn run courses
```

This takes a long time: like 30 seconds to a minute depending on your internet. But it will go ahead using your USF credentials log in as you, pull all of the courses from USF's banner and parse that into a JSON file that can be stored into the database.

## Running the Proffessor scraper (inside the server folder)

Now to get proffessor data we just have to run:

```sh
yarn run proffessors
```

The professor scraper will output a lot of data telling you it's proccess and it will take even longer but luckily since professors don't change their data often it probably won't ever need to be run on your machine again.

Whew! That was a lot of prerequisites now that you have all of this data inside your database you can kill your couchdb instance (we run the scrapers only so often and for local development of the web app you'll almost never need to do these steps again as all the info we need is inside the Database).

Let's go into the frontend folder

```sh
cd ../client
```

## Building the Course Selector frontend

Let's install it's dependencies with

```sh
yarn # or npm install
```

Now that we have the database setup we can actually run it all locally using

```sh
yarn run dev
# serves with hot reload at localhost:3000 used for all development
```

Now if you go to [http://localhost:3000/](http://localhost:3000) you'll have the server running!

This will pretty much always be running when you write your code and the cool part about it is anytime you save a file it will automatically reload the page so you don't constantly have to refresh the page to see the changes.

# To be continued

This is a living document that currently is incomplete.
Please document anything that may be inaccurate and add any additional processes that should be documented for development.
