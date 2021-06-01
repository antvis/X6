/* eslint-disable no-control-regex */

import { Size } from '../../types'
import { NumberExt } from '../number'
import { Text } from '../text'
import { attr } from './attr'
import { Vector } from '../vector'
import { createSvgElement, empty, remove } from './elem'
import { Platform } from '../platform'

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

function splitText(
  text: string,
  separator: string | RegExp | undefined | null,
  eol: string,
  hyphen: RegExp,
) {
  const words: string[] = []
  const separators: string[] = []

  if (separator != null) {
    const parts = text.split(separator)
    words.push(...parts)
    if (typeof separator === 'string') {
      for (let i = 0, l = parts.length - 1; i < l; i += 1) {
        separators.push(separator)
      }
    } else {
      const seps = text.match(new RegExp(separator, 'g'))
      for (let i = 0, l = parts.length - 1; i < l; i += 1) {
        separators.push(seps ? seps[i] : '')
      }
    }
  } else {
    let word = ''
    for (let i = 0, l = text.length; i < l; i += 1) {
      const char = text[i]

      if (char === ' ') {
        words.push(word)
        separators.push(' ')
        word = ''
      } else if (char.match(/[^\x00-\xff]/)) {
        // split double byte character
        if (word.length) {
          words.push(word)
          separators.push('')
        }

        words.push(char)
        separators.push('')

        word = ''
      } else {
        word += char
      }
    }

    if (word.length) {
      words.push(word)
    }
  }

  // end-of-line
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]
    if (word.indexOf(eol) >= 0 && word.length > 1) {
      const parts = word.split(eol)
      for (let j = 0, k = parts.length - 1; j < k; j += 1) {
        parts.splice(2 * j + 1, 0, eol)
      }

      const valids = parts.filter((part) => part !== '')
      words.splice(i, 1, ...valids)

      const seps = valids.map(() => '')
      seps.pop()
      separators.splice(i, 0, ...seps)
    }
  }

  // hyphen
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]
    const index = word.search(hyphen)
    if (index > 0 && index < word.length - 1) {
      words.splice(
        i,
        1,
        word.substring(0, index + 1),
        word.substring(index + 1),
      )
      separators.splice(i, 0, '')
    }
  }

  return { words, separators }
}

