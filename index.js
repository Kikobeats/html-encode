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
  const encoding = detected && toIconvName(detected.encoding)
  // jschardet 4 can name codecs iconv-lite does not ship (ISO-2022-JP, cp500, …).
  // Skip those so the caller falls back to the target encoding instead of throwing.
  if (encoding && iconv.encodingExists(encoding)) return encoding
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
    inferredEncoding(content) ||
    targetEncoding

  return (buffer, contentType) => {
    if (!isBuffer(buffer)) throw new TypeError('content should be a buffer.')
    return iconv.decode(buffer, getEncoding(buffer, contentType))
  }
}
