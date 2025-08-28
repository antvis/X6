import { View } from '@antv/g2/lib/composition/view'
import sinon from 'sinon'
import { describe, expect, it, vi } from 'vitest'
import { Dom } from '../../src/common'
import { Rectangle } from '../../src/geometry'
import {
  getTextBlockMarkup,
  TextBlock,
  TextBlockConfig,
} from '../../src/shape/text-block'

describe('shape/text-block', () => {
  it('getTextBlockMarkup should process foreignObject', () => {
    expect(getTextBlockMarkup(true)).toEqual({
      tagName: 'foreignObject',
      selector: 'foreignObject',
      children: [
        {
          tagName: 'div',
          ns: Dom.ns.xhtml,
          selector: 'label',
          style: {
            width: '100%',
            height: '100%',
            position: 'static',
            backgroundColor: 'transparent',
            textAlign: 'center',
            margin: 0,
            padding: '0px 5px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
      ],
    })

    expect(getTextBlockMarkup(false)).toEqual({
      tagName: 'text',
      selector: 'label',
      attrs: {
        textAnchor: 'middle',
      },
    })
  })

  it('text-block default config', () => {
    expect(TextBlockConfig.shape).toEqual('text-block')

    // @ts-expect-error
    expect(TextBlockConfig.propHooks({ text: 'x6', value: 'antv' })).toEqual({
      attrs: {
        label: {
          text: 'x6',
        },
      },
      value: 'antv',
    })

    const refBBox = new Rectangle(10, 10, 100, 100)
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    expect(
      // @ts-expect-error
      TextBlockConfig.attrHooks.text.position('x6', { refBBox, elem }),
    ).toEqual({
      x: 60,
      y: 60,
    })
  })

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