export function breakText(
  text: string,
  size: Size,
  styles: any = {},
  options: {
    ellipsis?: string
    separator?: string
    eol?: string
    hyphen?: string
    breakWord?: boolean
    svgDocument?: SVGSVGElement
  } = {},
) {
  const width = size.width
  const height = size.height

  const svgDocument = options.svgDocument || createSvgElement('svg')
  const telem = createSvgElement('text') as SVGTextElement
  const tspan = createSvgElement('tspan') as SVGTSpanElement
  const tnode = document.createTextNode('')

  attr(telem, styles)
  telem.appendChild(tspan)

  // Prevent flickering
  telem.style.opacity = '0'
  // Prevent FF from throwing an uncaught exception when `getBBox()`
  // called on element that is not in the render tree (is not measurable).
  // <tspan>.getComputedTextLength() returns always 0 in this case.
  // Note that the `textElement` resp. `textSpan` can become hidden
  // when it's appended to the DOM and a `display: none` CSS stylesheet
  // rule gets applied.
  telem.style.display = 'block'
  tspan.style.display = 'block'

  tspan.appendChild(tnode)
  svgDocument.appendChild(telem)

  const shouldAppend = svgDocument.parentNode == null
  if (shouldAppend) {
    document.body.appendChild(svgDocument)
  }

  const eol = options.eol || '\n'
  const separator = options.separator || ' '
  const hyphen = options.hyphen ? new RegExp(options.hyphen) : /[^\w\d]/
  const breakWord = options.breakWord !== false

  const full = []
  const lineSeprators: { [index: number]: string } = {}
  let lines = []
  let partIndex
  // let hyphenIndex
  let lineHeight
  let currentSeparator

  const { words, separators } = splitText(text, options.separator, eol, hyphen)
  for (
    let wordIndex = 0, lineIndex = 0, wordCount = words.length;
    wordIndex < wordCount;
    wordIndex += 1
  ) {
    const word = words[wordIndex]

    // empty word
    if (!word) {
      continue
    }

    // end of line
    if (word === eol) {
      full[lineIndex] = true
      // start a new line
      lineIndex += 1
      lines[lineIndex] = ''
      continue
    }

    if (lines[lineIndex] != null) {
      currentSeparator = separators[wordIndex - 1] || ''
      tnode.data = `${lines[lineIndex]}${currentSeparator}${word}`
    } else {
      tnode.data = word
    }

    if (tspan.getComputedTextLength() <= width) {
      // update line
      lines[lineIndex] = tnode.data
      lineSeprators[lineIndex] = separators[wordIndex]

      // when is partitioning, put rest of the word onto next line
      if (partIndex) {
        full[lineIndex] = true
        lineIndex += 1
        partIndex = 0
      }
    } else {
      if (breakWord) {
        // word is too long to put in one line or is partitioning
        if (!lines[lineIndex] || partIndex) {
          const isPartition = !!partIndex
          const isCharacter = word.length === 1

          partIndex = word.length - 1

          if (isPartition || isCharacter) {
            // word has only one character.
            if (isCharacter) {
              if (!lines[lineIndex]) {
                // can't fit this text within our rect
                lines = []
                break
              }

              // partitioning didn't help on the non-empty line
              // try again, but this time start with a new line

              // cancel partitions created
              words.splice(wordIndex, 2, word + words[wordIndex + 1])
              separators.splice(wordIndex + 1, 1)
              full[lineIndex] = true

              lineIndex += 1
              wordCount -= 1
              wordIndex -= 1

              continue
            }

            // update the partitioning words
            words[wordIndex] = word.substring(0, partIndex)
            words[wordIndex + 1] =
              word.substring(partIndex) + words[wordIndex + 1]
          } else {
            // partitioning the long word into two words
            words.splice(
              wordIndex,
              1,
              word.substring(0, partIndex),
              word.substring(partIndex),
            )
            separators.splice(wordIndex, 0, '')
            wordCount += 1

            // if the previous line is not full
            if (lineIndex && !full[lineIndex - 1]) {
              lineIndex -= 1
            }
          }

          wordIndex -= 1
          continue
        }
      } else if (!lines[lineIndex]) {
        lines[lineIndex] = word
        full[lineIndex] = true
        lineIndex += 1
        continue
      }

      lineIndex += 1
      wordIndex -= 1
    }

    // check whether the height of the entire text exceeds the rect height
    if (height != null) {
      // ensure line height
      if (lineHeight == null) {
        let heightValue

        // use the same defaults as in V.prototype.text
        if (styles.lineHeight === 'auto') {
          heightValue = { value: 1.5, unit: 'em' }
        } else {
          heightValue = NumberExt.parseCssNumeric(styles.lineHeight, [
            'em',
          ]) || {
            value: 1,
            unit: 'em',
          }
        }

        lineHeight = heightValue.value
        if (heightValue.unit === 'em') {
          if (Platform.IS_FIREFOX) {
            lineHeight *= tspan.getBBox().height
          } else {
            lineHeight *= telem.getBBox().height
          }
        }
      }

      if (lineHeight * lines.length > height) {
        // remove overflowing lines
        const lastLineIndex = Math.floor(height / lineHeight) - 1
        const lastLine = lines[lastLineIndex]
        const overflowLine = lines[lastLineIndex + 1]

        lines.splice(lastLineIndex + 1)

        if (lastLine == null) {
          break
        }

        // add ellipsis
        let ellipsis = options.ellipsis
        if (!ellipsis) {
          break
        }

        if (typeof ellipsis !== 'string') {
          ellipsis = '\u2026'
        }

        let fullLastLine = lastLine
        if (overflowLine && breakWord) {
          fullLastLine += currentSeparator + overflowLine
        }

        let lastCharIndex = fullLastLine.length
        let fixedLastLine
        let lastChar

        do {
          lastChar = fullLastLine[lastCharIndex]
          fixedLastLine = fullLastLine.substring(0, lastCharIndex)
          if (!lastChar) {
            fixedLastLine += lineSeprators[lastLineIndex]
          } else if (lastChar.match(separator)) {
            fixedLastLine += lastChar
          }
          fixedLastLine += ellipsis
          tnode.data = fixedLastLine
          if (tspan.getComputedTextLength() <= width) {
            lines[lastLineIndex] = fixedLastLine
            break
          }
          lastCharIndex -= 1
        } while (lastCharIndex >= 0)

        break
      }
    }
  }

  if (shouldAppend) {
    remove(svgDocument)
  } else {
    remove(telem)
  }

  return lines.join(eol)
}
