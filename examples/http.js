'use strict'

var got = require('got')
var toUTF8 = require('..')

const url = process.argv[2]
;(async () => {
  try {
    const { body: buffer, headers } = await got(url, { encoding: null })
    var str = toUTF8(buffer, headers['content-type'])
    console.log(str)
  } catch (err) {
    throw err
  }
})()
