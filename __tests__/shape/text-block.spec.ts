import { describe, expect, it } from 'vitest'
import { TextBlock } from '../../src/shape/text-block'

describe('shape/text-block', () => {
  it('should have correct markup structure', () => {
    expect(TextBlock.getMarkup()).toEqual([
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
        attrs: {
          textAnchor: 'middle',
        },
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(TextBlock.getDefaults()).toEqual({
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
        body: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
          refWidth: '100%',
          refHeight: '100%',
        },
        foreignObject: {
          refWidth: '100%',
          refHeight: '100%',
        },
        label: {
          style: {
            fontSize: 14,
          },
        },
      },
      visible: true,
      shape: 'text-block',
    })
  })
})
