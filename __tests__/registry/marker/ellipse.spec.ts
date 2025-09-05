import { describe, expect, it } from 'vitest'
import type { EllipseMarkerOptions } from '../../../src/registry/marker/ellipse'
import { ellipse } from '../../../src/registry/marker/ellipse'

describe('ellipse marker', () => {
  it('should create ellipse with default radius when no options provided', () => {
    const result = ellipse({})

    expect(result).toEqual({
      cx: 5,
      tagName: 'ellipse',
      rx: 5,
      ry: 5,
    })
  })

  it('should create ellipse with custom radius values', () => {
    const options: EllipseMarkerOptions = {
      rx: 10,
      ry: 8,
    }

    const result = ellipse(options)

    expect(result).toEqual({
      cx: 10,
      rx: 10,
      ry: 8,
      tagName: 'ellipse',
    })
  })

  it('should create ellipse with only rx provided', () => {
    const options: EllipseMarkerOptions = {
      rx: 15,
    }

    const result = ellipse(options)

    expect(result).toEqual({
      cx: 15,
      rx: 15,
      ry: 5,
      tagName: 'ellipse',
    })
  })

  it('should create ellipse with only ry provided', () => {
    const options: EllipseMarkerOptions = {
      ry: 12,
    }

    const result = ellipse(options)

    expect(result).toEqual({
      cx: 5,
      rx: 5,
      ry: 12,
      tagName: 'ellipse',
    })
  })

  it('should preserve additional attributes', () => {
    const options: EllipseMarkerOptions = {
      rx: 10,
      ry: 10,
      fill: 'red',
      stroke: 'black',
      'stroke-width': 2,
    }

    const result = ellipse(options)

    expect(result).toEqual({
      cx: 10,
      rx: 10,
      ry: 10,
      tagName: 'ellipse',
      fill: 'red',
      stroke: 'black',
      'stroke-width': 2,
    })
  })

  it('should handle zero radius values', () => {
    const options: EllipseMarkerOptions = {
      rx: 0,
      ry: 0,
    }

    const result = ellipse(options)

    expect(result).toEqual({
      cx: 5,
      rx: 5,
      ry: 5,
      tagName: 'ellipse',
    })
  })
})
