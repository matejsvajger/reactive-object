const Reactive = (function() {
  let listeners = new WeakMap()
  let formatters = new WeakMap()

  const isFunction = v => typeof v === 'function'
  const addObserver = (prop, cb, o) => {
    let instanceListeners = listeners.get(o) || {};
    if (!instanceListeners.hasOwnProperty(prop)) {
      instanceListeners[prop] = []
    }
    instanceListeners[prop].push(cb)
    listeners.set(o, instanceListeners)
    cb(o[prop])
  }
  const addFormatter = (prop, cb, o) => {
    let instanceFormatters = formatters.get(o) || {}
    instanceFormatters[prop] = cb
    formatters.set(o, instanceFormatters)
    notifyPropListeners(prop, o)
  }
  const notifyPropListeners = (prop, o) => {
    let instanceListeners = listeners.get(o) || {};
    if (instanceListeners.hasOwnProperty(prop)) {
      for (let i in instanceListeners[prop]) {
        instanceListeners[prop][i](o[prop])
      }
    }
  }
  const notifyComputedProps = (props, o) => {
    for (let prop in props) {
      if (isFunction(props[prop])) {
        notifyPropListeners(prop, o)
      }
    }
  }
  const resolveComputed = data => {
    let resolved = {}
    for (let key in data) {
      resolved[key] = isFunction(data[key]) ? data[key](data) : data[key]
    }
    return resolved
  }

  class Reactive {
    constructor(data) {
      for (let key in data) {
        Object.defineProperty(this, key, {
          get: function() {
            let value = isFunction(data[key])
              ? data[key](resolveComputed(data))
              : data[key]

            let instanceFormatters = formatters.get(this)
            return instanceFormatters && instanceFormatters.hasOwnProperty(key)
              ? instanceFormatters[key](value)
              : value
          },
          set: function(v) {
            if (isFunction(data[key])) {
              return
            }

            data[key] = v
            notifyPropListeners(key, this)
            notifyComputedProps(data, this)
          }
        })
      }
    }

    observe(prop, cb) {
      if (typeof prop === 'string') {
        addObserver(prop, cb, this)
      } else {
        for (let key in prop) {
          addObserver(key, prop[key], this)
        }
      }
    }

    format(prop, cb) {
      if (typeof prop === 'string') {
        addFormatter(prop, cb, this)
      } else {
        for (let key in prop) {
          addFormatter(key, prop[key], this)
        }
      }
    }
  }

  return Reactive
})()

export default Reactive
