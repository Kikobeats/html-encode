'use strict'

const got = require('got')
const toUTF8 = require('..')('utf-8')

const url = process.argv[2]
;(async () => {
  try {
    const { body: buffer, headers } = await got(url, { encoding: null })
    const str = toUTF8(buffer, headers['content-type'])
    console.log(str)
  } catch (err) {
    throw err
  }
})()
