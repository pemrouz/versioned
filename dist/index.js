'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = versioned;
exports.set = set;

var _emitterify = require('utilise/emitterify');

var _emitterify2 = _interopRequireDefault(_emitterify);

var _last = require('utilise/last');

var _last2 = _interopRequireDefault(_last);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _by = require('utilise/by');

var _by2 = _interopRequireDefault(_by);

var _immutable = require('immutable');

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function versioned(o) {
  if (o.log || !_is2.default.obj(o)) return o;
  (0, _def2.default)((0, _emitterify2.default)(o), 'log', [{ value: immutable(o) }]);
  if (supports()) observe(o, function (changes) {
    return changes.map(normalize).map(append(o));
  });
  return o;
}

function set(o) {
  return function (diff) {
    var key = diff.key;
    var value = diff.value;
    var type = diff.type;

    act.raw[arr(o)][type](o)(key = (0, _str2.default)(key), value);
    if (!supports()) append(o)([{ key: key, value: value, type: type }]);else o.emit('change', { key: key, value: value, type: type });
  };
}

function normalize(_ref) {
  var type = _ref.type;
  var oldValue = _ref.oldValue;
  var removed = _ref.removed;
  var object = _ref.object;
  var name = _ref.name;
  var index = _ref.index;
  var addedCount = _ref.addedCount;

  var deleted = type == 'delete' ? oldValue : removed && removed[0],
      key = name || (0, _str2.default)(index),
      value = deleted || object[key],
      entries = [];

  if (type == 'splice') type = deleted ? 'delete' : 'add';

  if (!_is2.default.arr(object) || !addedCount && !deleted) return [{ key: key, value: value, type: type }];

  for (var i = 0; i < removed.length | 0; i++) {
    entries.push({ key: key, value: removed[i], type: 'delete' });
  }for (var i = 0; i < addedCount; i++) {
    entries.push({ key: (0, _str2.default)(index + i), value: object[index + i], type: 'add' });
  }return entries;
}

function append(o) {
  return function (diffs) {
    diffs.map(function (diff) {
      var key = diff.key;
      var value = diff.value;
      var type = diff.type;
      var log = o.log;
      var action = act.imm[arr(o)][type];
      var previous = (0, _last2.default)(log).value;
      var value = action(previous)(key, value);

      log.push({ value: value, diff: diff });
      o.emit('change', diff);
    });
  };
}

function arr(o) {
  return _is2.default.arr(o) ? 'arr' : 'obj';
}

var act = {
  raw: {
    arr: {
      update: function update(o) {
        return function (k, v) {
          return o[k] = v;
        };
      },
      delete: function _delete(o) {
        return function (k, v) {
          return o.splice(k, 1);
        };
      },
      add: function add(o) {
        return function (k, v) {
          return o.splice(k, 0, v);
        };
      }
    },
    obj: {
      update: function update(o) {
        return function (k, v) {
          return o[k] = v;
        };
      },
      delete: function _delete(o) {
        return function (k, v) {
          return delete o[k];
        };
      },
      add: function add(o) {
        return function (k, v) {
          return o[k] = v;
        };
      }
    }
  },
  imm: {
    arr: {
      update: function update(o) {
        return function (k, v) {
          return o.set(k, v);
        };
      },
      delete: function _delete(o) {
        return function (k, v) {
          return o.splice(k, 1);
        };
      },
      add: function add(o) {
        return function (k, v) {
          return o.splice(k, 0, v);
        };
      }
    },
    obj: {
      update: function update(o) {
        return function (k, v) {
          return o.set(k, v);
        };
      },
      delete: function _delete(o) {
        return function (k, v) {
          return o.remove(k);
        };
      },
      add: function add(o) {
        return function (k, v) {
          return o.set(k, v);
        };
      }
    }
  }
};

var err = require('utilise/err')('[versioned]'),
    log = require('utilise/log')('[versioned]'),
    supports = function supports(d) {
  return !!Object.observe;
},
    immutable = function immutable(o) {
  return _is2.default.arr(o) ? (0, _immutable.List)(o) : (0, _immutable.Map)(o);
},
    observe = function observe(o, fn) {
  return _is2.default.arr(o) ? Array.observe(o, fn) : Object.observe(o, fn);
};