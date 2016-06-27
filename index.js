/*!
 * generate-scaffold (https://github.com/generate/generate-scaffold)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('generate:scaffold');
var utils = require('./utils');

module.exports = function(app) {
  if (!utils.isValid(app, 'generate-scaffold')) return;

  this.use(require('base-scaffold')());
  this.set('Scaffold', this.options.Scaffold || utils.Scaffold);
  this.scaffolds = this.scaffolds || {};

  /**
   * Returns true
   */

  this.define('isScaffold', utils.isScaffold);

  /**
   * Generate a scaffold from the given `config`.
   *
   * @name .scaffold
   * @param {String} `name`
   * @param {Object} `config`
   * @return {Object} Returns the `Assemble` instance for chaining
   * @api public
   */

  this.define('scaffold', function(name, config, cb) {
    debug('scaffold <%s>, %j', name, config);

    if (this.isScaffold(name)) {
      var args = [].slice.call(arguments, 1);
      decorate(this, name);
      return name.generate.apply(name, args);
    }

    if (typeof name === 'string' && typeof config !== 'function' && !cb) {
      if (!this.scaffolds.hasOwnProperty(name)) {
        this.addScaffold(name, config);
        return this;
      }
      return this.getScaffold(name, config);
    }

    // config is a function
    if (typeof config === 'function' && typeof cb === 'undefined') {
      // register a scaffold function to be lazily invoked
      if (!this.scaffolds.hasOwnProperty(name)) {
        this.addScaffold(name, config);
        return this;
      }

      // config is a callback, `name` is an existing scaffold
      cb = config;
      config = this.getScaffold(name);
      config.generate(cb);
      return;
    }

    if (utils.isObject(config) && typeof cb === 'function') {
      config = this.getScaffold(name, config);
      config.generate(cb);
      return;
    }
    this.addScaffold(name, config);
    return this;
  });

  this.define('addScaffold', function(name, scaffold) {
    debug('addScaffold', name);
    this.scaffolds[name] = scaffold;
    this.emit('scaffold', name, scaffold);
    return this;
  });

  this.define('getScaffold', function(config, options) {
    var self = this;

    if (typeof config === 'string') {
      var name = config;
      config = this.scaffolds[name];
    }

    if (typeof config === 'function') {
      config = config(utils.extend({}, this.options, options));
    }

    if (!utils.isObject(config)) {
      throw new TypeError('expected config to be an object');
    }

    if (!this.isScaffold(config)) {
      var Scaffold = this.get('Scaffold');
      var scaffold = new Scaffold();

      scaffold.on('target', function(target) {
        self.emit('target', target.name, target);
      });

      config = scaffold.addTargets(config);
    } else {
      utils.forOwn(config.targets, function(target, key) {
        self.emit('target', key, target);
      });
    }

    decorate(this, config);
    return config;
  });
};

/**
 * Decorate the given scaffold with "generate" methods
 */

function decorate(app, scaffold) {
  if (typeof scaffold.generate === 'function') return;

  scaffold.define('generate', function(options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    if (typeof cb === 'function') {
      return this.generateSeries.apply(this, arguments);
    }
    return this.generateStream.apply(this, arguments);
  });

  scaffold.define('generateSeries', function(options, cb) {
    var args = [].slice.call(arguments);
    args.unshift(this);
    return app.scaffoldSeries.apply(app, args);
  });

  scaffold.define('generateStream', function() {
    var args = [].slice.call(arguments);
    args.unshift(this);
    return app.scaffoldStream.apply(app, args);
  });
}
