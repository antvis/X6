import { describe, expect, it } from 'vitest'
import { Path } from '../../../src/geometry'
import { circle, circlePlus } from '../../../src/registry/marker/circle'

describe('circle marker', () => {
  it('should create a circle marker with default radius', () => {
    const result = circle({})

    expect(result).toEqual({
      cx: 5,
      tagName: 'circle',
      r: 5,
    })
  })

  it('should create a circle marker with custom radius', () => {
    const result = circle({ r: 10 })

    expect(result).toEqual({
      cx: 10,
      tagName: 'circle',
      r: 10,
    })
  })

  it('should preserve additional attributes', () => {
    const result = circle({ r: 8, fill: 'red', stroke: 'blue' })

    expect(result).toEqual({
      cx: 8,
      fill: 'red',
      stroke: 'blue',
      tagName: 'circle',
      r: 8,
    })
  })
})

describe('circlePlus marker', () => {
  it('should preserve additional attributes in circlePlus', () => {
    const result = circlePlus({ r: 6, stroke: 'green', 'stroke-width': 2 })

    expect(result.children[1].stroke).toBe('green')
    expect(result.children[1]['stroke-width']).toBe(2)
    expect(result.children[1].tagName).toBe('path')
  })
})
