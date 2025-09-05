import { describe, expect, it } from 'vitest'
import { path } from '../../../src/registry/marker/path'

describe('path marker', () => {
  it('should create a path marker with basic attributes', () => {
    const result = path({
      d: 'M10 10 L20 20',
      fill: 'red',
      stroke: 'black',
    })

    expect(result).toEqual({
      tagName: 'path',
      d: 'M -5 -5 L 5 5',
      fill: 'red',
      stroke: 'black',
    })
  })

  it('should handle offsetX and offsetY parameters', () => {
    const result = path({
      d: 'M10 10 L20 20',
      offsetX: 5,
      offsetY: 10,
    })

    expect(result).toEqual({
      tagName: 'path',
      d: 'M -10 -15 L 0 -5',
    })
  })

  it('should preserve other attributes when offsets are provided', () => {
    const result = path({
      d: 'M10 10',
      offsetX: 5,
      offsetY: 5,
      fill: 'blue',
      'stroke-width': 2,
    })

    expect(result).toEqual({
      tagName: 'path',
      d: 'M -5 -5',
      fill: 'blue',
      'stroke-width': 2,
    })
  })

  it('should handle complex path commands with offsets', () => {
    const result = path({
      d: 'M10 10 C20 20 30 30 40 40 S60 60 70 70',
      offsetX: 10,
      offsetY: 10,
    })

    expect(result).toEqual({
      tagName: 'path',
      d: 'M -40 -40 C -30 -30 -20 -20 -10 -10 C 0 0 10 10 20 20',
    })
  })

  it('should handle path without offsets', () => {
    const result = path({
      d: 'M100 100 H150 V150 Z',
    })

    expect(result).toEqual({
      tagName: 'path',
      d: 'M -25 -25 L 25 -25 L 25 25 Z',
    })
  })
})
