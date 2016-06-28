'use strict';
var scaffold = require('./');

module.exports = function(app) {
  app.use(scaffold());

  // create a scaffold
  // this will reigster a sub-generator named "one"
  this.scaffold('one', {
    options: {},
    files: {
      src: ['*.*'],
      dest: 'one'
    }
  });

  // register a sub-generator named "abc"
  app.register('abc', function() {

    // create a scaffold name "local"
    // this will register a sub-generator on "abc" named "local"
    // and 2 tasks named "docs" and "site"
    // this will also register a "default" task with the other 2 as dependencies
    this.scaffold('local', {
      docs: {
        options: {},
        files: {
          options: {dot: true},
          src: ['*.*'],
          dest: 'docs'
        }
      },
      site: {
        options: {},
        files: {
          src: ['*.*'],
          dest: 'site'
        }
      }
    });
  });
};
