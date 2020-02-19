import { attr } from './attr'
import { create } from './ctor'
import { isObject } from './util'
import { createSvgElement, empty } from './elem'
import {
  Annotation,
  AnnotatedItem,
  sanitizeText,
  annotateString,
} from './text-format'

function createTextPathNode(
  attrs: { d?: string; 'xlink:href'?: string },
  elem: SVGElement,
) {
  const vel = create(elem)
  const textPathElement = create('textPath')
  const d = attrs.d
  if (d && attrs['xlink:href'] === undefined) {
    const path = create('path')
      .attr('d', d)
      .appendTo(vel.defs())
    textPathElement.attr('xlink:href', `#${path.id}`)
  }

  if (isObject(attrs)) {
    textPathElement.attr(attrs as any)
  }

  return textPathElement.node
}

function annotateTextLine(
  lineNode: SVGTSpanElement,
  lineAnnotations: (string | AnnotatedItem)[],
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
    if (isObject(annotation)) {
      const annotationAttrs = annotation.attrs
      const vTSpan = create('tspan', annotationAttrs)
      tspanNode = vTSpan.node

      let t = annotation.t
      if (eol && j === lastJ) {
        t += eol
      }

      tspanNode.textContent = t
      // Per annotation className
      const annotationClass = annotationAttrs['class'] as string
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
    default:
    case 'top':
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
  annotations?: Annotation | Annotation[]
}

export function text(
  elem: SVGElement,
  content: string,
  options: TextOptions = {},
) {
  content = sanitizeText(content) // tslint:disable-line
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

  empty(elem)

  attr(elem, {
    // Preserve spaces, do not consecutive spaces to get collapsed to one.
    'xml:space': 'preserve',
    // An empty text gets rendered into the DOM in webkit-based browsers.
    // In order to unify this behaviour across all browsers
    // we rather hide the text element when it's empty.
    display: content || options.displayEmpty ? null : 'none',
  })

  // Set default font-size if none
  let fontSize = parseFloat(attr(elem, 'font-size'))
  if (!fontSize) {
    fontSize = 16
    if (namedVerticalAnchor || annotations) {
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
        const lineAnnotations = annotateString(line, annotations, {
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
      }
    }
  } else {
    if (verticalAnchor === 0) {
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
  }

  const firstLine = containerNode.firstChild as SVGElement
  firstLine.setAttribute('dy', dy)
  elem.appendChild(containerNode)
}
