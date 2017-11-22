'use strict'

var jschardet = require('jschardet')
var isBuffer = require('is-buffer')
var iconv = require('iconv-lite')
var charset = require('charset')

var charsetRegex = /charset=["]*([^>"\s]+)/i

module.exports = function ensureUTF8 (buffer, contentType) {
  if (!isBuffer(buffer)) throw new TypeError('content should be a buffer.')

  var encoding = getEncoding(buffer, contentType)

  return encoding === 'utf8'
    ? buffer.toString('utf8')
    : iconv.decode(buffer, encoding).replace(charsetRegex, 'utf-8')
}

function getEncoding (content, contentType) {
  return (
    charset({ 'content-type': contentType }, content) ||
    inferredEncoding(content) ||
    'utf8'
  )
}

function inferredEncoding (content) {
  var charset = jschardet.detect(content)
  return charset && charset.encoding
}
