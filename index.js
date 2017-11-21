'use strict'

var jschardet = require('jschardet')
var iconv = require('iconv-lite')
var charset = require('charset')

var charsetRegex = /charset=["]*([^>"\s]+)/i

module.exports = function ensureUTF8 (binaryBuffer, contentType) {
  var encoding = getEncoding(binaryBuffer, contentType)
  
  return encoding === 'utf8'
    ? binaryBuffer.toString('utf8')
    : iconv.decode(binaryBuffer, encoding).replace(charsetRegex, 'utf-8')
}

function getEncoding (content, contentType) {
  return charset({'content-type': contentType}, content) || inferredEncoding(content) || 'utf8'
}

function inferredEncoding(content) {
  var charset = jschardet.detect(content);
  return charset && charset.encoding && charset.encoding
}