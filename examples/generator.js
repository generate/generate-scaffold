'uses strict';

var App = require('base-app');
var plugin = require('../');
var app = new App();

// register plugin
app.use(plugin());

// add a scaffold. this will add sub-generators and tasks for the scaffold and targets.
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

// generate the scaffold using the `site` sub-generator and the `foo` task.
app.generate('site:foo', function() {
  console.log('done')
});
