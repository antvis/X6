import { Platform } from '../../util'
import { Attr } from '../../definition'
import { Node } from '../../model'
import { bodyAttr } from './util'
import { Base } from '../base'

export const TextBlock = Base.define({
  name: 'text-block',
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    Platform.SUPPORT_FOREIGNOBJECT
      ? {
          tagName: 'foreignObject',
          selector: 'foreignObject',
          attrs: {
            overflow: 'hidden',
          },
          children: [
            {
              tagName: 'div',
              ns: 'http://www.w3.org/1999/xhtml',
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
        }
      : {
          tagName: 'text',
          selector: 'label',
          attrs: {
            textAnchor: 'middle',
          },
        },
  ],
  attrs: {
    body: {
      ...bodyAttr,
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
  attrHooks: {
    text: {
      set(text: string, { refBBox, elem, attrs }) {
        if (elem instanceof HTMLElement) {
          elem.textContent = text
        } else {
          // No foreign object
          const style = (attrs.style as Attr.SimpleAttrs) || {}
          const wrapValue = { text, width: -5, height: '100%' }
          const wrapAttrs = Object.assign(
            { textVerticalAnchor: 'middle' },
            style,
          )

          const textWrap = Attr.presets.textWrap as Attr.SetDefinition
          textWrap.set.call(this, wrapValue, {
            elem,
            refBBox,
            attrs: wrapAttrs,
          })

          return { fill: (style.color as string) || null }
        }
      },
      position(text, { refBBox, elem }) {
        if (elem instanceof SVGElement) {
          return refBBox.getCenter()
        }
      },
    },
  },
})

Node.registry.register('text-block', TextBlock)
