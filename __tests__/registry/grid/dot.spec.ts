import { describe, expect, it } from 'vitest'
import { createSvgElement } from '../../../src/common/dom/elem'
import { dot } from '../../../src/registry/grid/dot'

describe('dot grid', () => {
  it('should have default properties', () => {
    expect(dot.color).toBe('#aaaaaa')
    expect(dot.thickness).toBe(1)
    expect(dot.markup).toBe('rect')
  })

  it('should update element with default options', () => {
    const elem = createSvgElement('rect')
    const options = {
      color: '#aaaaaa',
      thickness: 1,
      sx: 10,
      sy: 10,
    }

    dot.update!(elem, options)

    expect(elem.getAttribute('width')).toBe('10')
    expect(elem.getAttribute('height')).toBe('10')
    expect(elem.getAttribute('rx')).toBe('10')
    expect(elem.getAttribute('ry')).toBe('10')
    expect(elem.getAttribute('fill')).toBe('#aaaaaa')
  })

  it('should update element with custom options', () => {
    const elem = createSvgElement('rect')
    const options = {
      color: '#ff0000',
      thickness: 2,
      sx: 5,
      sy: 5,
    }

    dot.update!(elem, options)

    expect(elem.getAttribute('width')).toBe('10')
    expect(elem.getAttribute('height')).toBe('10')
    expect(elem.getAttribute('rx')).toBe('10')
    expect(elem.getAttribute('ry')).toBe('10')
    expect(elem.getAttribute('fill')).toBe('#ff0000')
  })

  it('should handle different scale factors', () => {
    const elem = createSvgElement('rect')
    const options = {
      color: '#aaaaaa',
      thickness: 3,
      sx: 2,
      sy: 4,
    }

    dot.update!(elem, options)

    expect(elem.getAttribute('width')).toBe('6')
    expect(elem.getAttribute('height')).toBe('12')
    expect(elem.getAttribute('rx')).toBe('6')
    expect(elem.getAttribute('ry')).toBe('12')
  })
})
