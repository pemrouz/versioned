'use strict';

var _last = require('utilise/last');

var _last2 = _interopRequireDefault(_last);

var _time = require('utilise/time');

var _time2 = _interopRequireDefault(_time);

var _chai = require('chai');

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('versioned', function () {

  it('should changelog object', function (done) {
    var o = (0, _2.default)({});

    (0, _chai.expect)(o.log.length).to.eql(1);
    (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql(undefined);
    (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({});

    (0, _time2.default)(100, function (d) {
      return o.focused = false;
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(2);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: 'focused', value: false, type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ focused: false });
    });

    (0, _time2.default)(200, function (d) {
      return o.focused = true;
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(3);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: 'focused', value: true, type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ focused: true });
    });

    (0, _time2.default)(300, function (d) {
      return delete o.focused;
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(4);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: 'focused', value: true, type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({});
    });

    (0, _time2.default)(400, done);
  });

  it('should changelog array', function (done) {
    var o = (0, _2.default)([]);

    (0, _chai.expect)(o.log.length).to.eql(1);
    (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql(undefined);
    (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([]);

    (0, _time2.default)(100, function (d) {
      return o.push('foo');
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(2);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 'foo', type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql(['foo']);
    });

    (0, _time2.default)(200, function (d) {
      return o[0] = 'bar';
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(3);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql(['bar']);
    });

    (0, _time2.default)(300, function (d) {
      return o.pop();
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o.log.length).to.eql(4);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([]);
    });

    (0, _time2.default)(400, done);
  });

  it('should add/remove multiple values, at arbitrary index', function (done) {
    var o = (0, _2.default)([]);

    (0, _chai.expect)(o.log.length).to.eql(1);
    (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql(undefined);
    (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([]);

    (0, _time2.default)(100, function (d) {
      return o.splice(0, 0, 1, 4);
    });
    (0, _time2.default)(110, function (d) {
      var len = o.log.length;
      (0, _chai.expect)(len).to.eql(3);
      (0, _chai.expect)(o.log[len - 2].diff).to.eql({ key: '0', value: 1, type: 'add' });
      (0, _chai.expect)(o.log[len - 2].value.toJS()).to.eql([1]);
      (0, _chai.expect)(o.log[len - 1].diff).to.eql({ key: '1', value: 4, type: 'add' });
      (0, _chai.expect)(o.log[len - 1].value.toJS()).to.eql([1, 4]);
    });

    (0, _time2.default)(200, function (d) {
      return o.splice(1, 0, 2, 3);
    });
    (0, _time2.default)(210, function (d) {
      var len = o.log.length;
      (0, _chai.expect)(len).to.eql(5);
      (0, _chai.expect)(o.log[len - 2].diff).to.eql({ key: '1', value: 2, type: 'add' });
      (0, _chai.expect)(o.log[len - 2].value.toJS()).to.eql([1, 2, 4]);
      (0, _chai.expect)(o.log[len - 2].value.toJS().length).to.eql(3);
      (0, _chai.expect)(o.log[len - 1].diff).to.eql({ key: '2', value: 3, type: 'add' });
      (0, _chai.expect)(o.log[len - 1].value.toJS()).to.eql([1, 2, 3, 4]);
      (0, _chai.expect)(o.log[len - 1].value.toJS().length).to.eql(4);
    });

    (0, _time2.default)(300, function (d) {
      return o.splice(1, 2);
    });
    (0, _time2.default)(310, function (d) {
      var len = o.log.length;
      (0, _chai.expect)(len).to.eql(7);
      (0, _chai.expect)(o.log[len - 2].diff).to.eql({ key: '1', value: 2, type: 'delete' });
      (0, _chai.expect)(o.log[len - 2].value.toJS()).to.eql([1, 3, 4]);
      (0, _chai.expect)(o.log[len - 2].value.toJS().length).to.eql(3);
      (0, _chai.expect)(o.log[len - 1].diff).to.eql({ key: '1', value: 3, type: 'delete' });
      (0, _chai.expect)(o.log[len - 1].value.toJS()).to.eql([1, 4]);
      (0, _chai.expect)(o.log[len - 1].value.toJS().length).to.eql(2);
    });

    (0, _time2.default)(400, done);
  });

  it('should emit change events', function (done) {
    var o = (0, _2.default)([]),
        result;

    o.on('change', function (d) {
      return result = d;
    });

    (0, _time2.default)(100, function (d) {
      return o.push(1);
    });
    (0, _time2.default)(110, function (d) {
      return (0, _chai.expect)(result).to.eql({ key: '0', value: 1, type: 'add' });
    });
    (0, _time2.default)(120, function (d) {
      return result = null;
    });

    (0, _time2.default)(200, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'add' });
    });
    (0, _time2.default)(210, function (d) {
      return (0, _chai.expect)(result).to.eql({ key: '0', value: 2, type: 'add' });
    });
    (0, _time2.default)(220, function (d) {
      return result = null;
    });

    (0, _time2.default)(300, done);
  });

  it('should continue gracefully', function (done) {
    var o = (0, _2.default)([]);
    o.push(1);

    (0, _time2.default)(10, function (d) {
      (0, _chai.expect)((0, _2.default)(o)).to.eql(o);
      (0, _chai.expect)(o.log.length).to.eql(2);
    });

    (0, _time2.default)(20, function (d) {
      (0, _chai.expect)((0, _2.default)(5)).to.eql(5);
      (0, _chai.expect)((0, _2.default)(5).log).to.not.be.ok;
    });

    (0, _time2.default)(30, done);
  });

  it('should explicitly add entries with O.o (array)', function (done) {
    var o = (0, _2.default)([]);

    (0, _time2.default)(100, function (d) {
      return (0, _.set)(o)({ key: 0, value: 1, type: 'add' });
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o).to.eql([1]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([1]);
    });

    (0, _time2.default)(200, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'update' });
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o).to.eql([2]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([2]);
    });

    (0, _time2.default)(300, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'delete' });
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o).to.eql([]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([]);
    });

    (0, _time2.default)(400, done);
  });

  it('should explicitly add entries with O.o (object)', function (done) {
    var o = (0, _2.default)({});

    (0, _time2.default)(100, function (d) {
      return (0, _.set)(o)({ key: 0, value: 1, type: 'add' });
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o).to.eql({ 0: 1 });
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ 0: 1 });
    });

    (0, _time2.default)(200, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'update' });
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o).to.eql({ 0: 2 });
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ 0: 2 });
    });

    (0, _time2.default)(300, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'delete' });
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o).to.eql({});
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({});
    });

    (0, _time2.default)(400, done);
  });

  it('should explicitly add entries without O.o (object)', function (done) {
    var observe = Object.observe;
    delete Object.observe;

    var o = (0, _2.default)({});

    (0, _time2.default)(100, function (d) {
      return (0, _.set)(o)({ key: 0, value: 1, type: 'add' });
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o).to.eql({ 0: 1 });
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ 0: 1 });
    });

    (0, _time2.default)(200, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'update' });
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o).to.eql({ 0: 2 });
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({ 0: 2 });
    });

    (0, _time2.default)(300, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'delete' });
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o).to.eql({});
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql({});
    });

    (0, _time2.default)(400, function (d) {
      return Object.observe = observe;
    });
    (0, _time2.default)(410, done);
  });

  it('should explicitly add entries without O.o (array)', function (done) {
    var observe = Object.observe;
    delete Object.observe;

    var o = (0, _2.default)([]);

    (0, _time2.default)(100, function (d) {
      return (0, _.set)(o)({ key: 0, value: 1, type: 'add' });
    });
    (0, _time2.default)(110, function (d) {
      (0, _chai.expect)(o).to.eql([1]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([1]);
    });

    (0, _time2.default)(200, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'update' });
    });
    (0, _time2.default)(210, function (d) {
      (0, _chai.expect)(o).to.eql([2]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([2]);
    });

    (0, _time2.default)(300, function (d) {
      return (0, _.set)(o)({ key: 0, value: 2, type: 'delete' });
    });
    (0, _time2.default)(310, function (d) {
      (0, _chai.expect)(o).to.eql([]);
      (0, _chai.expect)((0, _last2.default)(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' });
      (0, _chai.expect)((0, _last2.default)(o.log).value.toJS()).to.eql([]);
    });

    (0, _time2.default)(400, function (d) {
      return Object.observe = observe;
    });
    (0, _time2.default)(410, done);
  });
});

