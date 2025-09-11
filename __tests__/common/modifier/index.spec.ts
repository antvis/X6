import { describe, expect, it } from 'vitest'
import {
  isModifierKeyEqual,
  isModifierKeyMatch,
  parseModifierKey,
} from '../../../src/common/modifier'

describe('ModifierKey', () => {
  describe('parse', () => {
    it('should parse array input', () => {
      const result = parseModifierKey(['alt', 'ctrl'])
      expect(result).toEqual({ or: ['alt', 'ctrl'], and: [] })
    })

    it('should parse string with | separator', () => {
      const result = parseModifierKey('alt|ctrl')
      expect(result).toEqual({ or: ['alt', 'ctrl'], and: [] })
    })

    it('should parse string with & separator', () => {
      const result = parseModifierKey('alt&shift')
      expect(result).toEqual({ or: [], and: ['alt', 'shift'] })
    })

    it('should parse string with mixed | and &', () => {
      const result = parseModifierKey('alt|ctrl&shift')
      expect(result).toEqual({ or: ['alt'], and: ['ctrl', 'shift'] })
    })
  })

  describe('equals', () => {
    it('should return true for equal arrays', () => {
      expect(isModifierKeyEqual(['alt', 'ctrl'], ['ctrl', 'alt'])).toBe(true)
    })

    it('should return false for different arrays', () => {
      expect(isModifierKeyEqual(['alt'], ['ctrl'])).toBe(false)
    })

    it('should return true for equal strings', () => {
      expect(isModifierKeyEqual('alt|ctrl', 'ctrl|alt')).toBe(true)
    })

    it('should return false for different strings', () => {
      expect(isModifierKeyEqual('alt', 'ctrl')).toBe(false)
    })

    it('should handle and-conditions correctly', () => {
      expect(isModifierKeyEqual('alt&ctrl', 'ctrl&alt')).toBe(true)
      expect(isModifierKeyEqual('alt&ctrl', 'alt')).toBe(false)
    })

    it('should return true if both null', () => {
      expect(isModifierKeyEqual(null, null)).toBe(true)
    })

    it('should return false if one is null', () => {
      expect(isModifierKeyEqual(null, 'alt')).toBe(false)
    })
  })

  describe('isMatch', () => {
    const baseEvent = {
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    } as unknown as WheelEvent

    it('should return true when modifiers is null and strict=false', () => {
      expect(isModifierKeyMatch(baseEvent, null, false)).toBe(true)
    })

    it('should return true when modifiers is empty array and strict=false', () => {
      expect(isModifierKeyMatch(baseEvent, [], false)).toBe(true)
    })

    it('should return true when no modifier and strict=true', () => {
      expect(isModifierKeyMatch(baseEvent, null, true)).toBe(true)
    })

    it('should return false when extra modifier present and strict=true', () => {
      const event = { ...baseEvent, altKey: true } as WheelEvent
      expect(isModifierKeyMatch(event, null, true)).toBe(false)
    })

    it('should match OR condition', () => {
      const event = { ...baseEvent, altKey: true } as WheelEvent
      expect(isModifierKeyMatch(event, 'alt|ctrl')).toBe(true)
    })

    it('should not match OR condition if none active', () => {
      expect(isModifierKeyMatch(baseEvent, 'alt|ctrl')).toBe(false)
    })

    it('should match AND condition', () => {
      const event = { ...baseEvent, altKey: true, ctrlKey: true } as WheelEvent
      expect(isModifierKeyMatch(event, 'alt|ctrl&alt')).toBe(true)
    })

    it('should fail AND condition if one missing', () => {
      const event = { ...baseEvent, altKey: true } as WheelEvent
      expect(isModifierKeyMatch(event, 'alt&ctrl')).toBe(false)
    })

    it('should match mixed OR + AND', () => {
      const event = {
        ...baseEvent,
        altKey: true,
        metaKey: true,
        shiftKey: true,
      } as WheelEvent
      expect(isModifierKeyMatch(event, 'alt|meta&shift')).toBe(true)
    })
  })
})
