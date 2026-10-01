'use strict'

const jschardet = require('jschardet')
const isBuffer = require('is-buffer')
const iconv = require('iconv-lite')
const charset = require('charset')

// jschardet 4 reports chardet labels; some (notably UTF-8-SIG) are not iconv-lite names.
const ICONV_ALIASES = {
  'utf-8-sig': 'utf-8'
}

const inferredEncoding = content => {
  const detected = jschardet.detect(content)
  return detected && detected.encoding
}

const resolveEncoding = (encoding, fallback) => {
  if (!encoding) return fallback
  const mapped = ICONV_ALIASES[encoding.toLowerCase()] || encoding
  return iconv.encodingExists(mapped) ? mapped : fallback
}

module.exports = targetEncoding => {
  if (!iconv.encodingExists(targetEncoding)) {
    throw new TypeError(`Target encoding '${targetEncoding}' not supported.`)
  }

  const getEncoding = (content, contentType) =>
    resolveEncoding(
      charset({ 'content-type': contentType }, content) || inferredEncoding(content),
      targetEncoding
    )

  return (buffer, contentType) => {
    if (!isBuffer(buffer)) throw new TypeError('content should be a buffer.')
    return iconv.decode(buffer, getEncoding(buffer, contentType))
  }
}
