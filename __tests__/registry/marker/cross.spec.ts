import { describe, expect, it } from 'vitest'
import { cross } from '../../../src/registry/marker/cross'

describe('cross marker', () => {
  it('should create a cross marker with default size', () => {
    const result = cross({})

    expect(result).toEqual({
      tagName: 'path',
      fill: 'none',
      d: 'M 0 -5 L 10 5 M 0 5 L 10 -5',
    })
  })

  it('should create a cross marker with custom size', () => {
    const result = cross({ size: 20 })

    expect(result).toEqual({
      tagName: 'path',
      fill: 'none',
      d: 'M 0 -10 L 20 10 M 0 10 L 20 -10',
    })
  })

  it('should create a cross marker with custom width and height', () => {
    const result = cross({ width: 15, height: 25 })

    expect(result).toEqual({
      tagName: 'path',
      fill: 'none',
      d: 'M 0 -12.5 L 15 12.5 M 0 12.5 L 15 -12.5',
    })
  })

  it('should create a cross marker with custom offset', () => {
    const result = cross({ size: 10, offset: 0 })

    expect(result).toEqual({
      tagName: 'path',
      fill: 'none',
      d: 'M 0 -5 L 10 5 M 0 5 L 10 -5',
    })
  })

  it('should preserve additional attributes', () => {
    const result = cross({
      size: 10,
      stroke: 'red',
      'stroke-width': 2,
    })

    expect(result).toEqual({
      tagName: 'path',
      fill: 'none',
      stroke: 'red',
      'stroke-width': 2,
      d: 'M 0 -5 L 10 5 M 0 5 L 10 -5',
    })
  })

  it('should handle size priority over width/height', () => {
    const result = cross({ size: 12, width: 8, height: 6 })

    expect(result.d).toContain('M 0 -3 L 8 3 M 0 3 L 8 -3')
  })
})
