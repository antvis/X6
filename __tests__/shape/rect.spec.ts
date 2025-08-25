import { describe, expect, it } from 'vitest'
import { Rect } from '../../src/shape/rect'

describe('shape/rect', () => {
  it('should have correct markup structure', () => {
    expect(Rect.getMarkup()).toEqual([
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(Rect.getDefaults()).toEqual({
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
        rect: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
        },
        body: {
          refWidth: '100%',
          refHeight: '100%',
        },
      },
      visible: true,
      shape: 'rect',
    })
  })
})
