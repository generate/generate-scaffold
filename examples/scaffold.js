'use strict';

var forOwn = require('for-own');
var scaffold = require('./');

module.exports = function(app) {
  app.use(scaffold());

  // console.log(this)
  this.scaffold('one', {
    options: {},
    files: [{
      src: ['*.*'],
      dest: 'one'
    }]
  });

  // console.log(this)
  this.scaffold('aaa', {
    bbb: {
      options: {},
      files: {
        src: ['*.*'],
        dest: 'aaa/bbb'
      }
    }
  });

  // app.register('abc', function() {
  //   this.scaffold('local', {
  //     docs: {
  //       options: {},
  //       files: {
  //         options: {dot: true},
  //         src: ['*.*'],
  //         dest: 'docs'
  //       }
  //     },
  //     site: {
  //       options: {},
  //       files: {
  //         src: ['*.*'],
  //         dest: 'site'
  //       }
  //     }
  //   });
  // });
};
