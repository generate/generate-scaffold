# generate-scaffold [![NPM version](https://img.shields.io/npm/v/generate-scaffold.svg?style=flat)](https://www.npmjs.com/package/generate-scaffold) [![NPM downloads](https://img.shields.io/npm/dm/generate-scaffold.svg?style=flat)](https://npmjs.org/package/generate-scaffold) [![Build Status](https://img.shields.io/travis/generate/generate-scaffold.svg?style=flat)](https://travis-ci.org/generate/generate-scaffold)

Generate a scaffold from a declarative configuration.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save generate-scaffold
```

## Usage

```js
var scaffolds = require('generate-scaffold');
```

## Example

```js
var scaffolds = require('generate-scaffold');
var generate = require('generate');
var Scaffold = require('scaffold');
var scaffold = new Scaffold();
var app = generate();
app.use(scaffolds);

/**
 * Add a basic "target" to our scaffold. Scaffolds are like
 * grunt "tasks" and can have any number of targets
 */

scaffold.addTarget('abc', {
  options: {
    pipeline: generate.renderFile,
    data: {
      site: { title: 'My Blog' }
    }
  },
  src: 'templates/*.hbs',
  dest: 'site',
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
  .on('error', console.log)
  .on('data', console.log)
  .on('end', function() {
    console.log('done!');
  });
```

See the [scaffold](https://github.com/jonschlinkert/scaffold) library for additional information.

## API

### [.scaffoldSeries](index.js#L100)

Asynchronously generate files from a declarative [scaffold](https://github.com/jonschlinkert/scaffold) configuration.

**Params**

* `scaffold` **{Object}**: Scaffold configuration object.
* `cb` **{Function}**: Optional callback function. If not passed, `.scaffoldStream` will be called and a stream will be returned.

**Example**

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.scaffoldSeries(scaffold, function(err) {
  if (err) console.log(err);
});
```

### [.scaffoldStream](index.js#L157)

Generate files from a declarative [scaffold](https://github.com/jonschlinkert/scaffold) configuration.

**Params**

* `config` **{Object}**: [scaffold](https://github.com/jonschlinkert/scaffold) configuration object.
* `returns` **{Stream}**: returns a stream with all processed files.

**Example**

```js
var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  options: {cwd: 'source'},
  posts: {
    src: ['content/*.md']
  },
  pages: {
    src: ['templates/*.hbs']
  }
});

app.scaffoldStream(scaffold)
  .on('error', console.error)
  .on('end', function() {
    console.log('done!');
  });
```

## History

### v0.3.0 (2016-07-11)

**Breaking changes**

* Changes signature of the main export to follow [Generate](https://github.com/generate/generate) generator conventions. Instead of doing `app.use(scaffold())`, you should now do `app.use(scaffold)`.

### v0.2.1 (2016-07-11)

**Fixed**

* Ensure that tasks and generators are created correctly by listener

### v0.2.0 (2016-06-27)

**Added**

* Adds support for automatically creating generators and tasks from declarative scaffolds. Collaborative work from @doowb and @jonschlinkert

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/generate/generate-scaffold/blob/master/LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.1.28, on July 29, 2016._