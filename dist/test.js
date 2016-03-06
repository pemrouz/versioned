'use strict';

var _chai = require('chai');

var _ = require('./');

var _2 = _interopRequireDefault(_);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('versioned', function () {

  it('should initialise versioning', function () {
    var o = {};
    (0, _chai.expect)((0, _2.default)(o)).to.be.eql(o);
    (0, _chai.expect)(o.log).to.be.ok;
    (0, _chai.expect)(o.emit).to.be.ok;
    (0, _chai.expect)(o.log[0].value.toJS()).to.eql({});
    (0, _chai.expect)(o.log[0].diff).to.not.be.ok;

    var a = [];
    (0, _chai.expect)((0, _2.default)(a)).to.be.eql(a);
    (0, _chai.expect)(a.log).to.be.ok;
    (0, _chai.expect)(a.emit).to.be.ok;
    (0, _chai.expect)(a.log[0].value.toJS()).to.eql([]);
    (0, _chai.expect)(a.log[0].diff).to.not.be.ok;
  });

  it('should skip gracefully', function () {
    (0, _chai.expect)((0, _2.default)(true)).to.eql(true);
    (0, _chai.expect)((0, _2.default)(5)).to.eql(5);
  });

  it('should allow recreating', function () {
    var o = (0, _2.default)({});

    (0, _chai.expect)(o.log.reset(['foo'])).to.eql(o.log);
    (0, _chai.expect)(o.log.length).to.eql(2);

    (0, _chai.expect)(o.log[0].value.toJS()).to.eql({});
    (0, _chai.expect)(o.log[0].diff).to.eql(undefined);

    (0, _chai.expect)(o.log[1].value.toJS()).to.eql(['foo']);
    (0, _chai.expect)(o.log[1].diff).to.eql(undefined);
  });

  it('should allow overwriting log', function () {
    var a = (0, _2.default)({}),
        b = (0, _2.default)([]);

    (0, _chai.expect)(b.log = a.log.reset(b)).to.eql(a.log);
    (0, _chai.expect)(b.log.length).to.eql(2);

    (0, _chai.expect)(b.log[0].value.toJS()).to.eql({});
    (0, _chai.expect)(b.log[0].diff).to.eql(undefined);

    (0, _chai.expect)(b.log[1].value.toJS()).to.eql([]);
    (0, _chai.expect)(b.log[1].diff).to.eql(undefined);
  });
});

