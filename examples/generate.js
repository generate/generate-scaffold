var path = require('path');
var generate = require('generate');
var Scaffold = require('scaffold');

var scaffold = new Scaffold();
var app = generate();
app.use(require('../')());

/**
 * Add a basic "target" to our scaffold. Scaffolds are like
 * grunt "tasks" and can have any number of targets
 */

scaffold.addTarget('abc', {
  options: {
    pipeline: app.renderFile,
    site: {
      title: 'My Blog',
      description: 'This is my blog'
    }
  },
  src: path.join(__dirname, 'templates/*.hbs'),
  dest: 'actual/site',
});

/**
 * Template engine for rendering handlebars templates
 */

app.engine('hbs', require('engine-handlebars'));

/**
 * Generate the scaffold!
 */

app.scaffold('site', scaffold)
  .generate()
  .on('error', console.error)
  .on('data', console.log)
  .on('end', function() {
    console.log('done!');
  });
