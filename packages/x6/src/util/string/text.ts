import { v } from '../../v'
import { Size } from '../../types'
import { NumberExt } from '../number'

export function breakText(
  text: string,
  size: Size,
  styles: any = {},
  options: {
    svgDocument?: SVGSVGElement
    separator?: string
    eol?: string
    hyphen?: string
    ellipsis?: string
  } = {},
) {
  const width = size.width
  const height = size.height

  const svgDocument = options.svgDocument || v.createSvgElement('svg')
  const textSpan = v.createSvgElement('tspan') as SVGTSpanElement
  const textElement = v.createSvgElement('text') as SVGTextElement
  v.attr(textElement, styles)
  v.append(textElement, textSpan)
  const textNode = document.createTextNode('')

  // Prevent flickering
  textElement.style.opacity = '0'
  // Prevent FF from throwing an uncaught exception when `getBBox()`
  // called on element that is not in the render tree (is not measurable).
  // <tspan>.getComputedTextLength() returns always 0 in this case.
  // Note that the `textElement` resp. `textSpan` can become hidden
  // when it's appended to the DOM and a `display: none` CSS stylesheet
  // rule gets applied.
  textElement.style.display = 'block'
  textSpan.style.display = 'block'

  textSpan.appendChild(textNode)
  svgDocument.appendChild(textElement)

  if (!options.svgDocument) {
    document.body.appendChild(svgDocument)
  }

  const eol = options.eol || '\n'
  const separator = options.separator || ' '
  const hyphen = options.hyphen ? new RegExp(options.hyphen) : /[^\w\d]/

  const words = text.split(separator)
  const full = []
  let lines = []
  let p
  let h
  let lineHeight

  for (let i = 0, l = 0, len = words.length; i < len; i += 1) {
    const word = words[i]
    if (!word) {
      continue
    }

    if (eol && word.indexOf(eol) >= 0) {
      // word contains end-of-line character
      if (word.length > 1) {
        // separate word and continue cycle
        const eolWords = word.split(eol)
        for (let j = 0, jl = eolWords.length - 1; j < jl; j += 1) {
          eolWords.splice(2 * j + 1, 0, eol)
        }
        words.splice(i, 1, ...eolWords.filter(word => word !== ''))
        i -= 1
        len = words.length
      } else {
        // creates a new line
        l += 1
        lines[l] = ''
      }
      continue
    }

    textNode.data = lines[l] ? `${lines[l]} ${word}` : word

    if (textSpan.getComputedTextLength() <= width) {
      // the current line fits
      lines[l] = textNode.data

      if (p || h) {
        // We were partitioning. Put rest of the word onto next line
        full[l] = true
        l += 1

        // cancel partitioning and splitting by hyphens
        p = 0
        h = 0
      }
    } else {
      if (!lines[l] || p) {
        const partition = !!p

        p = word.length - 1

        if (partition || !p) {
          // word has only one character.
          if (!p) {
            if (!lines[l]) {
              // we won't fit this text within our rect
              lines = []

              break
            }

            // partitioning didn't help on the non-empty line
            // try again, but this time start with a new line

            // cancel partitions created
            words.splice(i, 2, word + words[i + 1])

            // adjust word length
            len -= 1

            full[l] = true
            l += 1
            i -= 1

            continue
          }

          // move last letter to the beginning of the next word
          words[i] = word.substring(0, p)
          words[i + 1] = word.substring(p) + words[i + 1]
        } else {
          if (h) {
            // cancel splitting and put the words together again
            words.splice(i, 2, words[i] + words[i + 1])
            h = 0
          } else {
            const hyphenIndex = word.search(hyphen)
            if (
              hyphenIndex > -1 &&
              hyphenIndex !== word.length - 1 &&
              hyphenIndex !== 0
            ) {
              h = hyphenIndex + 1
              p = 0
            }

            // We initiate partitioning or splitting
            // split the long word into two words
            words.splice(
              i,
              1,
              word.substring(0, h || p),
              word.substring(h || p),
            )
            // adjust words length
            len += 1
          }

          if (l && !full[l - 1]) {
            // if the previous line is not full, try to fit max part of
            // the current word there
            l -= 1
          }
        }

        i -= 1

        continue
      }

      l += 1
      i -= 1
    }

    // if size.height is defined we have to check whether the height of the entire
    // text exceeds the rect height
    if (height !== undefined) {
      if (lineHeight === undefined) {
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
          lineHeight *= textElement.getBBox().height
        }
      }

      if (lineHeight * lines.length > height) {
        // remove overflowing lines
        const lastL = Math.floor(height / lineHeight) - 1
        lines.splice(lastL + 1)

        // add ellipsis
        let ellipsis = options.ellipsis
        if (!ellipsis || lastL < 0) break
        if (typeof ellipsis !== 'string') ellipsis = '\u2026'

        const lastLine = lines[lastL]
        if (!lastLine) break
        let k = lastLine.length
        let lastLineWithOmission
        let lastChar
        let separatorChar
        do {
          lastChar = lastLine[k]
          lastLineWithOmission = lastLine.substring(0, k)
          if (!lastChar) {
            separatorChar = typeof separator === 'string' ? separator : ' '
            lastLineWithOmission += separatorChar
          } else if (lastChar.match(separator)) {
            lastLineWithOmission += lastChar
          }
          lastLineWithOmission += ellipsis
          textNode.data = lastLineWithOmission
          if (textSpan.getComputedTextLength() <= width) {
            lines[lastL] = lastLineWithOmission
            break
          }
          k -= 1
        } while (k >= 0)
        break
      }
    }
  }

  if (options.svgDocument) {
    // svg document was provided, remove the text element only
    svgDocument.removeChild(textElement)
  } else {
    // clean svg document
    document.body.removeChild(svgDocument)
  }

  return lines.join(eol)
}

/**
 * Replaces all spaces with the Unicode No-break space.
 * ref: http://www.fileformat.info/info/unicode/char/a0/index.htm
 *
 * IE would otherwise collapse all spaces into one. This is useful
 * e.g. in tests when you want to compare the actual DOM text content
 * without having to add the unicode character in the place of all spaces.
 */
export function sanitizeText(text: string) {
  return text.replace(/ /g, '\u00A0')
}
