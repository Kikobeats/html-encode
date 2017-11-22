'use strict'

const jschardet = require('jschardet')
const isBuffer = require('is-buffer')
const iconv = require('iconv-lite')
const charset = require('charset')

const REGEX_CHARSET = /charset=["]*([^>"\s]+)/i

const inferredEncoding = content => {
  const charset = jschardet.detect(content)
  return charset && charset.encoding
}

module.exports = targetEncoding => {
  if (!targetEncoding) throw new TypeError('Need to provide a target encoding.')

  const getEncoding = (content, contentType) =>
    charset({ 'content-type': contentType }, content) ||
    inferredEncoding(content) ||
    targetEncoding

  return (buffer, contentType) => {
    if (!isBuffer(buffer)) throw new TypeError('content should be a buffer.')
    const encoding = getEncoding(buffer, contentType)
    return iconv.decode(buffer, encoding).replace(REGEX_CHARSET, targetEncoding)
  }
}
