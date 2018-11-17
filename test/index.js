'use strict'

const { expect } = require('chai')
const path = require('path')
const fs = require('fs')

const toUTF8 = require('..')('utf-8')

describe('encoding conversion', function () {
  it('Shift-JIS', function () {
    const buffer = loadExample('51242_54045.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('或る日の小せん')
  })

  it('Windows-1250', function () {
    const buffer = loadExample('rp.pl.html')
    const output = toUTF8(buffer, 'windows-1250')

    expect(output).to.contain('majątków')
  })

  it('UTF-8', function () {
    const buffer = loadExample('utf8.with.meta.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('日本語')
  })

  it('inferred', function () {
    const buffer = loadExample('shiftjis.no.meta.html')
    const output = toUTF8(buffer, 'text/html')

    expect(output).to.contain('次常用國字標準字體表')
  })
})

function loadExample (name) {
  return fs.readFileSync(path.join(__dirname, '/fixtures/', name))
}
