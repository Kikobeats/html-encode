'use strict'

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { setFlagsFromString } = require('v8')
const { runInNewContext } = require('vm')
const iconv = require('iconv-lite')

const toUTF8 = require('..')('utf-8')

const RUNS = 7
const HEADER_DECODES = 1200
const META_DECODES = 10000
const INFERRED_DECODES = 300

const DECLARED_CHARSET = /(?:charset|encoding)\s*=\s*['"]?shift_jis['"]?/gi

const fixture = name => readFileSync(join(__dirname, '..', 'test', 'fixtures', name))

const polish = fixture('rp.pl.html')
const shiftJis = fixture('51242_54045.html')
const undeclaredShiftJis = iconv.encode(
  iconv.decode(shiftJis, 'shift_jis').replace(DECLARED_CHARSET, ''),
  'shift_jis'
)

const decodeCase = ({ name, buffer, contentType, decodes, expected }) => ({
  name,
  extra: `${decodes} decodes of ${buffer.length} bytes`,
  timed: () => {
    let matched = 0
    for (let decode = 0; decode < decodes; decode++) {
      if (toUTF8(buffer, contentType).includes(expected)) matched++
    }
    return matched
  },
  verify: matched => matched === decodes
})

const CASES = [
  decodeCase({
    name: 'decode windows-1250 from content-type',
    buffer: polish,
    contentType: 'text/html; charset=windows-1250',
    decodes: HEADER_DECODES,
    expected: 'majątków'
  }),
  decodeCase({
    name: 'decode shift_jis from meta charset',
    buffer: shiftJis,
    contentType: 'text/html',
    decodes: META_DECODES,
    expected: '或る日の小せん'
  }),
  decodeCase({
    name: 'infer shift_jis with jschardet',
    buffer: undeclaredShiftJis,
    contentType: 'text/html',
    decodes: INFERRED_DECODES,
    expected: '或る日の小せん'
  })
]

const median = values => {
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

setFlagsFromString('--expose-gc')
const collectGarbage = runInNewContext('gc')

const now = () => process.hrtime.bigint()

const elapsed = started => Number(now() - started) / 1e6

const fmt = value => value.toFixed(1)

const report = slot => {
  const med = slot.walls.length ? median(slot.walls) : Number.NaN
  const min = slot.walls.length ? Math.min(...slot.walls) : Number.NaN
  const max = slot.walls.length ? Math.max(...slot.walls) : Number.NaN
  const extra = `${slot.entry.extra}, errors ${slot.errors}, runs ${RUNS}`
  console.log(`${slot.entry.name}  median ${fmt(med)}ms  range ${fmt(min)}-${fmt(max)}  ${extra}`)
  return {
    name: slot.entry.name,
    unit: 'ms',
    value: Number(med.toFixed(1)),
    range: `${fmt(min)}-${fmt(max)}`,
    extra
  }
}

const takeSample = (slot, run) => {
  try {
    collectGarbage()
    const started = now()
    const outcome = slot.entry.timed()
    const wall = elapsed(started)
    if (!slot.entry.verify(outcome)) {
      console.error(`${slot.entry.name} run ${run} produced unexpected output`)
      slot.errors++
      return
    }
    slot.walls.push(wall)
  } catch (error) {
    console.error(error)
    slot.errors++
  }
}

const main = () => {
  const slots = CASES.map(entry => ({ entry, walls: [], errors: 0 }))
  for (const slot of slots) {
    try {
      slot.entry.timed()
    } catch (error) {
      console.error(error)
      slot.errors++
    }
  }
  for (let run = 0; run < RUNS; run++) {
    for (const slot of slots) takeSample(slot, run)
  }
  const results = slots.map(report)
  writeFileSync(
    join(__dirname, '..', 'benchmark-output.json'),
    JSON.stringify(results, null, 2) + '\n'
  )
  const errors = slots.reduce((total, slot) => total + slot.errors, 0)
  if (errors > 0 || results.some(result => !Number.isFinite(result.value))) {
    process.exitCode = 1
  }
}

main()
