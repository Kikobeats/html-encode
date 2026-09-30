'use strict'

const getContentType = require('@kikobeats/content-type')
const got = require('got')

const toUTF8 = require('..')('utf-8')

const url = process.argv[2]

let str = ''
let contentType

got
  .stream(url)
  .on('response', res => (contentType = getContentType(res.headers['content-type'])))
  .on('data', buffer => (str += toUTF8(buffer, contentType)))
  .on('end', function () {
    console.log(str)
  })
