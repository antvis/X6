import {
  ObjectExt,
  JSONObject,
  NumberExt,
  Dom,
  FunctionExt,
  Text,
} from '@antv/x6-common'
import { Attr } from './index'

export const text: Attr.Definition = {
  qualify(text, { attrs }) {
    return attrs.textWrap == null || !ObjectExt.isPlainObject(attrs.textWrap)
  },
  set(text, { view, elem, attrs }) {
    const cacheName = 'x6-text'
    const cache = Dom.data(elem, cacheName)
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
      Dom.data(elem, cacheName, textHash)
    }
  },
}

export const textWrap: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(val, { view, elem, attrs, refBBox }) {
    const info = val as JSONObject

    // 计算实际可用空间
    const padding = 5 // 添加内边距
    // option `width`
    const width = typeof info.width === 'number' ? info.width : 0
    if (NumberExt.isPercentage(width)) {
      refBBox.width =
        (refBBox.width * parseFloat(String(width))) / 100 - padding * 2
    } else if (typeof width === 'number' && width <= 0) {
      refBBox.width = refBBox.width + width - padding * 2
    } else if (typeof width === 'number') {
      refBBox.width = width - padding * 2
    }

    // option `height`
    const height = typeof info.height === 'number' ? info.height : 0
    if (NumberExt.isPercentage(height)) {
      refBBox.height =
        (refBBox.height * parseFloat(String(height))) / 100 - padding * 2
    } else if (typeof height === 'number' && height <= 0) {
      refBBox.height = refBBox.height + height - padding * 2
    } else if (typeof height === 'number') {
      refBBox.height = height - padding * 2
    }

    // 确保最小尺寸
    refBBox.width = Math.max(refBBox.width, 20)
    refBBox.height = Math.max(refBBox.height, 20)

    // option `text`
    let wrappedText
    let txt = info.text
    if (txt == null) {
      txt = attrs.text || elem?.textContent
    }

    if (txt != null) {
      // 计算实际行高
      const fontSize = parseInt(
        String(attrs['font-size'] || attrs.fontSize || '14'),
        10,
      )
      const lineHeightMultiplier = 1 // 默认行高倍数
      const calculatedLineHeight = Math.ceil(fontSize * lineHeightMultiplier)
      wrappedText = Dom.breakText(
        String(txt),
        refBBox,
        {
          'font-weight': attrs['font-weight'] || attrs.fontWeight,
          'font-size': attrs['font-size'] || attrs.fontSize,
          'font-family': attrs['font-family'] || attrs.fontFamily,
          lineHeight: calculatedLineHeight.toString(),
        },
        {
          ellipsis:
            typeof info.ellipsis === 'string' ? info.ellipsis : undefined,
          eol: '\n',
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
