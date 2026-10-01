'use strict'

const jschardet = require('jschardet')
const isBuffer = require('is-buffer')
const iconv = require('iconv-lite')
const charset = require('charset')

// jschardet 4 names UTF-8 with a BOM `UTF-8-SIG`. That is UTF-8; iconv-lite has no such codec.
const ICONV_ALIASES = {
  'utf-8-sig': 'utf-8'
}

const inferredEncoding = content => {
  const detected = jschardet.detect(content)
  return detected && detected.encoding
}

const toIconvName = encoding => {
  if (!encoding) return encoding
  return ICONV_ALIASES[encoding.toLowerCase()] || encoding
}

module.exports = targetEncoding => {
  if (!iconv.encodingExists(targetEncoding)) {
    throw new TypeError(`Target encoding '${targetEncoding}' not supported.`)
  }

  const getEncoding = (content, contentType) =>
    toIconvName(charset({ 'content-type': contentType }, content)) ||
    toIconvName(inferredEncoding(content)) ||
    targetEncoding

  return (buffer, contentType) => {
    if (!isBuffer(buffer)) throw new TypeError('content should be a buffer.')
    return iconv.decode(buffer, getEncoding(buffer, contentType))
  }
}
