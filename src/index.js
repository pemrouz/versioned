export const versioned = o => 
    o.log || !is.obj(o) 
  ? (log('expected to be an object: ', o), o)
  : (def(emitterify(o, -1), 'log', [{ value: immutable(o) }]), o)

export const set = diff => o => {
  if (!o || !is.obj(o)) return log('expected to be an object: ', o), o
  var { key, value, type } = diff
  act.raw[type](o)(key = str(key), value)
  append({ key, value, type })(o)
  return o
}

export const push = value => o => 
  !is.arr(o) ? o
: set({ key: o.length, value, type: 'add' })(o)

export const pop = o => 
  !is.arr(o) ? o
: set({ key: o.length-1, value: last(o), type: 'remove' })(o)

export const remove = key => o => 
  set({ key, value: o[key], type: 'remove' })(o)

export const update = (key, value) => o => 
  set({ key, value, type: 'update' })(o)

const append = diff => o => {
  const { log } = o

  if (o.log) {
    const { key, value, type } = diff
        , previous = last(log).value
        , action   = act.imm[type](o)
        , latest   = action(previous)(key, value)

    log.push({ value: latest, diff })
  }

  if (o.emit) o.emit('log', diff)
}

const act = {
  raw: {
    update: o => (k, v) => o[k] = v
  , remove: o => (k, v) => is.arr(o) ? o.splice(k, 1)    : delete o[k]
  , add   : o => (k, v) => is.arr(o) ? o.splice(k, 0, v) : o[k] = v
  }
, imm: {
    update: d => o => (k, v) => o.set(k, v)
  , remove: d => o => (k, v) => is.arr(d) ? o.splice(k, 1)    : o.remove(k)
  , add   : d => o => (k, v) => is.arr(d) ? o.splice(k, 0, v) : o.set(k, v)
  }
}

import emitterify from 'utilise/emitterify'
import last from 'utilise/last'
import def from 'utilise/def'
import str from 'utilise/str'
import is from 'utilise/is'
import { List as list, Map as map } from 'immutable'

const err = require('utilise/err')('[versioned]')
    , log = require('utilise/log')('[versioned]')
    , immutable = o => is.arr(o) ? list(o) : map(o)