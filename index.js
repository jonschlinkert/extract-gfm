/*!
 * extract-gfm <https://github.com/jonschlinkert/extract-gfm>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var re = require('gfm-code-block-regex')();
var codeBlocks = require('gfm-code-blocks');
var idRegex = /(__CODE_BLOCK\d+__)/g;


/**
 * Strip code blocks from a string and replaced them with
 * heuristic markers.
 *
 * @param  {String} `str` Original string with gfm code blocks.
 * @return {String}
 * @api public
 */

exports.stripBlocks = function(str) {
  var arr = str.match(re) || [];
  return arr.reduce(function (acc, match, i) {
    return acc.replace(match, exports.id(i));
  }, str);
};


/**
 * Return an array of all **gfm code blocks** found.
 * See [gfm-code-blocks] for more detail.
 *
 * @param  {String} `str` The string to parse.
 * @return {Array}
 * @api public
 */

exports.extractBlocks = function(str) {
  return codeBlocks(str);
};


/**
 * Convenience method to make it easy to replace code blocks.
 *
 * Returns an object with:
 *
 *    - `text`: the string stripped of code blocks, where each block
 *      is replaced with a heuristic marker.
 *    - `blocks`: An array of code blocks, using the [.extractBlocks()](#extractBlocks) method.
 *    - `markers`: An array of heuristic markers to be used for adding code blocks back.
 *
 * **Example**
 *
 * ```js
 * var code = require('extract-gfm');
 * var fs = require('fs');
 * var str = fs.readFileSync('README.md', 'utf8');
 * console.log(code.parseBlocks(str));
 * ```
 *
 * @param  {String} `str` The string to parse.
 * @return {Object}
 * @api public
 */

exports.parseBlocks = function(str) {
  var o = {};
  o.text = exports.stripBlocks(str);
  o.blocks = codeBlocks(str);
  o.markers = o.text.match(idRegex) || [];
  return o;
};


/**
 * Used for adding code blocks back into the string after they
 * have been modified somehow.
 *
 * To customize how this is done, just look at the `injectBlocks`
 * method and create your own based on this. [.parseBlocks()](#parseBlocks)
 * really does all of the hard work.
 *
 * @param  {String} `str` A string with heuristic markers to replace.
 * @param  {String} `object` Object created by [.parseBlocks()](#parseBlocks)
 * @return {String} Updated string, with shiny new code blocks.
 * @api public
 */

exports.injectBlocks = function(str, o) {
  var arr = str.match(idRegex) || [];
  return arr.reduce(function(acc, match, i) {
    return acc.replace(match, exports.createBlock(o[i]));
  }, str);
};


/**
 * Generate an id based on the index of each code block.
 * This is used as a heuristic for re-adding extracted
 * code blocks.
 *
 * @param  {Number} `i` Match index of the code block being replaced.
 * @return {String} Heuristic string.
 * @api private
 */

exports.createBlock = function(o) {
  return '```' + o.lang + '\n' + o.code + '\n```\n';
};


/**
 * Generate an id based on the index of each code block.
 * This is used as a heuristic for re-adding extracted
 * code blocks.
 *
 * @param  {Number} `i` Match index of the code block being replaced.
 * @return {String} Heuristic string.
 * @api private
 */

exports.id = function(i) {
  return '__CODE_BLOCK' + i + '__';
};
