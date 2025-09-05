import { describe, expect, it } from 'vitest'
import { toResult } from '../../../src/registry/port-label-layout/util'

describe('Port Label Layout Util', () => {
  describe('toResult function', () => {
    it('should return default values when no arguments provided', () => {
      const result = toResult({})

      expect(result).toEqual({
        position: { x: 0, y: 0 },
        angle: 0,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'start',
          },
        },
      })
    })

    it('should merge preset with defaults', () => {
      const preset = {
        position: { x: 10, y: 20 },
        angle: 90,
        attrs: {
          '.': {
            'text-anchor': 'middle',
          },
        },
      }

      const result = toResult(preset)

      expect(result).toEqual({
        position: { x: 10, y: 20 },
        angle: 90,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'middle',
          },
        },
      })
    })

    it('should override preset with args', () => {
      const preset = {
        position: { x: 10, y: 20 },
        angle: 90,
      }

      const args = {
        x: 30,
        y: 40,
        angle: 180,
      }

      const result = toResult(preset, args)

      expect(result).toEqual({
        position: { x: 30, y: 40 },
        angle: 180,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'start',
          },
        },
      })
    })

    it('should handle deep merging of attrs object', () => {
      const preset = {
        attrs: {
          '.': {
            'text-anchor': 'end',
            'font-size': '12px',
          },
          text: {
            fill: 'red',
          },
        },
      }

      const result = toResult(preset)

      expect(result).toEqual({
        position: { x: 0, y: 0 },
        angle: 0,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'end',
            'font-size': '12px',
          },
          text: {
            fill: 'red',
          },
        },
      })
    })

    it('should handle empty args object', () => {
      const preset = {
        position: { x: 10, y: 20 },
      }

      const result = toResult(preset, {})

      expect(result).toEqual({
        position: { x: 10, y: 20 },
        angle: 0,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'start',
          },
        },
      })
    })

    it('should handle null args', () => {
      const preset = {
        position: { x: 10, y: 20 },
      }

      const result = toResult(preset, null as any)

      expect(result).toEqual({
        position: { x: 10, y: 20 },
        angle: 0,
        attrs: {
          '.': {
            y: '0',
            'text-anchor': 'start',
          },
        },
      })
    })
  })
})
