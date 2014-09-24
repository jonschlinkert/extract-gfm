'use strict';

var fs = require('fs');
var readme = fs.readFileSync('README.md', 'utf8');
var reduce = require('reduce-object');
var extract = require('./index.js');

var code = extract.parseBlocks(readme);

code.blocks = reduce(code.blocks, function (acc, value, key) {
  if (value.lang === 'js') {
    value.lang = 'javascript';
  }
  acc[key] = value;
  return acc;
}, {});

var str = extract.injectBlocks(code.text, code.blocks)
console.log(str);
