import { describe, expect, it } from 'vitest'
import { Ellipse } from '../../src/shape/ellipse'

describe('shape/ellipse', () => {
  it('should have correct markup structure', () => {
    expect(Ellipse.getMarkup()).toEqual([
      {
        selector: 'body',
        tagName: 'ellipse',
      },
      {
        selector: 'label',
        tagName: 'text',
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(Ellipse.getDefaults()).toEqual({
      angle: 0,
      attrs: {
        body: {
          refCx: '50%',
          refCy: '50%',
          refRx: '50%',
          refRy: '50%',
        },
        ellipse: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
        },
        text: {
          fill: '#000000',
          fontFamily: 'Arial, helvetica, sans-serif',
          fontSize: 14,
          refX: 0.5,
          refY: 0.5,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
        },
      },
      position: {
        x: 0,
        y: 0,
      },
      shape: 'ellipse',
      size: {
        height: 1,
        width: 1,
      },
      visible: true,
    })
  })
})
