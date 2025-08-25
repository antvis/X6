import { describe, expect, it } from 'vitest'
import { Path } from '../../src/shape/path'

describe('shape/path', () => {
  it('should have correct markup structure', () => {
    expect(Path.getMarkup()).toEqual([
      {
        tagName: 'rect',
        selector: 'bg',
      },
      {
        tagName: 'path',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(Path.getDefaults()).toEqual({
      angle: 0,
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 1,
        height: 1,
      },
      attrs: {
        text: {
          fontSize: 14,
          fill: '#000000',
          refX: 0.5,
          refY: 0.5,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          fontFamily: 'Arial, helvetica, sans-serif',
        },
        bg: {
          refWidth: '100%',
          refHeight: '100%',
          fill: 'none',
          stroke: 'none',
          pointerEvents: 'all',
        },
        body: {
          fill: 'none',
          stroke: '#000',
          strokeWidth: 2,
        },
      },
      visible: true,
      shape: 'path',
    })
  })
})
