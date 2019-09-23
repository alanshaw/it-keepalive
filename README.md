# it-keepalive

[![Build Status](https://travis-ci.org/alanshaw/it-keepalive.svg?branch=master)](https://travis-ci.org/alanshaw/it-keepalive)
[![dependencies Status](https://david-dm.org/alanshaw/it-keepalive/status.svg)](https://david-dm.org/alanshaw/it-keepalive)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Keep an async iterable alive by yielding a value if it doesn't yield a value before the timeout

## Install

```sh
npm install it-keepalive
```

## Usage

```js
const keepAlive = require('it-keepalive')

const slowStream = (async function * () {
  yield 'A VALUE'
  // Pause for 1.5s
  await new Promise(resolve => setTimeout(resolve, 1500))
  yield 'A SLOW VALUE'
  yield 'A FAST VALUE'
  await new Promise(resolve => setTimeout(resolve, 2500))
  yield 'A VERY SLOW VALUE'
})()

const aliveStream = keepAlive(
  () => 'it LIVES!', // Value to yield if timeout expires
  { timeout: 1000 } // The default
)(slowStream)

for await (const value of aliveStream) {
  console.log(value)
}

/*
Logs:
A VALUE
it LIVES!
A SLOW VALUE
A FAST VALUE
it LIVES!
it LIVES!
A VERY SLOW VALUE
*/
```

## API

```js
const keepAlive = require('it-keepalive')
```

### `keepAlive(getKeepAliveValue, [options])`

Create a keep alive [transform iterable](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#transform-it). It returns a function that takes an async iterable ([source](https://gist.github.com/alanshaw/591dc7dd54e4f99338a347ef568d6ee9#source-it)) and returns an async iterable. The returned async iterable will yield all the values from the passed async iterable interspersed with "keep alive values" if the passed async iterable takes too long to yield a value.

* `getKeepAliveValue` - a function that returns a value to yield if the passed source fails to yield a value before the timeout expires.

`options` is an _optional_ parameter, an object with the following properties:

* `timeout` - the number of milliseconds after the last value was yielded
* `shouldKeepAlive` - a function called after the timeout expires and immediately before `getKeepAliveValue` is called and `yield`ed. Return `false` from this function to prevent a keep alive value from being yielded.

## Related

* [`it-pipe`](https://www.npmjs.com/package/it-pipe) Utility to "pipe" async iterables together
* [`it-awesome`](https://github.com/alanshaw/it-awesome) An index of useful modules for working with async iterables

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/it-keepalive/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
