import test from 'ava'
import pipe from 'it-pipe'
import keepAlive from '.'

const collect = async source => {
  const values = []
  for await (const value of source) values.push(value)
  return values
}

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

test('should yield keep alive value if no source value', async t => {
  const keepAliveValue = `KA${Date.now()}`
  const sourceValue = `S${Date.now()}`

  const output = await pipe(
    (async function * () {
      await pause(1500)
      yield sourceValue
    })(),
    keepAlive(() => keepAliveValue),
    collect
  )

  t.is(output.length, 2)
  t.is(output[0], keepAliveValue)
  t.is(output[1], sourceValue)
})

test('should not yield keep alive value if source values', async t => {
  const keepAliveValue = `KA${Date.now()}`
  const sourceValue = `S${Date.now()}`

  const output = await pipe(
    (async function * () {
      await pause(750)
      yield sourceValue
      await pause(500)
      yield sourceValue
      await pause(750)
      yield sourceValue
    })(),
    keepAlive(() => keepAliveValue),
    collect
  )

  t.is(output.length, 3)
  output.forEach(v => t.is(v, sourceValue))
})
