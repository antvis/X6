import {
  Dom,
  FunctionExt,
  type JSONObject,
  NumberExt,
  ObjectExt,
  type Text,
} from '../../common'
import type { AttrDefinition, QualifyFunction } from './index'

export const text: AttrDefinition = {
  qualify(_text, { attrs }) {
    return attrs.textWrap == null || !ObjectExt.isPlainObject(attrs.textWrap)
  },
  set(text, { view, elem, attrs }) {
    const cacheName = 'x6-text'
    const cache = Dom.data(elem, cacheName)
    const json = <T>(str: unknown): T => {
      try {
        if (typeof str === 'string') {
          return JSON.parse(str)
        }
      } catch (_error) {
        // Not a valid JSON string, return as is.
      }
      return str as T
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
      const textPath = options.textPath
      if (textPath != null && typeof textPath === 'object') {
        const selector = (textPath as { selector?: string }).selector
        if (typeof selector === 'string') {
          const pathNode = view.find(selector)[0]
          if (pathNode instanceof SVGPathElement) {
            Dom.ensureId(pathNode)
            options.textPath = {
              'xlink:href': `#${pathNode.id}`,
              ...textPath,
            } as { d?: string; 'xlink:href'?: string }
          }
        }
      }

      Dom.text(elem as SVGElement, `${text}`, options)
      Dom.data(elem, cacheName, textHash)
    }
  },
}

export const textWrap: AttrDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(val, { view, elem, attrs, refBBox }) {
    const info = val as JSONObject

    // option `width`
    const width = info.width || 0
    if (NumberExt.isPercentage(width)) {
      refBBox.width *= parseFloat(width) / 100
      // @ts-expect-error
    } else if (width <= 0) {
      refBBox.width += width as number
    } else {
      refBBox.width = width as number
    }

    // option `height`
    const height = info.height || 0
    if (NumberExt.isPercentage(height)) {
      refBBox.height *= parseFloat(height) / 100
      // @ts-expect-error
    } else if (height <= 0) {
      refBBox.height += height as number
    } else {
      refBBox.height = height as number
    }

    // option `text`
    let wrappedText: string
    const txt = info.text ?? attrs.text ?? elem?.textContent

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
          ellipsis: info.ellipsis as string,
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

const isTextInUse: QualifyFunction = (_val, { attrs }) => {
  return attrs.text !== undefined
}

export const lineHeight: AttrDefinition = {
  qualify: isTextInUse,
}

export const textVerticalAnchor: AttrDefinition = {
  qualify: isTextInUse,
}

export const textPath: AttrDefinition = {
  qualify: isTextInUse,
}

export const annotations: AttrDefinition = {
  qualify: isTextInUse,
}

export const eol: AttrDefinition = {
  qualify: isTextInUse,
}

export const displayEmpty: AttrDefinition = {
  qualify: isTextInUse,
}
