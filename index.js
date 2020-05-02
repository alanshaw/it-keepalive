const getIterator = require('get-iterator')
const KEEP_ALIVE = {}

module.exports = (getKeepAliveValue, options) => {
  options = options || {}

  return source => {
    source = getIterator(source)
    let sourceNext

    return {
      [Symbol.asyncIterator] () {
        return this
      },

      async next () {
        while (true) {
          if (!sourceNext) {
            sourceNext = source.next()
          }

          let timer
          const timeout = new Promise(resolve => {
            timer = setTimeout(() => resolve({ value: KEEP_ALIVE }), options.timeout || 1000)
          })

          const { done, value } = await Promise.race([timeout, sourceNext])
          clearTimeout(timer)

          if (done) return { done }

          if (value === KEEP_ALIVE) {
            if (!options.shouldKeepAlive || options.shouldKeepAlive()) {
              return { value: getKeepAliveValue() }
            }
            continue
          }

          sourceNext = null
          return { value }
        }
      },

      return () {
        if (source.return) return source.return()
      }
    }
  }
}
