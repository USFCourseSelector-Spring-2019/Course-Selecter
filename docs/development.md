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

# Code Sharing Practices

In order to not conflict and constantly deal with merge conflicts as we develop together we will use [Pull Requests in GitHub](https://help.github.com/articles/about-pull-requests/).
The flow of development will look similar to this example:

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

## To Scrape Courses

Must copy usf/sample.creds.js to usf/creds.js by executing:

```sh
cp usf/sample.creds.js usf/creds.js
```

Edit usf/creds.js to use your USF credentials (making sure to never check this file into GitHub).


# To be continued

This is a living document that currently is incomplete.
Please document anything that may be inaccurate and add any additional processes that should be documented for development.