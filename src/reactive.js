const Reactive = (function() {
  let data = new WeakMap()
  let listeners = new WeakMap()
  let formatters = new WeakMap()

  const isFunction = v => typeof v === 'function'
  const addObserver = (prop, cb, o) => {
    let instanceData = data.get(o)
    if (!instanceData.hasOwnProperty(prop)) {
      setupProp(prop, o)
    }

    let instanceListeners = listeners.get(o) || {}
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
    let instanceListeners = listeners.get(o) || {}
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
  const setupProp = (prop, o) => {
    let instanceData = data.get(o)
    Object.defineProperty(o, prop, {
      get: function() {
        let value = isFunction(instanceData[prop])
          ? instanceData[prop](resolveComputed(instanceData))
          : instanceData[prop]

        let instanceFormatters = formatters.get(o)
        return instanceFormatters && instanceFormatters.hasOwnProperty(prop)
          ? instanceFormatters[prop](value)
          : value
      },
      set: function(v) {
        if (isFunction(instanceData[prop])) {
          return
        }

        instanceData[prop] = v
        data.set(o, instanceData)
        notifyPropListeners(prop, o)
        notifyComputedProps(instanceData, o)
      }
    })
  }

  class Reactive {
    constructor(obj) {
      data.set(this, obj || {})

      if (typeof obj === 'object') {
        for (let key in obj) {
          setupProp(key, this)
        }
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
