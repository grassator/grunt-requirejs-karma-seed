# Grunt + Require.js + Karma Seed Repo

This is an effort to provide good starting point for developing any kind of
frontend component, whether it is a full-size app or a small library.

## Getting Started

> Make sure you  have [node](http://nodejs.com) installed.
After that, if you don't have bower, `npm install -g bower`.

Before you can start development be sure to run:

    npm install
    grunt bower

The above steps will download all the required dependencies to
build and run this app, such as [grunt](http://gruntjs.com) and
[requirejs](http://requirejs.org).

## Changing Directory Structure

To allow for better flexibility some of the directory structure like the name
of vendor, src and dist folders can be changed inside `paths.json` file. This
might be useful for example if you decide to use this template as a starting
point for an application or library that must conform to certain guidelines.

## Building the application

This application uses requirejs to load the various modules in
the app folder. However, upon build, all of these files are
concatenated and minified together to create a small, compressed
javascript file.

Running `grunt` by itself will run through all of the steps of
linting the javascript, building out dependencies and ultimately
creating `/dist/main.min.js` && `/dist/main.js`.

## Tests

Create tests as `test/*Spec.js` files, where you can
require your modules and test their functionality.

Tests are run using [karma](http://karma-runner.github.io/).
To run them once in [PhantomJS](http://phantomjs.org/):

    grunt test
