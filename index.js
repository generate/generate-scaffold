/*!
 * generate-scaffold (https://github.com/generate/generate-scaffold)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('generate:scaffold');
var utils = require('./utils');

module.exports = function fn(app) {
  if (!utils.isValid(this, 'generate-scaffold')) return;
  var self = this;

  /**
   * Register the `base-scaffold` plugin
   */

  this.use(utils.scaffold(this.options));

  /**
   * Register the `base-files-each` plugin
   */

  this.use(utils.each());

  /**
   * Decorate methods for generating files onto scaffolds
   */


  if (this.options.decorateScaffolds !== false) {
    this.on('scaffold', function(scaffold) {
      decorate(self, scaffold);
    });
  }

  /**
   * Decorate scaffolds with methods for generating files
   */

  if (this.options.scaffoldTasks !== false) {
    this.on('target', function(target) {
      var scaffold = target.parent || self;
      var tasks = [];

      if (this.Scaffold.isScaffold(scaffold) && scaffold.name) {
        var gen = self.getGenerator(scaffold.name);
        if (typeof gen !== 'undefined') {
          gen.task(target.name, function(cb) {
            self.each(target, cb);
          });
        } else {
          self.generator(scaffold.name, function() {
            this.task(target.name, function(cb) {
              self.each(target, cb);
            });
          });
          gen = self.generators[scaffold.name];
        }

        if (gen) {
          tasks = Object.keys(gen.tasks).filter(function(task) {
            return task !== 'default';
          });
          gen.task('default', tasks);
        }
      } else if (target.name) {
        self.task(target.name, function(cb) {
          self.each(target, cb);
        });

        tasks = Object.keys(self.tasks).filter(function(task) {
          return task !== 'default';
        });

        self.task('default', tasks);
      }
    });
  }

  /**
   * Decorate generating methods
   */

  this.define({

    /**
     * Asynchronously generate files from a declarative [scaffold][] configuration.
     *
     * ```js
     * var Scaffold = require('scaffold');
     * var scaffold = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.scaffoldSeries(scaffold, function(err) {
     *   if (err) console.log(err);
     * });
     * ```
     * @name .scaffoldSeries
     * @param {Object} `scaffold` Scaffold configuration object.
     * @param {Function} `cb` Optional callback function. If not passed, `.scaffoldStream` will be called and a stream will be returned.
     * @api public
     */

    scaffoldSeries: function(config, options, cb) {
      debug('scaffoldSeries', config);

      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      if (typeof cb !== 'function') {
        return this.scaffoldStream(config, options);
      }

      var scaffold = this.getScaffold(config, options);
      this.run(scaffold);
      this.emit('generate.scaffold', scaffold, options);
      var targets = scaffold.targets;
      var keys = Object.keys(targets);

      utils.eachSeries(keys, function(key, next) {
        var target = targets[key];
        scaffold.run(target);
        if (!target.files) {
          next();
          return;
        }
        this.emit('generate.target', target, options);
        this.each(target, options, next);
      }.bind(this), cb);
    },

    /**
     * Generate files from a declarative [scaffold][] configuration.
     *
     * ```js
     * var Scaffold = require('scaffold');
     * var scaffold = new Scaffold({
     *   options: {cwd: 'source'},
     *   posts: {
     *     src: ['content/*.md']
     *   },
     *   pages: {
     *     src: ['templates/*.hbs']
     *   }
     * });
     *
     * app.scaffoldStream(scaffold)
     *   .on('error', console.error)
     *   .on('end', function() {
     *     console.log('done!');
     *   });
     * ```
     * @name .scaffoldStream
     * @param {Object} `config` [scaffold][] configuration object.
     * @return {Stream} returns a stream with all processed files.
     * @api public
     */

    scaffoldStream: function(config, options, cb) {
      debug('scaffoldStream', config);
      var scaffold = this.getScaffold(config, options);
      var streams = [];

      this.run(scaffold);
      this.emit('generate.scaffold', scaffold, options);
      var targets = scaffold.targets;

      for (var name in targets) {
        if (targets.hasOwnProperty(name)) {
          var target = targets[name];
          scaffold.run(target);

          if (target.files) {
            this.emit('generate.target', target, options);
            streams.push(this.eachStream(target, options));
          }
        }
      }

      var stream = utils.ms.apply(utils.ms, streams);
      stream.on('finish', stream.emit.bind(stream, 'end'));
      return stream;
    }
  });

  return fn;
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
