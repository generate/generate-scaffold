'uses strict';

var eachSeries = require('async-each-series');
var through = require('through2');
var Scaffold = require('scaffold');
var forOwn = require('for-own');
var plugin = require('./');
var App = require('base-app');
var app, scaffold;

app = new App();
app.use(plugin);

app.on('scaffold', function(name, scaffold) {
  app.register(name, function(gen) {
    scaffold.on('target', function(name, target) {
      gen.task(name, function(cb) {
        console.log(name);
      });
    });

    var scaffold = app.scaffold(name);
    forOwn(scaffold.targets, function(target, key) {

      gen.task(key, function(cb) {

    //     cb();
    //     // target.generate({src: '', dest: ''}, cb);
      console.log(key)
        cb()
      });
    });

    gen.task(name, function(cb) {
      cb();
    });
    gen.task('default', name);
  });

  // app.task(name, ['project'], function(cb) {
  //   // scaffold({src: fixtures}, cb);
  //   scaffold({src: fixtures})
  //     .generate()
  //     .on('error', cb)
  //     .on('end', cb);
  // });
});

app.scaffold('site', function(opts) {
  return {
    options: { cwd: 'test/fixtures' },
    foo: {
      src: 'b.txt',
      dest: 'test/actual',
      cwd: 'test/fixtures'
    }
  }
});

app.generate('site:foo', function() {
  console.log(arguments)
});
