import { expect } from 'chai'
import versioned from './'

describe('versioned', function() {
  
  it('should initialise versioning', () => {
    var o = {}
    expect(versioned(o)).to.be.eql(o)
    expect(o.log).to.be.ok
    expect(o.emit).to.be.ok
    expect(o.log[0].value.toJS()).to.eql({})
    expect(o.log[0].diff).to.not.be.ok

    var a = []
    expect(versioned(a)).to.be.eql(a)
    expect(a.log).to.be.ok
    expect(a.emit).to.be.ok
    expect(a.log[0].value.toJS()).to.eql([])
    expect(a.log[0].diff).to.not.be.ok
  })

  it('should skip gracefully', function(){
    expect(versioned(true)).to.eql(true)
    expect(versioned(5)).to.eql(5)
  })

  it('should allow recreating', function(){
    var o = versioned({})

    expect(o.log.reset(['foo'])).to.eql(o.log)
    expect(o.log.length).to.eql(2)

    expect(o.log[0].value.toJS()).to.eql({})
    expect(o.log[0].diff).to.eql(undefined)

    expect(o.log[1].value.toJS()).to.eql(['foo'])
    expect(o.log[1].diff).to.eql(undefined)
  })

  it('should allow overwriting log', function(){
    var a = versioned({})
      , b = versioned([])

    expect(b.log = a.log.reset(b)).to.eql(a.log)
    expect(b.log.length).to.eql(2)

    expect(b.log[0].value.toJS()).to.eql({})
    expect(b.log[0].diff).to.eql(undefined)

    expect(b.log[1].value.toJS()).to.eql([])
    expect(b.log[1].diff).to.eql(undefined)
  })


})