'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-scaffold', 'scaffold');
require('extend-shallow', 'extend');
require('for-own');
require('is-scaffold');
require('is-valid-app', 'isValid');
require('isobject', 'isObject');
require('scaffold', 'Scaffold');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
