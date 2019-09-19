import { generate } from 'simulate-event'
import {
  EN_US,
  KeyboardLayout,
  getKeyboardLayout,
  setKeyboardLayout,
} from './keyboard'

describe('Keyboard', () => {

  describe('getKeyboardLayout()', () => {
    it('should return the global keyboard layout', () => {
      expect(getKeyboardLayout()).toBe(EN_US)
    })
  })

  describe('setKeyboardLayout()', () => {
    it('should set the global keyboard layout', () => {
      const layout = new KeyboardLayout('ab-cd', {})
      setKeyboardLayout(layout)
      expect(getKeyboardLayout()).toBe(layout)
      setKeyboardLayout(EN_US)
      expect(getKeyboardLayout()).toBe(EN_US)
    })
  })

  describe('KeyboardLayout', () => {

    describe('#constructor()', () => {
      it('should construct a new keycode layout', () => {
        const layout = new KeyboardLayout('ab-cd', {})
        expect(layout).toBeInstanceOf(KeyboardLayout)
      })
    })

    describe('#name', () => {
      it('should be a human readable name of the layout', () => {
        const layout = new KeyboardLayout('ab-cd', {})
        expect(layout.name).toBe('ab-cd')
      })
    })

    describe('#keys()', () => {
      it('should get an array of all key values supported by the layout', () => {
        const layout = new KeyboardLayout('ab-cd', { 100: 'F' })
        const keys = layout.keys()
        expect(keys.length).toBe(1)
        expect(keys[0]).toBe('F')
      })
    })

    describe('#isValidKey()', () => {
      it('should test whether the key is valid for the layout', () => {
        const layout = new KeyboardLayout('foo', { 100: 'F' })
        expect(layout.isValidKey('F')).toBe(true)
        expect(layout.isValidKey('A')).toBe(false)
      })
    })

    describe('#keyForKeydownEvent()', () => {
      it('should get the key for a `keydown` event', () => {
        const layout = new KeyboardLayout('foo', { 100: 'F' })
        const event = generate('keydown', { keyCode: 100 })
        const key = layout.keyForKeydownEvent(event as KeyboardEvent)
        expect(key).toBe('F')
      })

      it('should return an empty string if the code is not valid', () => {
        const layout = new KeyboardLayout('foo', { 100: 'F' })
        const event = generate('keydown', { keyCode: 101 })
        const key = layout.keyForKeydownEvent(event as KeyboardEvent)
        expect(key).toBe('')
      })
    })

    describe('.extractKeys()', () => {
      it('should extract the keys from a code map', () => {
        const keys: KeyboardLayout.CodeMap = { 70: 'F', 71: 'G', 72: 'H' }
        const goal: KeyboardLayout.KeySet = { F: true, G: true, H: true }
        expect(KeyboardLayout.extractKeys(keys)).toEqual(goal)
      })
    })
  })

  describe('EN_US', () => {
    it('should be a keycode layout', () => {
      expect(EN_US).toBeInstanceOf(KeyboardLayout)
    })

    it('should have standardized keys', () => {
      expect(EN_US.isValidKey('A')).toBe(true)
      expect(EN_US.isValidKey('Z')).toBe(true)
      expect(EN_US.isValidKey('0')).toBe(true)
      expect(EN_US.isValidKey('a')).toBe(false)
    })
  })
})
