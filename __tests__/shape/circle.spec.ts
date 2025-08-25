import { describe, expect, it } from 'vitest'
import { Circle } from '../../src/shape/circle'

describe('shape/circle', () => {
  it('should get the right config', () => {
    expect(Circle.getDefaults()).toEqual({
      angle: 0,
      attrs: {
        body: {
          refCx: '50%',
          refCy: '50%',
          refR: '50%',
        },
        circle: {
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
      shape: 'circle',
      size: {
        height: 1,
        width: 1,
      },
      visible: true,
    })
    expect(Circle.getMarkup()).toEqual([
      {
        selector: 'body',
        tagName: 'circle',
      },
      {
        selector: 'label',
        tagName: 'text',
      },
    ])
  })
})
