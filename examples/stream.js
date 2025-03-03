'use strict'

const got = require('got')
const toUTF8 = require('..')('utf-8')

const url = process.argv[2]

let str = ''
let contentType

got
  .stream(url)
  .on('response', res => (contentType = res.headers['content-type']?.split(';')[0].toLowerCase()))
  .on('data', buffer => (str += toUTF8(buffer, contentType)))
  .on('end', function () {
    console.log(str)
  })
