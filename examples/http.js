'use strict'

const got = require('got')
const toUTF8 = require('..')('utf-8')

const url = process.argv[2]

const encode = async () => {
  const { body: buffer, headers } = await got(url, { responseType: 'buffer' })
  const str = toUTF8(buffer, headers['content-type'])
  return str
}

encode(url)
  .then(content => console.log(content) && process.exit(0))
  .catch(err => console.error(err) && process.exit(1))
