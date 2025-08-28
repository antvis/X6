import { describe, expect, it, vi } from 'vitest'
import { Store } from '../../src/model/store'

describe('Store', () => {
  it('should create a store with default data', () => {
    const store = new Store()
    expect(store.get()).toEqual({})
  })

  it('should create a store with initial data', () => {
    const initialData = { name: 'test', value: 123 }
    const store = new Store(initialData)
    expect(store.get()).toEqual(initialData)
  })

  it('should set a value in the store', () => {
    const store = new Store()
    store.set('name', 'test')
    expect(store.get('name')).toBe('test')
  })

  it('should set multiple values in the store', () => {
    const store = new Store()
    store.set({ name: 'test', value: 123 })
    expect(store.get('name')).toBe('test')
    expect(store.get('value')).toBe(123)
  })

  it('should get a value with a default value', () => {
    const store = new Store()
    expect(store.get('name', 'default')).toBe('default')
    store.set('name', 'test')
    expect(store.get('name', 'default')).toBe('test')
  })

  it('should remove a value from the store', () => {
    const store = new Store({ name: 'test' })
    store.remove('name')
    expect(store.get('name')).toBeUndefined()
  })

  it('should remove multiple values from the store', () => {
    const store = new Store({ name: 'test', value: 123 })
    store.remove(['name', 'value'])
    expect(store.get('name')).toBeUndefined()
    expect(store.get('value')).toBeUndefined()
  })

  it('should remove all values from the store', () => {
    const store = new Store({ name: 'test', value: 123 })
    store.remove()
    expect(store.get('name')).toBeUndefined()
    expect(store.get('value')).toBeUndefined()
  })

  it('should get the previous value', () => {
    const store = new Store({ name: 'initial' })
    store.set('name', 'updated')
    expect(store.getPrevious('name')).toBe('initial')
  })

  it('should return undefined if there is no previous value', () => {
    const store = new Store({ name: 'initial' })
    expect(store.getPrevious('name')).toBeUndefined()
  })

  it('should check if a value has changed', () => {
    const store = new Store({ name: 'initial' })
    expect(store.hasChanged('name')).toBe(false)
    store.set('name', 'updated')
    expect(store.hasChanged('name')).toBe(true)
  })

  it('should check if any value has changed', () => {
    const store = new Store({ name: 'initial' })
    expect(store.hasChanged()).toBe(false)
    store.set('name', 'updated')
    expect(store.hasChanged()).toBe(true)
  })

  it('should get the changes', () => {
    const store = new Store({ name: 'initial', value: 1 })
    store.set('name', 'updated')
    const changes = store.getChanges()
    expect(changes).toEqual({ name: 'updated' })
  })

  it('should get the changes with a diff', () => {
    const store = new Store({ name: 'initial', value: 1 })
    const diff = { name: 'updated', value: 1 }
    const changes = store.getChanges(diff)
    expect(changes).toEqual({ name: 'updated' })
  })

  it('should return null if there are no changes', () => {
    const store = new Store({ name: 'initial' })
    const changes = store.getChanges()
    expect(changes).toBeNull()
  })

  it('should convert the store to JSON', () => {
    const store = new Store({ name: 'test', value: 123 })
    expect(store.toJSON()).toEqual({ name: 'test', value: 123 })
  })

  it('should clone the store', () => {
    const store = new Store({ name: 'test', value: 123 })
    const clone = store.clone()
    expect(clone).toEqual(store)
    expect(clone).not.toBe(store)
  })

  it('should dispose the store', () => {
    const store = new Store({ name: 'test' })
    const offSpy = vi.spyOn(store, 'off')
    const triggerSpy = vi.spyOn(store, 'trigger')

    store.dispose()

    expect(offSpy).toHaveBeenCalled()
    expect(store.get()).toEqual({})
    expect(store.getPrevious('name')).toBeUndefined()
    expect(store.hasChanged()).toBe(false)
    expect(triggerSpy).toHaveBeenCalledWith('disposed', { store })
  })

  it('should trigger change event when a value is set', () => {
    const store = new Store<{ name: string; value: number }>({
      name: 'initial',
      value: 1,
    })
    const onChange = vi.fn()
    store.on('change:*', onChange)
    store.set('name', 'updated')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'name',
        current: 'updated',
        previous: 'initial',
        store: store,
      }),
    )
  })

  it('should trigger changed event after all changes are applied', () => {
    const store = new Store<{ name: string; value: number }>({
      name: 'initial',
      value: 1,
    })
    const onChanged = vi.fn()
    store.on('changed', onChanged)
    store.set({ name: 'updated', value: 2 })
    expect(onChanged).toHaveBeenCalledTimes(1)
    expect(onChanged).toHaveBeenCalledWith(
      expect.objectContaining({
        current: { name: 'updated', value: 2 },
        previous: { name: 'initial', value: 1 },
        store: store,
      }),
    )
  })

  describe('getByPath', () => {
    it('should get a value by path', () => {
      const store = new Store({ a: { b: { c: 'test' } } })
      expect(store.getByPath('a/b/c')).toBe('test')
      expect(store.getByPath(['a', 'b', 'c'])).toBe('test')
    })
  })

  describe('setByPath', () => {
    it('should set a value by path', () => {
      const store = new Store<{ a: any }>({ a: { b: { c: 'test' } } })
      store.setByPath('a/b/c', 'updated')
      expect(store.getByPath('a/b/c')).toBe('updated')
      store.setByPath(['a', 'b', 'c'], 'updated2')
      expect(store.getByPath('a/b/c')).toBe('updated2')
    })

    it('should create nested objects if they do not exist', () => {
      const store = new Store<{ a: any }>()
      store.setByPath('a/b/c', 'test')
      expect(store.getByPath('a/b/c')).toBe('test')
    })

    it('should handle array indices in the path', () => {
      const store = new Store<{ a: any }>({ a: [] })
      store.setByPath('a/0/b', 'test')
      expect(store.getByPath('a/0/b')).toBe('test')
    })

    it('should rewrite the value if rewrite option is true', () => {
      const store = new Store<{ a: any }>({ a: { b: { c: 'test', d: 'old' } } })
      store.setByPath('a/b', { e: 'new' }, { rewrite: true })
      expect(store.getByPath('a/b/e')).toBe('new')
      expect(store.getByPath('a/b/c')).toBeUndefined()
      expect(store.getByPath('a/b/d')).toBeUndefined()
    })
  })

  describe('removeByPath', () => {
    it('should remove a value by path', () => {
      const store = new Store({ a: { b: { c: 'test' } } })
      store.removeByPath('a/b/c')
      expect(store.getByPath('a/b/c')).toBeUndefined()
      const store2 = new Store({ a: { b: { c: 'test' } } })
      store2.removeByPath(['a', 'b', 'c'])
      expect(store2.getByPath('a/b/c')).toBeUndefined()
    })

    it('should remove a top-level value', () => {
      const store = new Store({ a: 'test' })
      store.removeByPath('a')
      expect(store.get('a')).toBeUndefined()
    })
  })
})
