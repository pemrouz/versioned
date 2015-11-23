export default function versioned(o){
  if (o.log || !is.obj(o)) return o
  def(emitterify(o), 'log', [{ value: immutable(o) }])
  if (supports()) observe(o, changes => changes
    .map(normalize)
    .map(append(o))
  )
  return o
}

export function set(o){
  return diff => {
    var { key, value, type } = diff
    act.raw[arr(o)][type](o)(key = str(key), value)
    if (!supports()) append(o)([{ key, value, type }])
    else o.emit('change', { key, value, type })
  }
}

function normalize({ type, oldValue, removed, object, name, index, addedCount }) {
  var deleted = type == 'delete' ? oldValue : removed && removed[0]
    , key = name || str(index)
    , value = deleted || object[key]
    , entries = []

  if (type == 'splice') 
    type = deleted ? 'delete' : 'add'

  if (!is.arr(object) || (!addedCount && !deleted))
    return [{ key, value, type }]

  for (let i = 0; i < removed.length | 0; i++)
    entries.push({ key, value: removed[i], type: 'delete' })

  for (let i = 0; i < addedCount; i++) 
    entries.push({ key: str(index + i), value: object[index+i], type: 'add' })

  return entries
}

function append(o){
  return diffs => {
    diffs.map(diff => {
      var { key, value, type } = diff
        , { log }  = o
        , action   = act.imm[arr(o)][type]
        , previous = last(log).value
        , value    = action(previous)(key, value)

      log.push({ value, diff })
      o.emit('change', diff)
    })
  }
}

function arr(o){
  return is.arr(o) ? 'arr' : 'obj'
}

const act = {
  raw: {
    arr: {
      update: o => (k, v) => o[k] = v
    , delete: o => (k, v) => o.splice(k, 1)
    , add   : o => (k, v) => o.splice(k, 0, v)
    }
  , obj: {
      update: o => (k, v) => o[k] = v
    , delete: o => (k, v) => delete o[k]
    , add   : o => (k, v) => o[k] = v
    }
  }
, imm: {
    arr: {
      update: o => (k, v) => o.set(k, v)
    , delete: o => (k, v) => o.splice(k, 1)
    , add   : o => (k, v) => o.splice(k, 0, v)
    }
  , obj: {
      update: o => (k, v) => o.set(k, v)
    , delete: o => (k, v) => o.remove(k)
    , add   : o => (k, v) => o.set(k, v)
    }
  }
}

import emitterify from 'utilise/emitterify'
import last from 'utilise/last'
import def from 'utilise/def'
import str from 'utilise/str'
import not from 'utilise/not'
import is from 'utilise/is'
import by from 'utilise/by'
import { List as list, Map as map } from 'immutable'

const err = require('utilise/err')('[versioned]')
    , log = require('utilise/log')('[versioned]')
    , supports  = d => !!Object.observe
    , immutable = o => is.arr(o) ? list(o) : map(o)
    , observe   = (o, fn) => is.arr(o) ? Array.observe(o, fn) : Object.observe(o, fn)