/* eslint-disable no-control-regex */

import { Size } from '../types'
import { StringExt } from '../string'
import { Text } from '../text'
import { attr } from './attr'
import { Vector } from '../vector'
import { createSvgElement, empty } from './elem'

function createTextPathNode(
  attrs: { d?: string; 'xlink:href'?: string },
  elem: SVGElement,
) {
  const vel = Vector.create(elem)
  const textPath = Vector.create('textPath')
  const d = attrs.d
  if (d && attrs['xlink:href'] === undefined) {
    const path = Vector.create('path').attr('d', d).appendTo(vel.defs())
    textPath.attr('xlink:href', `#${path.id}`)
  }

  if (typeof attrs === 'object') {
    textPath.attr(attrs as any)
  }

  return textPath.node
}

function annotateTextLine(
  lineNode: SVGTSpanElement,
  lineAnnotations: (string | Text.AnnotatedItem)[],
  options: {
    includeAnnotationIndices?: boolean
    eol?: boolean | string
    lineHeight: string | null
    baseSize: number
  },
) {
  const eol = options.eol
  const baseSize = options.baseSize
  const lineHeight = options.lineHeight

  let maxFontSize = 0
  let tspanNode
  const fontMetrics: any = {}
  const lastJ = lineAnnotations.length - 1

  for (let j = 0; j <= lastJ; j += 1) {
    let annotation = lineAnnotations[j]
    let fontSize = null
    if (typeof annotation === 'object') {
      const annotationAttrs = annotation.attrs
      const vTSpan = Vector.create('tspan', annotationAttrs)
      tspanNode = vTSpan.node

      let t = annotation.t
      if (eol && j === lastJ) {
        t += eol
      }

      tspanNode.textContent = t
      // Per annotation className
      const annotationClass = annotationAttrs.class as string
      if (annotationClass) {
        vTSpan.addClass(annotationClass)
      }

      // set the list of indices of all the applied annotations
      // in the `annotations` attribute. This list is a comma
      // separated list of indices.
      if (options.includeAnnotationIndices) {
        vTSpan.attr('annotations', annotation.annotations!.join(','))
      }
      // Check for max font size
      fontSize = parseFloat(annotationAttrs['font-size'] as string)
      if (fontSize === undefined) fontSize = baseSize
      if (fontSize && fontSize > maxFontSize) maxFontSize = fontSize
    } else {
      if (eol && j === lastJ) {
        annotation += eol
      }
      tspanNode = document.createTextNode(annotation || ' ')
      if (baseSize && baseSize > maxFontSize) {
        maxFontSize = baseSize
      }
    }

    lineNode.appendChild(tspanNode)
  }

  if (maxFontSize) {
    fontMetrics.maxFontSize = maxFontSize
  }

  if (lineHeight) {
    fontMetrics.lineHeight = lineHeight
  } else if (maxFontSize) {
    fontMetrics.lineHeight = maxFontSize * 1.2
  }

  return fontMetrics
}

const emRegex = /em$/

function emToPx(em: string, fontSize: number) {
  const numerical = parseFloat(em)
  if (emRegex.test(em)) {
    return numerical * fontSize
  }

  return numerical
}

function calculateDY(
  alignment: string,
  linesMetrics: any[],
  baseSizePx: number,
  lineHeight: string,
) {
  if (!Array.isArray(linesMetrics)) {
    return 0
  }

  const n = linesMetrics.length
  if (!n) return 0
  let lineMetrics = linesMetrics[0]
  const flMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx
  let rLineHeights = 0
  const lineHeightPx = emToPx(lineHeight, baseSizePx)
  for (let i = 1; i < n; i += 1) {
    lineMetrics = linesMetrics[i]
    const iLineHeight =
      emToPx(lineMetrics.lineHeight, baseSizePx) || lineHeightPx
    rLineHeights += iLineHeight
  }
  const llMaxFont = emToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx
  let dy
  switch (alignment) {
    case 'middle':
      dy = flMaxFont / 2 - 0.15 * llMaxFont - rLineHeights / 2
      break
    case 'bottom':
      dy = -(0.25 * llMaxFont) - rLineHeights
      break
    case 'top':
    default:
      dy = 0.8 * flMaxFont
      break
  }
  return dy
}

export interface TextOptions {
  /** Should we allow the text to be selected? */
  displayEmpty?: boolean
  /** End of Line character */
  eol?: string
  textPath?: string | { d?: string; 'xlink:href'?: string }
  textVerticalAnchor?: 'middle' | 'bottom' | 'top' | number
  x?: number | string
  /** auto, 1.25em */
  lineHeight?: string
  includeAnnotationIndices?: boolean
  annotations?: Text.Annotation | Text.Annotation[]
}

