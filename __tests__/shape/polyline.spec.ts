import { describe, expect, it } from 'vitest'
import { Polyline } from '../../src/shape/polyline'

describe('shape/polyline', () => {
  it('should have correct markup structure', () => {
    expect(Polyline.getMarkup()).toEqual([
      {
        tagName: 'polyline',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(Polyline.getDefaults()).toEqual({
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
        polyline: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
        },
      },
      visible: true,
      shape: 'polyline',
    })
  })
})
