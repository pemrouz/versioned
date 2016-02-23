import emitterify from 'utilise/emitterify'
import last from 'utilise/last'
import time from 'utilise/time'
import { expect } from 'chai'
import { versioned, set, push, update, remove, pop } from './'

describe('versioned', function() {

  it('should set - object', () => {
    var changes = []
      , o = versioned({}).on('log', diff => changes.push(diff))

    expect(o).to.eql({})
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql({})
    expect(changes).to.eql([])

    expect(set({ key: 'focused', value: false, type: 'add' })(o)).to.eql(o)
    expect(o).to.eql({ 'focused': false })
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: 'focused', value: false, type: 'add' })
    expect(last(o.log).value.toJS()).to.eql({ focused: false })
    expect(changes).to.eql([
      { key: 'focused', value: false, type: 'add' }
    ])

    expect(set({ key: 'focused', value: true, type: 'update' })(o)).to.eql(o)
    expect(o).to.eql({ 'focused': true })
    expect(o.log.length).to.eql(3)
    expect(last(o.log).diff).to.eql({ key: 'focused', value: true, type: 'update' })
    expect(last(o.log).value.toJS()).to.eql({ focused: true })
    expect(changes).to.eql([
      { key: 'focused', value: false, type: 'add' }
    , { key: 'focused', value: true, type: 'update' }
    ])

    expect(set({ key: 'focused', value: true, type: 'remove' })(o)).to.eql(o)
    expect(o).to.eql({})
    expect(o.log.length).to.eql(4)
    expect(last(o.log).diff).to.eql({ key: 'focused', value: true, type: 'remove' })
    expect(last(o.log).value.toJS()).to.eql({})
    expect(changes).to.eql([
      { key: 'focused', value: false, type: 'add' }
    , { key: 'focused', value: true, type: 'update' }
    , { key: 'focused', value: true, type: 'remove' }
    ])
  })

  it('should set - array', () => {
    var changes = []
      , o = versioned([]).on('log', diff => changes.push(diff))

    expect(o).to.eql([])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql([])
    expect(changes).to.eql([])

    expect(set({ key: 0, value: 'foo', type: 'add' })(o)).to.eql(o)
    expect(o).to.eql(['foo'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '0', value: 'foo', type: 'add' })
    expect(last(o.log).value.toJS()).to.eql(['foo'])
    expect(changes).to.eql([
      { key: '0', value: 'foo', type: 'add' }
    ])

    expect(set({ key: 0, value: 'bar', type: 'update' })(o)).to.eql(o)
    expect(o).to.eql(['bar'])
    expect(o.log.length).to.eql(3)
    expect(last(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'update' })
    expect(last(o.log).value.toJS()).to.eql(['bar'])
    expect(changes).to.eql([
      { key: '0', value: 'foo', type: 'add' }
    , { key: '0', value: 'bar', type: 'update' }
    ])

    expect(set({ key: 0, value: o[0], type: 'remove' })(o)).to.eql(o)
    expect(o).to.eql([])
    expect(o.log.length).to.eql(4)
    expect(last(o.log).diff).to.eql({ key: '0', value: 'bar', type: 'remove' })
    expect(last(o.log).value.toJS()).to.eql([])
    expect(changes).to.eql([
      { key: '0', value: 'foo', type: 'add' }
    , { key: '0', value: 'bar', type: 'update' }
    , { key: '0', value: 'bar', type: 'remove' }
    ])

  })

  it('should push', () => {
    var changes = []
      , o = versioned([]).on('log', diff => changes.push(diff))

    expect(o).to.eql([])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql([])
    expect(changes).to.eql([])

    expect(push('foo')(o)).to.eql(o)
    expect(o).to.eql(['foo'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '0', value: 'foo', type: 'add' })
    expect(last(o.log).value.toJS()).to.eql(['foo'])
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })
  
  it('should pop', () => {
    var changes = []
      , o = versioned(['foo']).on('log', diff => changes.push(diff))

    expect(o).to.eql(['foo'])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql(['foo'])
    expect(changes).to.eql([])

    expect(pop(o)).to.eql(o)
    expect(o).to.eql([])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '0', value: 'foo', type: 'remove' })
    expect(last(o.log).value.toJS()).to.eql([])
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })
  
  it('should remove - array', () => {
    var changes = []
      , o = versioned(['foo', 'bar', 'baz']).on('log', diff => changes.push(diff))

    expect(o).to.eql(['foo', 'bar', 'baz'])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql(['foo', 'bar', 'baz'])
    expect(changes).to.eql([])

    expect(remove(1)(o)).to.eql(o)
    expect(o).to.eql(['foo', 'baz'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '1', value: 'bar', type: 'remove' })
    expect(last(o.log).value.toJS()).to.eql(['foo', 'baz'])
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })
    
  it('should remove - object', () => {
    var changes = []
      , o = versioned({ foo: 'bar' }).on('log', diff => changes.push(diff))

    expect(o).to.eql({ foo: 'bar' })
    expect(o.log.length).to.eql(1)
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql({ foo: 'bar' })
    expect(changes).to.eql([])

    expect(remove('foo')(o)).to.eql(o)
    expect(o).to.eql({})
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: 'foo', value: 'bar', type: 'remove' })
    expect(last(o.log).value.toJS()).to.eql({})
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })  

  it('should update - array', () => {
    var changes = []
      , o = versioned(['foo', 'bar', 'baz']).on('log', diff => changes.push(diff))

    expect(o).to.eql(['foo', 'bar', 'baz'])
    expect(o.log.length).to.eql(1) 
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql(['foo', 'bar', 'baz'])
    expect(changes).to.eql([])

    expect(update(1, 'lol')(o)).to.eql(o)
    expect(o).to.eql(['foo', 'lol', 'baz'])
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: '1', value: 'lol', type: 'update' })
    expect(last(o.log).value.toJS()).to.eql(['foo', 'lol', 'baz'])
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })
    
  it('should update - object', () => {
    var changes = []
      , o = versioned({ foo: 'bar' }).on('log', diff => changes.push(diff))

    expect(o).to.eql({ foo: 'bar' })
    expect(o.log.length).to.eql(1)
    expect(last(o.log).diff).to.eql(undefined)
    expect(last(o.log).value.toJS()).to.eql({ foo: 'bar' })
    expect(changes).to.eql([])

    expect(update('foo', 'baz')(o)).to.eql(o)
    expect(o).to.eql({ foo: 'baz' })
    expect(o.log.length).to.eql(2)
    expect(last(o.log).diff).to.eql({ key: 'foo', value: 'baz', type: 'update' })
    expect(last(o.log).value.toJS()).to.eql({ foo: 'baz' })
    expect(changes).to.eql(o.log.slice(1).map(d => d.diff))
  })

  it('should fail gracefully with non-objects', () => {
    expect(versioned(true)).to.be.eql(true)
    expect(versioned(false)).to.be.eql(false)
    expect(versioned(5)).to.be.eql(5)
    expect(versioned('foo')).to.be.eql('foo')

    expect(set({ key: 'foo', value: 'bar', type: 'add' })(true)).to.be.eql(true)
    expect(set({ key: 'foo', value: 'bar', type: 'add' })(false)).to.be.eql(false)
    expect(set({ key: 'foo', value: 'bar', type: 'add' })(5)).to.be.eql(5)
    expect(set({ key: 'foo', value: 'bar', type: 'add' })('foo')).to.be.eql('foo')
  })
  
  it('should skip gracefully non-arrays with push/pop', () => {
    expect(push('foo')(versioned({}))).to.be.eql({})
    expect(pop(versioned({}))).to.be.eql({})
  })

  it('should work on non-versioned data', () => {
    var changes = []
      , o = {}

    expect(set({ key: 'foo', value: 'bar', type: 'add' })(o)).to.eql({ foo: 'bar' })
    expect(o.log).to.not.be.ok
    expect(o.emit).to.not.be.ok

    emitterify(o).on('log', diff => changes.push(diff))

    expect(set({ key: 'bar', value: 'baz', type: 'add' })(o)).to.eql({ foo: 'bar', bar: 'baz' })
    expect(o.log).to.not.be.ok
    expect(o.emit).to.be.ok
    expect(changes).to.be.eql([{ key: 'bar', value: 'baz', type: 'add' }])

  })

})