export function text(
  elem: SVGElement,
  content: string,
  options: TextOptions = {},
) {
  content = Text.sanitize(content) // eslint-disable-line
  const eol = options.eol
  let textPath = options.textPath
  const verticalAnchor = options.textVerticalAnchor
  const namedVerticalAnchor =
    verticalAnchor === 'middle' ||
    verticalAnchor === 'bottom' ||
    verticalAnchor === 'top'

  // Horizontal shift applied to all the lines but the first.
  let x = options.x
  if (x === undefined) {
    x = elem.getAttribute('x') || 0
  }

  // Annotations
  const iai = options.includeAnnotationIndices
  let annotations = options.annotations
  if (annotations && !Array.isArray(annotations)) {
    annotations = [annotations]
  }

  // Shift all the <tspan> but first by one line (`1em`)
  const defaultLineHeight = options.lineHeight
  const autoLineHeight = defaultLineHeight === 'auto'
  const lineHeight = autoLineHeight ? '1.5em' : defaultLineHeight || '1em'

  let needEmpty = true
  const childNodes = elem.childNodes
  if (childNodes.length === 1) {
    const node = childNodes[0] as any
    if (node && node.tagName.toUpperCase() === 'TITLE') {
      needEmpty = false
    }
  }

  if (needEmpty) {
    empty(elem)
  }

  attr(elem, {
    // Preserve spaces, do not consecutive spaces to get collapsed to one.
    'xml:space': 'preserve',
    // An empty text gets rendered into the DOM in webkit-based browsers.
    // In order to unify this behaviour across all browsers
    // we rather hide the text element when it's empty.
    display: content || options.displayEmpty ? null : 'none',
  })

  // Set default font-size if none
  const strFontSize = attr(elem, 'font-size')
  let fontSize = parseFloat(strFontSize)
  if (!fontSize) {
    fontSize = 16
    if ((namedVerticalAnchor || annotations) && !strFontSize) {
      attr(elem, 'font-size', `${fontSize}`)
    }
  }

  let containerNode
  if (textPath) {
    // Now all the `<tspan>`s will be inside the `<textPath>`.
    if (typeof textPath === 'string') {
      textPath = { d: textPath }
    }
    containerNode = createTextPathNode(textPath as any, elem)
  } else {
    containerNode = document.createDocumentFragment()
  }

  let dy
  let offset = 0
  let annotatedY
  const lines = content.split('\n')
  const linesMetrics = []
  const lastI = lines.length - 1

  for (let i = 0; i <= lastI; i += 1) {
    dy = lineHeight
    let lineClassName = 'v-line'
    const lineNode = createSvgElement('tspan') as SVGTSpanElement

    let lineMetrics
    let line = lines[i]
    if (line) {
      if (annotations) {
        // Find the *compacted* annotations for this line.
        const lineAnnotations = Text.annotate(line, annotations, {
          offset: -offset,
          includeAnnotationIndices: iai,
        })

        lineMetrics = annotateTextLine(lineNode, lineAnnotations, {
          eol: i !== lastI && eol,
          baseSize: fontSize,
          lineHeight: autoLineHeight ? null : lineHeight,
          includeAnnotationIndices: iai,
        })

        // Get the line height based on the biggest font size
        // in the annotations for this line.
        const iLineHeight = lineMetrics.lineHeight
        if (iLineHeight && autoLineHeight && i !== 0) {
          dy = iLineHeight
        }

        if (i === 0) {
          annotatedY = lineMetrics.maxFontSize * 0.8
        }
      } else {
        if (eol && i !== lastI) {
          line += eol
        }

        lineNode.textContent = line
      }
    } else {
      // Make sure the textContent is never empty. If it is, add a dummy
      // character and make it invisible, making the following lines correctly
      // relatively positioned. `dy=1em` won't work with empty lines otherwise.
      lineNode.textContent = '-'
      lineClassName += ' v-empty-line'

      const lineNodeStyle = lineNode.style as any
      lineNodeStyle.fillOpacity = 0
      lineNodeStyle.strokeOpacity = 0

      if (annotations) {
        lineMetrics = {}
      }
    }

    if (lineMetrics) {
      linesMetrics.push(lineMetrics)
    }

    if (i > 0) {
      lineNode.setAttribute('dy', dy)
    }

    // Firefox requires 'x' to be set on the first line
    if (i > 0 || textPath) {
      lineNode.setAttribute('x', x as string)
    }

    lineNode.className.baseVal = lineClassName
    containerNode.appendChild(lineNode)
    offset += line.length + 1 // + 1 = newline character.
  }

  // Y Alignment calculation
  if (namedVerticalAnchor) {
    if (annotations) {
      dy = calculateDY(
        verticalAnchor as string,
        linesMetrics,
        fontSize,
        lineHeight,
      )
    } else if (verticalAnchor === 'top') {
      // A shortcut for top alignment. It does not depend on font-size nor line-height
      dy = '0.8em'
    } else {
      let rh // remaining height
      if (lastI > 0) {
        rh = parseFloat(lineHeight) || 1
        rh *= lastI
        if (!emRegex.test(lineHeight)) rh /= fontSize
      } else {
        // Single-line text
        rh = 0
      }
      switch (verticalAnchor) {
        case 'middle':
          dy = `${0.3 - rh / 2}em`
          break
        case 'bottom':
          dy = `${-rh - 0.3}em`
          break
        default:
          break
      }
    }
  } else if (verticalAnchor === 0) {
    dy = '0em'
  } else if (verticalAnchor) {
    dy = verticalAnchor
  } else {
    // No vertical anchor is defined
    dy = 0
    // Backwards compatibility - we change the `y` attribute instead of `dy`.
    if (elem.getAttribute('y') == null) {
      elem.setAttribute('y', `${annotatedY || '0.8em'}`)
    }
  }

  const firstLine = containerNode.firstChild as SVGElement
  firstLine.setAttribute('dy', dy)
  elem.appendChild(containerNode)
}

