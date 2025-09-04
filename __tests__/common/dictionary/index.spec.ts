import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dictionary } from '../../../src/common/dictionary'

describe('Dictionary', () => {
  let dictionary: Dictionary<Record<string, any>, string>
  let key1: Record<string, any>
  let key2: Record<string, any>
  let key3: Record<string, any>

  beforeEach(() => {
    dictionary = new Dictionary<Record<string, any>, string>()
    key1 = { id: 1, name: 'test1' }
    key2 = { id: 2, name: 'test2' }
    key3 = { id: 3, name: 'test3' }
  })

  describe('constructor', () => {
    it('should initialize with empty map and array', () => {
      expect(dictionary.has(key1)).toBe(false)
      expect(dictionary.get(key1)).toBeUndefined()
    })
  })

  describe('clear', () => {
    it('should clear all entries', () => {
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')

      dictionary.clear()

      expect(dictionary.has(key1)).toBe(false)
      expect(dictionary.has(key2)).toBe(false)
      expect(dictionary.get(key1)).toBeUndefined()
      expect(dictionary.get(key2)).toBeUndefined()
    })
  })

  describe('has', () => {
    it('should return false for non-existing key', () => {
      expect(dictionary.has(key1)).toBe(false)
    })

    it('should return true for existing key', () => {
      dictionary.set(key1, 'value1')
      expect(dictionary.has(key1)).toBe(true)
    })
  })

  describe('get', () => {
    it('should return undefined for non-existing key', () => {
      expect(dictionary.get(key1)).toBeUndefined()
    })

    it('should return value for existing key', () => {
      dictionary.set(key1, 'value1')
      expect(dictionary.get(key1)).toBe('value1')
    })
  })

  describe('set', () => {
    it('should set key-value pair', () => {
      dictionary.set(key1, 'value1')

      expect(dictionary.has(key1)).toBe(true)
      expect(dictionary.get(key1)).toBe('value1')
    })

    it('should allow multiple key-value pairs', () => {
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')

      expect(dictionary.get(key1)).toBe('value1')
      expect(dictionary.get(key2)).toBe('value2')
    })

    it('should overwrite existing value', () => {
      dictionary.set(key1, 'value1')
      dictionary.set(key1, 'newValue')

      expect(dictionary.get(key1)).toBe('newValue')
    })
  })

  describe('delete', () => {
    it('should return undefined for non-existing key', () => {
      const result = dictionary.delete(key1)
      expect(result).toBeUndefined()
    })

    it('should delete existing key and return its value', () => {
      dictionary.set(key1, 'value1')

      const result = dictionary.delete(key1)

      expect(result).toBe('value1')
      expect(dictionary.has(key1)).toBe(false)
      expect(dictionary.get(key1)).toBeUndefined()
    })

    it('should delete key from middle of array', () => {
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')
      dictionary.set(key3, 'value3')

      dictionary.delete(key2)

      expect(dictionary.has(key2)).toBe(false)
      expect(dictionary.has(key1)).toBe(true)
      expect(dictionary.has(key3)).toBe(true)
    })

    it('should handle deleting non-existing key after setting it', () => {
      dictionary.set(key1, 'value1')
      dictionary.delete(key1)

      const result = dictionary.delete(key1)
      expect(result).toBeUndefined()
    })
  })

  describe('each', () => {
    it('should not call iterator for empty dictionary', () => {
      const iterator = vi.fn()

      dictionary.each(iterator)

      expect(iterator).not.toHaveBeenCalled()
    })

    it('should call iterator for each key-value pair', () => {
      const iterator = vi.fn()
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')

      dictionary.each(iterator)

      expect(iterator).toHaveBeenCalledTimes(2)
      expect(iterator).toHaveBeenCalledWith('value1', key1)
      expect(iterator).toHaveBeenCalledWith('value2', key2)
    })

    it('should iterate in insertion order', () => {
      const results: Array<{ key: any; value: string }> = []
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')
      dictionary.set(key3, 'value3')

      dictionary.each((value, key) => {
        results.push({ key, value })
      })

      expect(results).toEqual([
        { key: key1, value: 'value1' },
        { key: key2, value: 'value2' },
        { key: key3, value: 'value3' },
      ])
    })
  })

  describe('dispose', () => {
    it('should clear all entries', () => {
      dictionary.set(key1, 'value1')
      dictionary.set(key2, 'value2')

      dictionary.dispose()

      expect(dictionary.has(key1)).toBe(false)
      expect(dictionary.has(key2)).toBe(false)
      expect(dictionary.get(key1)).toBeUndefined()
      expect(dictionary.get(key2)).toBeUndefined()
    })
  })
})
