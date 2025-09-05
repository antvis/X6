import { describe, expect, it } from 'vitest'
import { getNumber, getString } from '../../../src/registry/filter/util'

describe('util functions', () => {
  describe('getString', () => {
    it('should return the value when it is a string', () => {
      expect(getString('hello', 'default')).toBe('hello')
      expect(getString('', 'default')).toBe('')
    })

    it('should return the value when it is a number', () => {
      expect(getString(123 as any, 'default')).toBe(123)
    })

    it('should return default value when value is null', () => {
      expect(getString(null, 'default')).toBe('default')
    })

    it('should return default value when value is undefined', () => {
      expect(getString(undefined, 'default')).toBe('default')
    })

    it('should return empty string when value is empty string', () => {
      expect(getString('', 'default')).toBe('')
    })
  })

  describe('getNumber', () => {
    it('should return the value when it is a finite number', () => {
      expect(getNumber(42, 0)).toBe(42)
      expect(getNumber(-10, 0)).toBe(-10)
      expect(getNumber(3.14, 0)).toBe(3.14)
      expect(getNumber(0, 100)).toBe(0)
    })

    it('should return default value when value is null', () => {
      expect(getNumber(null, 100)).toBe(100)
    })

    it('should return default value when value is undefined', () => {
      expect(getNumber(undefined, 100)).toBe(100)
    })

    it('should return default value when value is NaN', () => {
      expect(getNumber(NaN, 100)).toBe(100)
    })

    it('should return default value when value is Infinity', () => {
      expect(getNumber(Infinity, 100)).toBe(100)
      expect(getNumber(-Infinity, 100)).toBe(100)
    })

    it('should return default value when value is not a number', () => {
      expect(getNumber('not a number' as any, 100)).toBe(100)
      expect(getNumber({} as any, 100)).toBe(100)
      expect(getNumber([] as any, 100)).toBe(100)
    })

    it('should return default value for string numbers', () => {
      expect(getNumber('42' as any, 0)).toBe(0)
    })
  })
})
