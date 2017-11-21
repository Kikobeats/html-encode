'use strict';

var fs = require('fs');
var expect = require('chai').expect;

var convert = require('../index');

describe('Encoding Converter', function() {
  it('properly decodes Shift-JIS html documents', function() {
    var input = loadExample('51242_54045.html');
    var output = convert(input, 'text/html');
    expect(output).to.contain('或る日の小せん');
  });

  it('guesses encoding even without meta tags or content type', function() {
    var input = loadExample('shiftjis.no.meta.html');
    var output = convert(input, 'text/html');
    expect(output).to.contain('次常用國字標準字體表');
  });

  it('works for documents which already are UTF-8', function() {
    var input = loadExample('utf8.with.meta.html');
    var output = convert(input, 'text/html');
    expect(output).to.contain('日本語');
  });
  
  it('Replace charset from the original input', function() {
    var input = loadExample('51242_54045.html');
    var output = convert(input, 'text/html');
    expect(output).to.contain('<meta http-equiv="Content-Type" content="text/html;utf-8" />');
  });
});

function loadExample(name) {
  return fs.readFileSync(__dirname + '/resources/' + name);
}
