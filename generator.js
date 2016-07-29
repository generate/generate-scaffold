'use strict';

var isValid = require('is-valid-app');
var scaffold = require('./');

module.exports = function(app) {
  if (!isValid(this, 'generate-scaffold-example')) return;
  this.use(scaffold);

  this.register('aaa', function(aaa) {
    if (!isValid(this, 'example-aaa')) return;

    this.scaffold({
      options: { destBase: 'test/actual' },
      docs: {
        files: {
          options: {dot: true},
          src: ['test/fixtures/*.*'],
          dest: 'docs'
        }
      },
      site: {
        files: {
          src: ['test/fixtures/*.*'],
          dest: 'site'
        }
      }
    });
  });

  this.register('xyz', function(xyz) {
    if (!isValid(this, 'example-xyz')) return;

    var scaffold = this.scaffold('bar', {
      options: { destBase: 'test/actual' },
      docs: {
        files: {
          options: {dot: true},
          src: ['test/fixtures/*.*'],
          dest: 'docs'
        }
      },
      site: {
        files: {
          src: ['test/fixtures/*.*'],
          dest: 'site'
        }
      }
    });
  });

  this.register('one', function(one) {
    if (!isValid(this, 'example-one')) return;

    this.register('abc', function(abc) {
      if (!isValid(this, 'example-abc')) return;

      var scaffold = this.scaffold('foo', {
        options: { destBase: 'test/actual' },
        docs: {
          files: {
            options: {dot: true},
            src: ['test/fixtures/*.*'],
            dest: 'docs'
          }
        },
        site: {
          files: {
            src: ['test/fixtures/*.*'],
            dest: 'site'
          }
        }
      });
    });

    one.task('default', {silent: true}, function(cb) {
      one.generate('abc', cb);
    });
  });

  this.task('default', {silent: true}, function(cb) {
    app.generate('one.abc', cb);
  });
};
