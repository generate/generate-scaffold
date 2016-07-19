'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var exists = require('fs-exists-sync');
var through = require('through2');
var Scaffold = require('scaffold');
var plugin = require('..');
var App = require('base-app');
var app, scaffold;

var fixtures = path.resolve(__dirname, 'fixtures');
var actual = path.resolve(__dirname, 'actual');

function dest(name) {
  return path.resolve(actual, name);
}

function base(cb) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    cb(file, str, next);
  });
}

describe('scaffolds', function() {
  beforeEach(function() {
    app = new App();
    app.use(plugin);
  });

  afterEach(function(cb) {
    rimraf(actual, cb);
  });

  describe('setup', function() {
    it('should clean out all test fixtures', function(cb) {
      assert(!exists(actual));
      cb();
    });
  });

  describe('targets', function() {
    it('should process files from the process options.cwd', function(cb) {
      scaffold = new Scaffold({
        options: { cwd: fixtures },
        docs: {
          src: 'b.txt',
          dest: actual,
          cwd: fixtures
        }
      });

      app.scaffold('test', scaffold)
        .generate(function(err) {
        if (err) return cb(err);
        assert(exists(dest('b.txt')));
        cb();
      });
    });

    it('should use the cwd passed on the config.options.cwd', function(cb) {
      assert(!exists(dest('b.txt')));

      scaffold = new Scaffold({
        foo: {
          cwd: fixtures,
          src: 'b.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(dest('b.txt')));
          cb();
        });
    });

    it('should work with no options:', function(cb) {
      scaffold = new Scaffold({
        foo: {
          src: 'b.txt',
          dest: actual,
          cwd: fixtures
        }
      });

      app.scaffold('test', scaffold)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(dest('b.txt')));
          cb();
        });
    });

    it('should process a single file', function(cb) {
      assert(!exists(dest('a.txt')));

      scaffold = new Scaffold({
        foo: {
          cwd: fixtures,
          src: 'a.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(dest('a.txt')));
          cb();
        });
    });

    it('should process a glob of files', function(cb) {
      assert(!exists(dest('a.txt')));
      assert(!exists(dest('b.txt')));
      assert(!exists(dest('c.txt')));

      scaffold = new Scaffold({
        foo: {
          cwd: fixtures,
          src: '*.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate()
        .on('error', cb)
        .on('end', function() {
          assert(exists(dest('a.txt')));
          assert(exists(dest('b.txt')));
          assert(exists(dest('c.txt')));
          cb();
        });
    });
  });

  describe('plugin', function() {
    beforeEach(function() {
      app = new App();
      app.use(plugin);
    });

    it('should use a plugin to modify file contents', function(cb) {
      app.plugin('append', function(opts) {
        opts = opts || {};
        return base(function(file, str, next) {
          file.contents = new Buffer(str + opts.suffix);
          next(null, file);
        });
      });

      scaffold = new Scaffold({
        foo: {
          cwd: fixtures,
          src: '*.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate({suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          var end = str.slice(-3);
          assert.equal(end, 'zzz');
        })
        .once('finish', function() {
          assert(exists(dest('example.txt')));
          cb();
        });
    });

    it('should run plugins defined on config.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      scaffold = new Scaffold({
        foo: {
          options: {pipeline: ['a', 'c']},
          cwd: fixtures,
          src: 'a.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate({suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert.equal(str.indexOf('bbb'), -1);
          var end = str.slice(-6);
          assert.equal(end, 'aaaccc');
        })
        .on('finish', function() {
          assert(exists(dest('a.txt')));
          cb();
        });
    });

    it('should run plugins defined on process.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      scaffold = new Scaffold({
        foo: {
          cwd: fixtures,
          src: 'a.txt',
          dest: actual
        }
      });

      app.scaffold('test', scaffold)
        .generate({pipeline: ['a', 'c'], suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert.equal(str.indexOf('bbb'), -1);
          var end = str.slice(-6);
          assert.equal(end, 'aaaccc');
        })
        .on('finish', function() {
          assert(exists(dest('a.txt')));
          cb();
        });
    });
  });
});

