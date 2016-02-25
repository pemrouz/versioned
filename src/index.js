export default o => o.log || !is.obj(o) 
  ? (err('expected to be an object: ', o), o)
  : (def(emitterify(o, -1), 'log', [{ value: immutable(o) }])
  ,  def(o.log, 'reset', d => (o.log.push({ value: immutable(d) }), o.log))
  ,  o
  )

import emitterify from 'utilise/emitterify'
import def from 'utilise/def'
import is from 'utilise/is'
import { fromJS as immutable } from 'immutable'
const err = require('utilise/err')('[versioned]')
