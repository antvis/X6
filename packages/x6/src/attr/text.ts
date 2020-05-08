import { ObjectExt, JSONObject, NumberExt, Dom } from '../util'
import { Attr } from './index'

export const text: Attr.Definition = {
  qualify(text, { attrs }) {
    return attrs.textWrap == null || !ObjectExt.isPlainObject(attrs.textWrap)
  },
  set(text, { view, elem, attrs }) {
    const cacheName = 'x6-text'
    const $elem = view.$(elem)
    const cache = $elem.data(cacheName)
    const textAttrs = ObjectExt.pick(
      attrs,
      'lineHeight',
      'annotations',
      'textPath',
      'x',
      'textVerticalAnchor',
      'eol',
      'displayEmpty',
      'fontSize',
    )

    textAttrs.fontSize = attrs['font-size'] || attrs['fontSize']

    const fontSize = textAttrs.fontSize as string
    const textHash = JSON.stringify([text, textAttrs])

    // Updates the text only if there was a change in the string
    // or any of its attributes.
    if (cache == null || cache !== textHash) {
      if (fontSize) {
        elem.setAttribute('font-size', fontSize)
      }

      // Text Along Path Selector
      const textPath = textAttrs.textPath
      if (textPath != null && typeof textPath === 'object') {
        const selector = textPath.selector
        if (typeof selector === 'string') {
          const pathNode = view.find(selector)[0]
          if (pathNode instanceof SVGPathElement) {
            Dom.ensureId(pathNode)
            textAttrs.textPath = {
              'xlink:href': `#${pathNode.id}`,
              ...textPath,
            }
          }
        }
      }

      Dom.text(elem as SVGElement, `${text}`, textAttrs as any)
      $elem.data(cacheName, textHash)
    }
  },
}

export const textWrap: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(val, { view, elem, attrs, refBBox }) {
    const info = val as JSONObject

    // option `width`
    const width = info.width || 0
    if (NumberExt.isPercentage(width)) {
      refBBox.width *= parseFloat(width) / 100
    } else if (width <= 0) {
      refBBox.width += width as number
    } else {
      refBBox.width = width as number
    }

    // option `height`
    const height = info.height || 0
    if (NumberExt.isPercentage(height)) {
      refBBox.height *= parseFloat(height) / 100
    } else if (height <= 0) {
      refBBox.height += height as number
    } else {
      refBBox.height = height as number
    }

    // option `text`
    let wrappedText
    let txt = info.text
    if (txt == null) {
      txt = attrs.text
    }

    if (txt != null) {
      wrappedText = Dom.breakText(
        `${txt}`,
        refBBox,
        {
          'font-weight': attrs['font-weight'] || attrs.fontWeight,
          'font-size': attrs['font-size'] || attrs.fontSize,
          'font-family': attrs['font-family'] || attrs.fontFamily,
          lineHeight: attrs.lineHeight,
        },
        {
          svgDocument: view.graph.svgElem,
          ellipsis: info.ellipsis as string,
          hyphen: info.hyphen as string,
        },
      )
    } else {
      wrappedText = ''
    }

    text.set.call(this, wrappedText, { view, elem, attrs, refBBox })
  },
}

const isTextInUse: Attr.QualifyFucntion = (val, { attrs }) => {
  return attrs.text !== undefined
}

export const lineHeight: Attr.Definition = {
  qualify: isTextInUse,
}

export const textVerticalAnchor: Attr.Definition = {
  qualify: isTextInUse,
}

export const textPath: Attr.Definition = {
  qualify: isTextInUse,
}

export const annotations: Attr.Definition = {
  qualify: isTextInUse,
}

export const eol: Attr.Definition = {
  qualify: isTextInUse,
}

export const displayEmpty: Attr.Definition = {
  qualify: isTextInUse,
}
