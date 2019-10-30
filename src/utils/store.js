const config = require('../../config')
const { isObject } = require('./util')

function use(key, value) {
  const result = get(key)

  if (!result || result === undefined) {
    return set(key, value)
  }
  return result
}

function get(key) {
  const result = localStorage.getItem(`${storeName}-${key}`)
  return isObject(result) ? JSON.parse(result) : result
}

function set(key, data) {
  data = isObject(data) ? JSON.stringify(data) : data
  localStorage.setItem(`${storeName}-${key}`, data)
  return get(key)
}

function each(fn) {
  for (var i = localStorage.length - 1; i >= 0; i--) {
    var key = localStorage.key(i)
    fn(get(key), key)
  }
}

function remove(key) {
  return localStorage.removeItem(`${storeName}-${key}`)
}

function clear() {
  return localStorage.clear()
}

const store = {
  name: config.storeKey,
  use,
  get,
  set,
  each,
  remove,
  clear,
}
const storeName = store.name

module.exports = store
