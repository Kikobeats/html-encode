'use strict'

const { expect } = require('chai')
const path = require('path')
const fs = require('fs')

const toUTF8 = require('../index')('utf-8')

describe('Encoding Converter', function () {
  it('properly decodes Shift-JIS html documents', function () {
    const buffer = loadExample('51242_54045.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('或る日の小せん')
  })

  it('properly decodes Windows-1250 html documents', function () {
    const buffer = loadExample('rp.pl.html')
    const output = toUTF8(buffer, 'windows-1250')

    expect(output).to.contain('majątków')
  })

  it('guesses encoding even without meta tags or content type', function () {
    const buffer = loadExample('shiftjis.no.meta.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('次常用國字標準字體表')
  })

  it('works for documents which already are UTF-8', function () {
    const buffer = loadExample('utf8.with.meta.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('日本語')
  })

  it('Replace charset from the original buffer', function () {
    const buffer = loadExample('51242_54045.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain(
      '<meta http-equiv="Content-Type" content="text/html;utf-8" />'
    )
  })
})

function loadExample (name) {
  return fs.readFileSync(path.join(__dirname, '/fixtures/', name))
}
