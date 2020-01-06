import { getNodeName } from './attr'

export function replaceTrailingNewlines(str: string, pattern: string) {
  let postfix = ''
  let left = str

  while (left.length > 0 && left.charAt(left.length - 1) === '\n') {
    left = left.substring(0, left.length - 1)
    postfix += pattern
  }

  return left + postfix
}

export function extractTextWithWhitespace(elems: Element[]) {
  const blocks = [
    'blockquote',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ol',
    'p',
    'pre',
    'table',
    'ul',
  ]
  const ret: string[] = []

  function doExtract(elts: Element[]) {
    // Single break should be ignored
    if (
      elts.length === 1 &&
      (getNodeName(elts[0]) === 'br' || elts[0].innerHTML === '\n')
    ) {
      return
    }

    for (let i = 0, ii = elts.length; i < ii; i += 1) {
      const elem = elts[i]
      const nodeName = getNodeName(elem)

      // DIV with a br or linefeed forces a linefeed
      if (
        nodeName === 'br' ||
        elem.innerHTML === '\n' ||
        ((elts.length === 1 || i === 0) &&
          nodeName === 'div' &&
          elem.innerHTML.toLowerCase() === '<br>')
      ) {
        ret.push('\n')
      } else {
        if (elem.nodeType === 3 || elem.nodeType === 4) {
          if (elem.nodeValue != null && elem.nodeValue.length > 0) {
            ret.push(elem.nodeValue)
          }
        } else if (elem.nodeType !== 8 && elem.childNodes.length > 0) {
          doExtract(elem.childNodes as any)
        }

        if (i < elts.length - 1 && blocks.includes(getNodeName(elts[i + 1]))) {
          ret.push('\n')
        }
      }
    }
  }

  doExtract(elems)

  return ret.join('')
}

/**
 * Converts the given HTML string to XHTML.
 */
export function toXHTML(html: string, useDomParser: boolean) {
  if (useDomParser) {
    let xhtml = html
    const doc = new DOMParser().parseFromString(xhtml, 'text/html')
    if (doc != null) {
      xhtml = new XMLSerializer().serializeToString(doc.body)
      // Extracts body content from DOM
      if (xhtml.substring(0, 5) === '<body') {
        xhtml = xhtml.substring(xhtml.indexOf('>', 5) + 1)
      }

      if (xhtml.substring(xhtml.length - 7, xhtml.length) === '</body>') {
        xhtml = xhtml.substring(0, xhtml.length - 7)
      }
    }

    return xhtml
  }

  if (
    document.implementation != null &&
    document.implementation.createDocument != null
  ) {
    const doc = document.implementation.createDocument(
      'http://www.w3.org/1999/xhtml',
      'html',
      null,
    )
    const body = doc.createElement('body')
    doc.documentElement.appendChild(body)

    const div = document.createElement('div')
    div.innerHTML = html

    let child = div.firstChild
    while (child != null) {
      const next = child.nextSibling
      body.appendChild(doc.adoptNode(child))
      child = next
    }

    return body.innerHTML
  }

  {
    const ta = document.createElement('textarea')

    // Handles special HTML entities < and > and double escaping
    // and converts unclosed br, hr and img tags to XHTML
    ta.innerHTML = html
      .replace(/&amp;/g, '&amp;amp;')
      .replace(/&#60;/g, '&amp;lt;')
      .replace(/&#62;/g, '&amp;gt;')
      .replace(/&lt;/g, '&amp;lt;')
      .replace(/&gt;/g, '&amp;gt;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    return ta.value
      .replace(/&/g, '&amp;')
      .replace(/&amp;lt;/g, '&lt;')
      .replace(/&amp;gt;/g, '&gt;')
      .replace(/&amp;amp;/g, '&amp;')
      .replace(/<br>/g, '<br />')
      .replace(/<hr>/g, '<hr />')
      .replace(/(<img[^>]+)>/gm, '$1 />')
  }
}
