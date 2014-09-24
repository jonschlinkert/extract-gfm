/*!
 * extract-gfm <https://github.com/jonschlinkert/extract-gfm>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var extract = require('./');

describe('extract', function () {
  it('should extract gfm', function () {
    var actual = extract.parseBlocks('abc\n```js\nvar foo = "bar";\n```\nxyz');

    actual.should.be.an.object;
    actual.should.have.property('text', 'abc\n__CODE_BLOCK0__\nxyz');
    actual.should.have.property('blocks');
    actual.blocks[0].should.have.property('lang', 'js');
    actual.blocks[0].should.have.property('code', 'var foo = "bar";');
    actual.blocks[0].should.have.property('block', '```js\nvar foo = "bar";\n```');
    actual.should.have.property('markers');
    actual.markers[0].should.equal('__CODE_BLOCK0__');
  });
});
