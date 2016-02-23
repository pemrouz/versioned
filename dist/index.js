'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _emitterify = require('utilise/emitterify');

var _emitterify2 = _interopRequireDefault(_emitterify);

var _def = require('utilise/def');

var _def2 = _interopRequireDefault(_def);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (o) {
    return o.log || !_is2.default.obj(o) ? (err('expected to be an object: ', o), o) : ((0, _def2.default)((0, _emitterify2.default)(o, -1), 'log', [{ value: immutable(o) }]), o);
};

var err = require('utilise/err')('[versioned]'),
    immutable = function immutable(o) {
    return _is2.default.arr(o) ? (0, _immutable.List)(o) : (0, _immutable.Map)(o);
};