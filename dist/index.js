'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.remove = exports.pop = exports.push = exports.set = exports.versioned = undefined;

var _emitterify = require('utilise/emitterify');

var _emitterify2 = _interopRequireDefault(_emitterify);

var _last = require('utilise/last');

var _last2 = _interopRequireDefault(_last);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _str = require('utilise/str');

var _str2 = _interopRequireDefault(_str);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _immutable = require('immutable');

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var versioned = exports.versioned = function versioned(o) {
  return o.log || !_is2.default.obj(o) ? (log('expected to be an object: ', o), o) : ((0, _def2.default)((0, _emitterify2.default)(o, -1), 'log', [{ value: immutable(o) }]), o);
};

var set = exports.set = function set(diff) {
  return function (o) {
    if (!o || !_is2.default.obj(o)) return log('expected to be an object: ', o), o;
    var key = diff.key;
    var value = diff.value;
    var type = diff.type;

    act.raw[type](o)(key = (0, _str2.default)(key), value);
    append({ key: key, value: value, type: type })(o);
    return o;
  };
};

var push = exports.push = function push(value) {
  return function (o) {
    return !_is2.default.arr(o) ? o : set({ key: o.length, value: value, type: 'add' })(o);
  };
};

var pop = exports.pop = function pop(o) {
  return !_is2.default.arr(o) ? o : set({ key: o.length - 1, value: (0, _last2.default)(o), type: 'remove' })(o);
};

var remove = exports.remove = function remove(key) {
  return function (o) {
    return set({ key: key, value: o[key], type: 'remove' })(o);
  };
};

var update = exports.update = function update(key, value) {
  return function (o) {
    return set({ key: key, value: value, type: 'update' })(o);
  };
};

var append = function append(diff) {
  return function (o) {
    var log = o.log;

    if (o.log) {
      var key = diff.key;
      var value = diff.value;
      var type = diff.type;
      var previous = (0, _last2.default)(log).value;
      var action = act.imm[type](o);
      var latest = action(previous)(key, value);

      log.push({ value: latest, diff: diff });
    }

    if (o.emit) o.emit('log', diff);
  };
};

var act = {
  raw: {
    update: function update(o) {
      return function (k, v) {
        return o[k] = v;
      };
    },
    remove: function remove(o) {
      return function (k, v) {
        return _is2.default.arr(o) ? o.splice(k, 1) : delete o[k];
      };
    },
    add: function add(o) {
      return function (k, v) {
        return _is2.default.arr(o) ? o.splice(k, 0, v) : o[k] = v;
      };
    }
  },
  imm: {
    update: function update(d) {
      return function (o) {
        return function (k, v) {
          return o.set(k, v);
        };
      };
    },
    remove: function remove(d) {
      return function (o) {
        return function (k, v) {
          return _is2.default.arr(d) ? o.splice(k, 1) : o.remove(k);
        };
      };
    },
    add: function add(d) {
      return function (o) {
        return function (k, v) {
          return _is2.default.arr(d) ? o.splice(k, 0, v) : o.set(k, v);
        };
      };
    }
  }
};

var err = require('utilise/err')('[versioned]'),
    log = require('utilise/log')('[versioned]'),
    immutable = function immutable(o) {
  return _is2.default.arr(o) ? (0, _immutable.List)(o) : (0, _immutable.Map)(o);
};