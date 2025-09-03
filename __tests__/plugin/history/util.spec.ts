import { describe, expect, it } from 'vitest'
import {
  getOptions,
  isAddEvent,
  isChangeEvent,
  isRemoveEvent,
  sortBatchCommands,
} from '../../../src/plugin/history/util'

describe('History Util', () => {
  describe('isAddEvent', () => {
    it('should return true for cell:added event', () => {
      expect(isAddEvent('cell:added')).toBe(true)
    })

    it('should return false for other events', () => {
      expect(isAddEvent('cell:removed')).toBe(false)
      expect(isAddEvent('cell:change:position')).toBe(false)
      // @ts-expect-error
      expect(isAddEvent('other:event')).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isAddEvent(undefined)).toBe(false)
    })
  })

  describe('isRemoveEvent', () => {
    it('should return true for cell:removed event', () => {
      expect(isRemoveEvent('cell:removed')).toBe(true)
    })

    it('should return false for other events', () => {
      expect(isRemoveEvent('cell:added')).toBe(false)
      expect(isRemoveEvent('cell:change:position')).toBe(false)
      // @ts-expect-error
      expect(isRemoveEvent('other:event')).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isRemoveEvent(undefined)).toBe(false)
    })
  })

  describe('isChangeEvent', () => {
    it('should return true for events starting with cell:change:', () => {
      expect(isChangeEvent('cell:change:position')).toBe(true)
      expect(isChangeEvent('cell:change:size')).toBe(true)
      expect(isChangeEvent('cell:change:attrs')).toBe(true)
    })

    it('should return false for other events', () => {
      expect(isChangeEvent('cell:added')).toBe(false)
      expect(isChangeEvent('cell:removed')).toBe(false)
      // @ts-expect-error
      expect(isChangeEvent('other:event')).toBe(false)
    })

    it('should return false for null or undefined', () => {
      // @ts-expect-error
      expect(isChangeEvent(null)).toBe(false)
      expect(isChangeEvent(undefined)).toBe(false)
    })
  })

  describe('getOptions', () => {
    it('should return default options when no eventNames provided', () => {
      const options = {}
      const result = getOptions(options)

      expect(result).toEqual({
        enabled: true,
        eventNames: ['cell:added', 'cell:removed', 'cell:change:*'],
        applyOptionsList: ['propertyPath'],
        revertOptionsList: ['propertyPath'],
      })
    })

    it('should filter out reserved and batch events from eventNames', () => {
      const options = {
        eventNames: [
          'cell:added',
          'cell:removed',
          'cell:change:position',
          'cell:change:*',
          'batch:start',
          'batch:stop',
          'custom:event',
        ],
      }
      // @ts-expect-error
      const result = getOptions(options)

      expect(result.eventNames).toEqual(['custom:event'])
    })

    it('should preserve custom applyOptionsList and revertOptionsList', () => {
      const options = {
        applyOptionsList: ['custom1'],
        revertOptionsList: ['custom2'],
      }
      const result = getOptions(options)

      expect(result.applyOptionsList).toEqual(['custom1'])
      expect(result.revertOptionsList).toEqual(['custom2'])
    })

    it('should merge all provided options', () => {
      const options = {
        enabled: false,
        eventNames: ['custom:event'],
        applyOptionsList: ['custom1'],
        revertOptionsList: ['custom2'],
        customProp: 'value',
      }
      // @ts-expect-error
      const result = getOptions(options)

      expect(result).toEqual({
        enabled: false,
        eventNames: ['custom:event'],
        applyOptionsList: ['custom1'],
        revertOptionsList: ['custom2'],
        customProp: 'value',
      })
    })
  })

  describe('sortBatchCommands', () => {
    it('should return empty array for empty input', () => {
      const result = sortBatchCommands([])
      expect(result).toEqual([])
    })

    it('should maintain order for commands without add events', () => {
      const cmds = [
        { event: 'cell:removed', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '2' } },
      ]
      // @ts-expect-error
      const result = sortBatchCommands(cmds)
      expect(result).toEqual(cmds)
    })

    it('should move add events after their corresponding previous commands', () => {
      const cmds = [
        { event: 'cell:removed', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '2' } },
        { event: 'cell:added', data: { id: '1' } },
      ]
      // @ts-expect-error
      const result = sortBatchCommands(cmds)

      expect(result).toEqual([
        { event: 'cell:added', data: { id: '1' } },
        { event: 'cell:removed', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '2' } },
      ])
    })

    it('should handle multiple add events for the same id', () => {
      const cmds = [
        { event: 'cell:removed', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '1' } },
        { event: 'cell:added', data: { id: '1' } },
        { event: 'cell:added', data: { id: '1' } },
      ]
      // @ts-expect-error
      const result = sortBatchCommands(cmds)

      expect(result).toEqual([
        { event: 'cell:added', data: { id: '1' } },
        { event: 'cell:added', data: { id: '1' } },
        { event: 'cell:removed', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '1' } },
      ])
    })

    it('should handle add events without corresponding previous commands', () => {
      const cmds = [
        { event: 'cell:added', data: { id: '1' } },
        { event: 'cell:change:position', data: { id: '2' } },
      ]
      // @ts-expect-error
      const result = sortBatchCommands(cmds)
      expect(result).toEqual(cmds)
    })
  })
})
