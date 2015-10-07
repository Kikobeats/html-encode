'use strict';

var jschardet = require('jschardet');
var charset = require('charset');
var iconv = require('iconv-lite');

module.exports = ensureUTF8;

function ensureUTF8(binaryBuffer, contentType) {
  var encoding = detectEncoding(binaryBuffer, contentType);

  if (encoding === 'utf8') return binaryBuffer.toString('utf8');

  return iconv.decode(binaryBuffer, encoding);
}

function detectEncoding(content, contentType) {
  var byMetaAndContentType = charset({'content-type': contentType}, content);
  if (byMetaAndContentType) return byMetaAndContentType;

  var byGuessing = jschardet.detect(content);
  if (byGuessing && byGuessing.encoding) return byGuessing.encoding;

  return 'utf8';
}
