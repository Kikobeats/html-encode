'use strict'

var iconv = require('iconv-lite')
var path = require('path')
var fs = require('fs')
var toUTF8 = require('./')

const buffer = fs.readFileSync(path.join(__dirname, 'test/fixtures/rp.pl.html'))

var str = toUTF8(buffer, 'windows-1250')
console.log(str.includes('majątków'))
