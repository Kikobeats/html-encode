# html-to-utf8

A Node.js library for converting HTML documents of arbitrary encoding to UTF-8.

### Installation

```shell
npm install html-to-utf8
```

### Usage

```javascript
var request = require('request')
var toUTF8 = require('html-to-utf8')

request({
  url: 'http://www.rakuten.co.jp',
  encoding: null // stop request from decoding response
}, function (err, resp, buffer) {
  if (err) {
    console.error(err.stack)
    return
  }

  var htmlInUTF8 = toUTF8(buffer, resp.headers['content-type'])
})
```

### License

The code is available under [MIT license](LICENSE).
