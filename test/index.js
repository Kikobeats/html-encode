'use strict'

const test = require('ava').default
const path = require('path')
const fs = require('fs')

const fixture = name => fs.readFileSync(path.join(__dirname, '/fixtures/', name))

const toUTF8 = require('..')('utf-8')

test('Shift-JIS', t => {
  const buffer = fixture('51242_54045.html')
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('或る日の小せん'))
})

test('Windows-1250', t => {
  const buffer = fixture('rp.pl.html')
  const output = toUTF8(buffer, 'windows-1250')
  t.true(output.includes('majątków'))
})

test('UTF-8', t => {
  const buffer = fixture('utf8.with.meta.html')
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('日本語'))
})

test('inferred', t => {
  const buffer = fixture('shiftjis.no.meta.html')
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('次常用國字標準字體表'))
})

test('UTF-8 with BOM and no charset hint', t => {
  const buffer = Buffer.concat([
    Buffer.from([0xef, 0xbb, 0xbf]),
    Buffer.from('<html><body>日本語</body></html>')
  ])
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('日本語'))
  t.false(output.startsWith('\uFEFF'))
})

test('throws when the declared charset is unknown to iconv', t => {
  const buffer = Buffer.from('<html>hello</html>')
  const error = t.throws(() => toUTF8(buffer, 'text/html; charset=iso-2022-jp'))
  t.true(error.message.includes('iso-2022-jp'))
})

test('falls back when inferred encoding is unknown to iconv', t => {
  // ISO-2022-JP ESC sequences: jschardet is confident; iconv-lite has no codec.
  const buffer = Buffer.concat([
    Buffer.from('<html><body>'),
    Buffer.from([0x1b, 0x24, 0x42, 0x46, 0x7c, 0x4b, 0x5c, 0x38, 0x6c, 0x1b, 0x28, 0x42]),
    Buffer.from('</body></html>')
  ])
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('<html>'))
  t.true(output.includes('</html>'))
})

test('falls back when jschardet guesses an unsupported encoding', t => {
  const iconv = require('iconv-lite')
  const buffer = iconv.encode(
    '<html><body>' + 'あ'.repeat(200) + '</body></html>',
    'EUC-JP'
  )
  const output = toUTF8(buffer, 'text/html')
  t.true(output.includes('<html>'))
})
