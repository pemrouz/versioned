export default o => 
    o.log || !is.obj(o) 
  ? (err('expected to be an object: ', o), o)
  : (def(emitterify(o, -1), 'log', [{ value: immutable(o) }]), o)

import emitterify from 'utilise/emitterify'
import def from 'utilise/def'
import is from 'utilise/is'
import { List as list, Map as map } from 'immutable'

const err = require('utilise/err')('[versioned]')
    , immutable = o => is.arr(o) ? list(o) : map(o)