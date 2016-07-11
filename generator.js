'use strict';

var scaffold = require('./');

module.exports = function(app) {
  app.use(scaffold());

  // create a scaffold:
  // - registers a sub-generator named "one"
  // - creates a `default` task on `one`
  this.scaffold('one', {
    src: ['*.*'],
    dest: 'one'
  });

  // register a sub-generator named "abc"
  app.register('abc', function() {
    // create a scaffold name "local":
    // - registers a sub-generator on "abc" named "local"
    // - adds 2 tasks named "docs" and "site"
    // - registers a "default" task with the other 2 tasks as dependencies
    this.scaffold('local', {
      docs: {
        files: {
          options: {dot: true},
          src: ['*.*'],
          dest: 'docs'
        }
      },
      site: {
        files: {
          src: ['*.*'],
          dest: 'site'
        }
      }
    });
  });

  app.task('default', function(cb) {
    app.generate(['one', 'abc.local'], cb);
  });
};
