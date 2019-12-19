const Reactive = (() => {
  const data = new WeakMap()
  const listeners = new WeakMap()
  const formatters = new WeakMap()

  const isObject = v => typeof v === 'object'
  const isString = v => typeof v === 'string'
  const isFunction = v => typeof v === 'function'
  const forEach = (o, cb) => {
    for (let key in o) {
      cb(key, o[key])
    }
  }
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
  const resolveComputed = props => {
    let resolved = { ...props }
    for (let key in props) {
      resolved[key] = isFunction(props[key]) ? props[key](resolved) : props[key]
    }
    return resolved
  }
  const setupProp = (prop, o) => {
    Object.defineProperty(o, prop, {
      enumerable: true,
      get() {
        let instanceData = data.get(this)
        let resolved = resolveComputed(instanceData)
        let value = isFunction(instanceData[prop])
          ? instanceData[prop](resolved)
          : instanceData[prop]

        let instanceFormatters = formatters.get(this)
        return instanceFormatters && instanceFormatters.hasOwnProperty(prop)
          ? instanceFormatters[prop](value, resolved)
          : value
      },
      set(v) {
        let instanceData = data.get(this)
        if (isFunction(instanceData[prop])) {
          return
        }

        instanceData[prop] = v
        data.set(this, instanceData)
        notifyPropListeners(prop, this)
        notifyComputedProps(instanceData, this)
      }
    })
  }

  class Reactive {
    constructor(obj) {
      data.set(this, obj || {})

      isObject(obj) &&
      forEach(obj, key => setupProp(key, this))
    }

    observe(prop, cb) {
      isString(prop)
        ? addObserver(prop, cb, this)
        : forEach(prop, (key, val) => addObserver(key, val, this))
    }

    format(prop, cb) {
      isString(prop)
        ? addFormatter(prop, cb, this)
        : forEach(prop, (key, val) => addFormatter(key, val, this))
    }
  }

  return Reactive
})()

export default Reactive
