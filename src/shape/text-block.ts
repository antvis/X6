import { Dom, FunctionExt, ObjectExt, SUPPORT_FOREIGNOBJECT } from '../common'
import type { Node, NodeConfig } from '../model'
import { attrPresets, type SetDefinition, type SimpleAttrs } from '../registry'
import { Base, BaseBodyAttr } from './base'

export function getTextBlockMarkup(supportForeignobject: boolean) {
  return supportForeignobject
    ? {
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
      }
    : {
        tagName: 'text',
        selector: 'label',
        attrs: {
          textAnchor: 'middle',
        },
      }
}

export const TextBlockConfig: NodeConfig = {
  shape: 'text-block',
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    getTextBlockMarkup(SUPPORT_FOREIGNOBJECT),
  ],
  attrs: {
    body: {
      ...BaseBodyAttr,
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
  propHooks(metadata) {
    const { text, ...others } = metadata
    if (text) {
      ObjectExt.setByPath(others, 'attrs/label/text', text)
    }
    return others
  },
  attrHooks: {
    text: {
      set(text: string, { cell, view, refBBox, elem, attrs }) {
        if (elem instanceof HTMLElement) {
          elem.textContent = text
        } else {
          // No foreign object
          const style = (attrs.style as SimpleAttrs) || {}
          const wrapValue = { text, width: -5, height: '100%' }
          const wrapAttrs = {
            textVerticalAnchor: 'middle',
            ...style,
          }

          const textWrap = attrPresets.textWrap as SetDefinition
          FunctionExt.call(textWrap.set, this, wrapValue, {
            cell,
            view,
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
}

export const TextBlock = Base.define(TextBlockConfig)
