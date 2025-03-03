# html-encode

![Last version](https://img.shields.io/github/tag/Kikobeats/html-encode.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/html-encode.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/html-encode)
[![NPM Status](https://img.shields.io/npm/dm/html-encode.svg?style=flat-square)](https://www.npmjs.org/package/html-encode)

> A Node.js library for converting HTML documents of arbitrary encoding into a target encoding (utf8, utf16, etc).

### Install

```bash
$ npm install html-encode
```

### Usage

```js
'use strict'

const got = require('got')
const toUTF8 = require('html-encode')('utf-8')
const url = process.argv[2]

;(async () => {
  const { body: buffer, headers } = await got(url, { responseType: 'buffer' })
  const str = toUTF8(buffer, headers['content-type'])
  console.log(str)
})()
```

See more at [examples](/examples).

## License

**html-encode** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/html-encode/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/Kikobeats/html-encode/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
