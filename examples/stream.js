'use strict'

var got = require('got')
var toUTF8 = require('..')

const url = process.argv[2]

let str = ''
let contentType

got
  .stream(url)
  .on('response', res => (contentType = res.headers['content-type']))
  .on('data', buffer => (str += toUTF8(buffer, contentType)))
  .on('end', function () {
    console.log(str)
  })
