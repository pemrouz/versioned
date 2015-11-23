import last from 'utilise/last'
import time from 'utilise/time'
import { expect } from 'chai'
import { default as versioned, set } from './'

describe('versioned', function() {

  it('should changelog object', done => {
    var o = versioned({})

    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql({})

    time(100, d => o.focused = false)
    time(110, d => { expect(o.log.length).to.eql(2)
                     expect(last(o.log).diff).to.eql({ key: 'focused', value: false, type: 'add' })
                     expect(last(o.log).value.toJS()).to.eql({ focused: false }) })

    time(200, d => o.focused = true)
    time(210, d => { expect(o.log.length).to.eql(3)
                     expect(last(o.log).diff).to.eql({ key: 'focused', value: true, type: 'update' })                     
                     expect(last(o.log).value.toJS()).to.eql({ focused: true }) })

    time(300, d => delete o.focused)
    time(310, d => { expect(o.log.length).to.eql(4)
                     expect(last(o.log).diff).to.eql({ key: 'focused', value: true, type: 'delete' })                     
                     expect(last(o.log).value.toJS()).to.eql({}) })

    time(400, done)
  })

  it('should changelog array', done => {
    var o = versioned([])

    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql([])

    time(100, d => o.push('foo'))
    time(110, d => { expect(o.log.length).to.eql(2)
                     expect(last(o.log).diff).to.eql({ key: '0', value: 'foo', type: 'add' })
                     expect(last(o.log).value.toJS()).to.eql(['foo']) })

    time(200, d => o[0] = 'bar')
    time(210, d => { expect(o.log.length).to.eql(3)
                     expect(last(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'update' })                     
                     expect(last(o.log).value.toJS()).to.eql(['bar']) })

    time(300, d => o.pop())
    time(310, d => { expect(o.log.length).to.eql(4)
                     expect(last(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'delete' })                     
                     expect(last(o.log).value.toJS()).to.eql([]) })

    time(400, done)
  })
  

  it('should add/remove multiple values, at arbitrary index', done => {
    var o = versioned([])

    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql([])

    time(100, d => o.splice(0, 0, 1, 4))
    time(110, d => { var len = o.log.length
                     expect(len).to.eql(3)
                     expect(o.log[len-2].diff).to.eql({ key: '0', value: 1, type: 'add' })
                     expect(o.log[len-2].value.toJS()).to.eql([1]) 
                     expect(o.log[len-1].diff).to.eql({ key: '1', value: 4, type: 'add' })
                     expect(o.log[len-1].value.toJS()).to.eql([1, 4]) 
                   })


    time(200, d => o.splice(1, 0, 2, 3))
    time(210, d => { var len = o.log.length
                     expect(len).to.eql(5)
                     expect(o.log[len-2].diff).to.eql({ key: '1', value: 2, type: 'add' })
                     expect(o.log[len-2].value.toJS()).to.eql([1, 2, 4]) 
                     expect(o.log[len-2].value.toJS().length).to.eql(3) 
                     expect(o.log[len-1].diff).to.eql({ key: '2', value: 3, type: 'add' })
                     expect(o.log[len-1].value.toJS()).to.eql([1, 2, 3, 4]) 
                     expect(o.log[len-1].value.toJS().length).to.eql(4) 
                   })

    time(300, d => o.splice(1, 2))
    time(310, d => { var len = o.log.length
                     expect(len).to.eql(7)
                     expect(o.log[len-2].diff).to.eql({ key: '1', value: 2, type: 'delete' })
                     expect(o.log[len-2].value.toJS()).to.eql([1, 3, 4]) 
                     expect(o.log[len-2].value.toJS().length).to.eql(3) 
                     expect(o.log[len-1].diff).to.eql({ key: '1', value: 3, type: 'delete' })
                     expect(o.log[len-1].value.toJS()).to.eql([1, 4]) 
                     expect(o.log[len-1].value.toJS().length).to.eql(2) 
                   })

    time(400, done)
  })

  it('should emit change events', done => {
    var o = versioned([])
      , result

    o.on('change', d => result = d)

    time(100, d => o.push(1))
    time(110, d => expect(result).to.eql({ key: '0', value: 1, type: 'add' }))
    time(120, d => result = null)

    time(200, d => set(o)({ key: 0, value: 2, type: 'add' }))
    time(210, d => expect(result).to.eql({ key: '0', value: 2, type: 'add' }))
    time(220, d => result = null)

    time(300, done)
  })

  it('should continue gracefully', done => {
    var o = versioned([])
    o.push(1)

    time(10, d => {
      expect(versioned(o)).to.eql(o)
      expect(o.log.length).to.eql(2)
    })

    time(20, d => {
      expect(versioned(5)).to.eql(5)
      expect(versioned(5).log).to.not.be.ok
    })

    time(30, done)
  })

  it('should explicitly add entries with O.o (array)', done => {
    var o = versioned([])
    
    time(100, d => set(o)({ key: 0, value: 1, type: 'add' }))
    time(110, d => {
      expect(o).to.eql([1])
      expect(last(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' })
      expect(last(o.log).value.toJS()).to.eql([1])
    })

    time(200, d => set(o)({ key: 0, value: 2, type: 'update' }))
    time(210, d => {
      expect(o).to.eql([2])
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' })
      expect(last(o.log).value.toJS()).to.eql([2])
    })

    time(300, d => set(o)({ key: 0, value: 2, type: 'delete' }))
    time(310, d => {
      expect(o).to.eql([])
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' })
      expect(last(o.log).value.toJS()).to.eql([])
    })

    time(400, done)
  })

    it('should explicitly add entries with O.o (object)', done => {
    var o = versioned({})
    
    time(100, d => set(o)({ key: 0, value: 1, type: 'add' }))
    time(110, d => {
      expect(o).to.eql({ 0: 1 })
      expect(last(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' })
      expect(last(o.log).value.toJS()).to.eql({ 0: 1 })
    })

    time(200, d => set(o)({ key: 0, value: 2, type: 'update' }))
    time(210, d => {
      expect(o).to.eql({ 0: 2 })
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' })
      expect(last(o.log).value.toJS()).to.eql({ 0: 2 })
    })

    time(300, d => set(o)({ key: 0, value: 2, type: 'delete' }))
    time(310, d => {
      expect(o).to.eql({})
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' })
      expect(last(o.log).value.toJS()).to.eql({})
    })

    time(400, done)
  })

  it('should explicitly add entries without O.o (object)', done => {
    var observe = Object.observe
    delete Object.observe

    var o = versioned({})
    
    time(100, d => set(o)({ key: 0, value: 1, type: 'add' }))
    time(110, d => {
      expect(o).to.eql({ 0: 1 })
      expect(last(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' })
      expect(last(o.log).value.toJS()).to.eql({ 0: 1 })
    })

    time(200, d => set(o)({ key: 0, value: 2, type: 'update' }))
    time(210, d => {
      expect(o).to.eql({ 0: 2 })
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' })
      expect(last(o.log).value.toJS()).to.eql({ 0: 2 })
    })

    time(300, d => set(o)({ key: 0, value: 2, type: 'delete' }))
    time(310, d => {
      expect(o).to.eql({})
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' })
      expect(last(o.log).value.toJS()).to.eql({})
    })

    time(400, d => Object.observe = observe)
    time(410, done)
  })

  it('should explicitly add entries without O.o (array)', done => {
    var observe = Object.observe
    delete Object.observe

    var o = versioned([])
    
    time(100, d => set(o)({ key: 0, value: 1, type: 'add' }))
    time(110, d => {
      expect(o).to.eql([1])
      expect(last(o.log).diff).to.eql({ key: '0', value: 1, type: 'add' })
      expect(last(o.log).value.toJS()).to.eql([1])
    })

    time(200, d => set(o)({ key: 0, value: 2, type: 'update' }))
    time(210, d => {
      expect(o).to.eql([2])
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'update' })
      expect(last(o.log).value.toJS()).to.eql([2])
    })

    time(300, d => set(o)({ key: 0, value: 2, type: 'delete' }))
    time(310, d => {
      expect(o).to.eql([])
      expect(last(o.log).diff).to.eql({ key: '0', value: 2, type: 'delete' })
      expect(last(o.log).value.toJS()).to.eql([])
    })

    time(400, d => Object.observe = observe)
    time(410, done)
  })

})