export function measureText(text: string, styles: any = {}) {
  const canvasContext = document.createElement('canvas').getContext('2d')!
  if (!text) {
    return { width: 0 }
  }
  const font = []
  const fontSize = styles['font-size']
    ? `${parseFloat(styles['font-size'])}px`
    : '14px'
  font.push(styles['font-style'] || 'normal')
  font.push(styles['font-variant'] || 'normal')
  font.push(styles['font-weight'] || 400)
  font.push(fontSize)
  font.push(styles['font-family'] || 'sans-serif')

  canvasContext.font = font.join(' ')

  return canvasContext.measureText(text)
}

export function splitTextByLength(
  text: string,
  splitWidth: number,
  totalWidth: number,
  style: any = {},
) {
  if (splitWidth >= totalWidth) {
    return [text, '']
  }
  const length = text.length
  const caches: Record<string, number> = {}
  let index = Math.round((splitWidth / totalWidth) * length - 1)
  if (index < 0) {
    index = 0
  }

  // eslint-disable-next-line
  while (index >= 0 && index < length) {
    const frontText = text.slice(0, index)
    const frontWidth = caches[frontText] || measureText(frontText, style).width
    const behindText = text.slice(0, index + 1)
    const behindWidth =
      caches[behindText] || measureText(behindText, style).width

    caches[frontText] = frontWidth
    caches[behindText] = behindWidth

    if (frontWidth > splitWidth) {
      index -= 1
    } else if (behindWidth <= splitWidth) {
      index += 1
    } else {
      break
    }
  }

  return [text.slice(0, index), text.slice(index)]
}

export function breakText(
  text: string,
  size: Size,
  styles: any = {},
  options: {
    ellipsis?: string
    eol?: string
  } = {},
) {
  const width = size.width
  const height = size.height
  const eol = options.eol || '\n'
  const fontSize = styles.fontSize || 14
  const lineHeight = styles.lineHeight
    ? parseFloat(styles.lineHeight)
    : Math.ceil(fontSize * 1.4)
  const maxLines = Math.floor(height / lineHeight)

  if (text.indexOf(eol) > -1) {
    const delimiter = StringExt.uuid()
    const splitText: string[] = []

    text.split(eol).map((line) => {
      const part = breakText(line, { ...size, height: Number.MAX_SAFE_INTEGER }, styles, { ...options, eol: delimiter })

      if (part) {
        splitText.push(...part.split(delimiter))
      }
    })

    return splitText.slice(0, maxLines).join(eol)
  }

  const { width: textWidth } = measureText(text, styles)

  if (textWidth < width) {
    return text
  }

  const lines = []

  let remainText = text
  let remainWidth = textWidth
  let ellipsis = options.ellipsis
  let ellipsisWidth = 0

  if (ellipsis) {
    if (typeof ellipsis !== 'string') {
      ellipsis = '\u2026'
    }
    ellipsisWidth = measureText(ellipsis, styles).width
  }

  for (let i = 0; i < maxLines; i += 1) {
    if (remainWidth > width) {
      const isLast = i === maxLines - 1
      if (isLast) {
        const [front] = splitTextByLength(
          remainText,
          width - ellipsisWidth,
          remainWidth,
          styles,
        )
        lines.push(ellipsis ? `${front}${ellipsis}` : front)
      } else {
        const [front, behind] = splitTextByLength(
          remainText,
          width,
          remainWidth,
          styles,
        )
        lines.push(front)
        remainText = behind
        remainWidth = measureText(remainText, styles).width
      }
    } else {
      lines.push(remainText)
      break
    }
  }

  return lines.join(eol)
}
