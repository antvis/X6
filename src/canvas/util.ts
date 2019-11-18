import { FontStyle } from '../struct'
import { Direction } from '../types'

export function applyFontStyle(elem: Element, fontStyle: number) {
  if (FontStyle.isBold(fontStyle)) {
    elem.setAttribute('font-weight', 'bold')
  }

  if (FontStyle.isItalic(fontStyle)) {
    elem.setAttribute('font-style', 'italic')
  }

  if (FontStyle.isUnderlined(fontStyle)) {
    elem.setAttribute('text-decoration', 'underline')
  }
}

function formatColor(color: string) {
  let ret = color
  if (ret.charAt(0) === '#') {
    ret = ret.substring(1)
  }
  return ret.toLowerCase()
}

export function createGradientId(
  startColor: string,
  stopColor: string,
  opacity1: number,
  opacity2: number,
  direction: Direction,
) {

  let a = `${formatColor(startColor)}@${opacity1}`
  let b = `${formatColor(stopColor)}@${opacity2}`
  let dir = null

  if (direction == null || direction === 'south') {
    dir = 's'
  } else if (direction === 'east') {
    dir = 'e'
  } else {
    const tmp = startColor
    a = stopColor
    b = tmp

    if (direction === 'north') {
      dir = 's'
    } else if (direction === 'west') {
      dir = 'e'
    }
  }

  return `gradient-${a}-${b}-${dir}`
}

export function ensureElementId<T extends SVGElement>(
  svg: SVGSVGElement | null,
  id: string,
) {
  let counter = 0
  let tmpId = `${id}-${counter}`
  let elem: T | null = null

  if (svg != null) {
    const doc = svg.ownerDocument!
    elem = doc.getElementById(tmpId) as any as T
    while (elem != null && elem.ownerSVGElement !== svg) {
      counter += 1
      tmpId = `${id}-${counter}`
      elem = doc.getElementById(tmpId) as any as T
    }
  }

  return {
    elem,
    id: tmpId,
  }
}

export function shouldAppendToDocument(elem: SVGElement) {
  const nodeName = elem.nodeName.toLowerCase()
  return (
    (
      nodeName !== 'rect' &&
      nodeName !== 'path' &&
      nodeName !== 'ellipse'
    ) ||
    (
      elem.getAttribute('fill') !== 'none' &&
      elem.getAttribute('fill') !== 'transparent'
    ) ||
    elem.getAttribute('stroke') !== 'none' ||
    elem.getAttribute('pointer-events') !== 'none'
  )
}
