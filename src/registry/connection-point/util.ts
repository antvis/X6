import { Point, Line } from '../../geometry'

export function offset(
  p1: Point,
  p2: Point,
  offset?: number | Point.PointLike,
) {
  let tx: number | undefined
  if (typeof offset === 'object') {
    if (Number.isFinite(offset.y)) {
      const line = new Line(p2, p1)
      const { start, end } = line.parallel(offset.y)
      p2 = start // eslint-disable-line
      p1 = end // eslint-disable-line
    }
    tx = offset.x
  } else {
    tx = offset
  }

  if (tx == null || !Number.isFinite(tx)) {
    return p1
  }

  const length = p1.distance(p2)
  if (tx === 0 && length > 0) {
    return p1
  }
  return p1.move(p2, -Math.min(tx, length - 1))
}

export function getStrokeWidth(magnet: SVGElement) {
  const stroke = magnet.getAttribute('stroke-width')
  if (stroke === null) {
    return 0
  }
  return parseFloat(stroke) || 0
}

export function findShapeNode(magnet: Element) {
  if (magnet == null) {
    return null
  }

  let node = magnet
  do {
    let tagName = node.tagName
    if (typeof tagName !== 'string') return null
    tagName = tagName.toUpperCase()
    if (tagName === 'G') {
      node = node.firstElementChild as Element
    } else if (tagName === 'TITLE') {
      node = node.nextElementSibling as Element
    } else break
  } while (node)

  return node
}
