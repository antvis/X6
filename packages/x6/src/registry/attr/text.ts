import {
  ObjectExt,
  JSONObject,
  NumberExt,
  Dom,
  FunctionExt,
  Text,
} from '../../util'
import { Attr } from './index'

export const text: Attr.Definition = {
  qualify(text, { attrs }) {
    return attrs.textWrap == null || !ObjectExt.isPlainObject(attrs.textWrap)
  },
  set(text, { view, elem, attrs }) {
    const cacheName = 'x6-text'
    const $elem = view.$(elem)
    const cache = $elem.data(cacheName)
    const json = <T>(str: any) => {
      try {
        return JSON.parse(str) as T
      } catch (error) {
        return str
      }
    }
    const options: Dom.TextOptions = {
      x: attrs.x as string | number,
      eol: attrs.eol as string,
      annotations: json(attrs.annotations) as
        | Text.Annotation
        | Text.Annotation[],
      textPath: json(attrs['text-path'] || attrs.textPath),
      textVerticalAnchor: (attrs['text-vertical-anchor'] ||
        attrs.textVerticalAnchor) as 'middle' | 'bottom' | 'top' | number,
      displayEmpty: (attrs['display-empty'] || attrs.displayEmpty) === 'true',
      lineHeight: (attrs['line-height'] || attrs.lineHeight) as string,
    }

    const fontSize = (attrs['font-size'] || attrs.fontSize) as string
    const textHash = JSON.stringify([text, options])

    if (fontSize) {
      elem.setAttribute('font-size', fontSize)
    }

    // Updates the text only if there was a change in the string
    // or any of its attributes.
    if (cache == null || cache !== textHash) {
      // Text Along Path Selector
      const textPath = options.textPath as any
      if (textPath != null && typeof textPath === 'object') {
        const selector = textPath.selector
        if (typeof selector === 'string') {
          const pathNode = view.find(selector)[0]
          if (pathNode instanceof SVGPathElement) {
            Dom.ensureId(pathNode)
            options.textPath = {
              'xlink:href': `#${pathNode.id}`,
              ...textPath,
            }
          }
        }
      }

      Dom.text(elem as SVGElement, `${text}`, options)
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
          svgDocument: view.graph.view.svg,
          ellipsis: info.ellipsis as string,
          hyphen: info.hyphen as string,
          breakWord: info.breakWord as boolean,
        },
      )
    } else {
      wrappedText = ''
    }

    FunctionExt.call(text.set, this, wrappedText, {
      view,
      elem,
      attrs,
      refBBox,
      cell: view.cell,
    })
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
