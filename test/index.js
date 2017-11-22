'use strict'

var expect = require('chai').expect
var path = require('path')
var fs = require('fs')

var toUTF8 = require('../index')

describe('Encoding Converter', function () {
  it('properly decodes Shift-JIS html documents', function () {
    var buffer = loadExample('51242_54045.html')
    var output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('或る日の小せん')
  })

  it('properly decodes Windows-1250 html documents', function () {
    var buffer = loadExample('rp.pl.html')
    var output = toUTF8(buffer, 'windows-1250')

    expect(output).to.contain('majątków')
  })

  it('guesses encoding even without meta tags or content type', function () {
    var buffer = loadExample('shiftjis.no.meta.html')
    var output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('次常用國字標準字體表')
  })

  it('works for documents which already are UTF-8', function () {
    var buffer = loadExample('utf8.with.meta.html')
    var output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('日本語')
  })

  it('Replace charset from the original buffer', function () {
    var buffer = loadExample('51242_54045.html')
    var output = toUTF8(buffer, 'text/html')

    expect(output).to.contain(
      '<meta http-equiv="Content-Type" content="text/html;utf-8" />'
    )
  })
})

function loadExample (name) {
  return fs.readFileSync(path.join(__dirname, '/fixtures/', name))
}
