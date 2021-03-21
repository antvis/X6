import { attr } from './attr'
import { createSvgElement } from './elem'

export const KAPPA = 0.551784

function getNumbericAttribute(
  elem: SVGElement,
  attr: string,
  defaultValue = NaN,
) {
  const v = elem.getAttribute(attr)
  if (v == null) {
    return defaultValue
  }
  const n = parseFloat(v)
  return Number.isNaN(n) ? defaultValue : n
}

export function sample(elem: SVGPathElement, interval = 1) {
  const length = elem.getTotalLength()
  const samples = []
  let distance = 0
  let sample
  while (distance < length) {
    sample = elem.getPointAtLength(distance)
    samples.push({ distance, x: sample.x, y: sample.y })
    distance += interval
  }
  return samples
}

export function lineToPathData(line: SVGLineElement) {
  return [
    'M',
    getNumbericAttribute(line, 'x1'),
    getNumbericAttribute(line, 'y1'),
    'L',
    getNumbericAttribute(line, 'x2'),
    getNumbericAttribute(line, 'y2'),
  ].join(' ')
}

export function polygonToPathData(polygon: SVGPolygonElement) {
  const points = getPointsFromSvgElement(polygon)
  if (points.length === 0) {
    return null
  }
  return `${svgPointsToPath(points)} Z`
}

export function polylineToPathData(polyline: SVGPolylineElement) {
  const points = getPointsFromSvgElement(polyline)
  if (points.length === 0) {
    return null
  }

  return svgPointsToPath(points)
}

function svgPointsToPath(points: DOMPoint[]) {
  const arr = points.map((p) => `${p.x} ${p.y}`)
  return `M ${arr.join(' L')}`
}

export function getPointsFromSvgElement(
  elem: SVGPolygonElement | SVGPolylineElement,
) {
  const points = []
  const nodePoints = elem.points
  if (nodePoints) {
    for (let i = 0, ii = nodePoints.numberOfItems; i < ii; i += 1) {
      points.push(nodePoints.getItem(i))
    }
  }

  return points
}

export function circleToPathData(circle: SVGCircleElement) {
  const cx = getNumbericAttribute(circle, 'cx', 0)
  const cy = getNumbericAttribute(circle, 'cy', 0)
  const r = getNumbericAttribute(circle, 'r')
  const cd = r * KAPPA // Control distance.

  return [
    'M',
    cx,
    cy - r, // Move to the first point.
    'C',
    cx + cd,
    cy - r,
    cx + r,
    cy - cd,
    cx + r,
    cy, // I. Quadrant.
    'C',
    cx + r,
    cy + cd,
    cx + cd,
    cy + r,
    cx,
    cy + r, // II. Quadrant.
    'C',
    cx - cd,
    cy + r,
    cx - r,
    cy + cd,
    cx - r,
    cy, // III. Quadrant.
    'C',
    cx - r,
    cy - cd,
    cx - cd,
    cy - r,
    cx,
    cy - r, // IV. Quadrant.
    'Z',
  ].join(' ')
}

export function ellipseToPathData(ellipse: SVGEllipseElement) {
  const cx = getNumbericAttribute(ellipse, 'cx', 0)
  const cy = getNumbericAttribute(ellipse, 'cy', 0)
  const rx = getNumbericAttribute(ellipse, 'rx')
  const ry = getNumbericAttribute(ellipse, 'ry') || rx
  const cdx = rx * KAPPA // Control distance x.
  const cdy = ry * KAPPA // Control distance y.

  const d = [
    'M',
    cx,
    cy - ry, // Move to the first point.
    'C',
    cx + cdx,
    cy - ry,
    cx + rx,
    cy - cdy,
    cx + rx,
    cy, // I. Quadrant.
    'C',
    cx + rx,
    cy + cdy,
    cx + cdx,
    cy + ry,
    cx,
    cy + ry, // II. Quadrant.
    'C',
    cx - cdx,
    cy + ry,
    cx - rx,
    cy + cdy,
    cx - rx,
    cy, // III. Quadrant.
    'C',
    cx - rx,
    cy - cdy,
    cx - cdx,
    cy - ry,
    cx,
    cy - ry, // IV. Quadrant.
    'Z',
  ].join(' ')
  return d
}

export function rectangleToPathData(rect: SVGRectElement) {
  return rectToPathData({
    x: getNumbericAttribute(rect, 'x', 0),
    y: getNumbericAttribute(rect, 'y', 0),
    width: getNumbericAttribute(rect, 'width', 0),
    height: getNumbericAttribute(rect, 'height', 0),
    rx: getNumbericAttribute(rect, 'rx', 0),
    ry: getNumbericAttribute(rect, 'ry', 0),
  })
}

export function rectToPathData(r: {
  x: number
  y: number
  width: number
  height: number
  rx?: number
  ry?: number
  'top-rx'?: number
  'bottom-rx'?: number
  'top-ry'?: number
  'bottom-ry'?: number
}) {
  let d
  const x = r.x
  const y = r.y
  const width = r.width
  const height = r.height
  const topRx = Math.min(r.rx || r['top-rx'] || 0, width / 2)
  const bottomRx = Math.min(r.rx || r['bottom-rx'] || 0, width / 2)
  const topRy = Math.min(r.ry || r['top-ry'] || 0, height / 2)
  const bottomRy = Math.min(r.ry || r['bottom-ry'] || 0, height / 2)

  if (topRx || bottomRx || topRy || bottomRy) {
    d = [
      'M',
      x,
      y + topRy,
      'v',
      height - topRy - bottomRy,
      'a',
      bottomRx,
      bottomRy,
      0,
      0,
      0,
      bottomRx,
      bottomRy,
      'h',
      width - 2 * bottomRx,
      'a',
      bottomRx,
      bottomRy,
      0,
      0,
      0,
      bottomRx,
      -bottomRy,
      'v',
      -(height - bottomRy - topRy),
      'a',
      topRx,
      topRy,
      0,
      0,
      0,
      -topRx,
      -topRy,
      'h',
      -(width - 2 * topRx),
      'a',
      topRx,
      topRy,
      0,
      0,
      0,
      -topRx,
      topRy,
      'Z',
    ]
  } else {
    d = ['M', x, y, 'H', x + width, 'V', y + height, 'H', x, 'V', y, 'Z']
  }

  return d.join(' ')
}

export function toPath(
  elem:
    | SVGLineElement
    | SVGPolygonElement
    | SVGPolylineElement
    | SVGEllipseElement
    | SVGCircleElement
    | SVGRectElement,
) {
  const path = createSvgElement('path') as SVGPathElement
  attr(path, attr(elem))
  const d = toPathData(elem)
  if (d) {
    path.setAttribute('d', d)
  }
  return path
}

export function toPathData(
  elem:
    | SVGLineElement
    | SVGPolygonElement
    | SVGPolylineElement
    | SVGEllipseElement
    | SVGCircleElement
    | SVGRectElement,
) {
  const tagName = elem.tagName.toLowerCase()
  switch (tagName) {
    case 'path':
      return elem.getAttribute('d')
    case 'line':
      return lineToPathData(elem as SVGLineElement)
    case 'polygon':
      return polygonToPathData(elem as SVGPolygonElement)
    case 'polyline':
      return polylineToPathData(elem as SVGPolylineElement)
    case 'ellipse':
      return ellipseToPathData(elem as SVGEllipseElement)
    case 'circle':
      return circleToPathData(elem as SVGCircleElement)
    case 'rect':
      return rectangleToPathData(elem as SVGRectElement)
    default:
      break
  }

  throw new Error(`"${tagName}" cannot be converted to svg path element.`)
}

// Inspired by d3.js https://github.com/mbostock/d3/blob/master/src/svg/arc.js
export function createSlicePathData(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const svgArcMax = 2 * Math.PI - 1e-6
  const r0 = innerRadius
  const r1 = outerRadius
  let a0 = startAngle
  let a1 = endAngle
  if (a1 < a0) {
    const tmp = a0
    a0 = a1
    a1 = tmp
  }

  const da = a1 - a0
  const df = da < Math.PI ? '0' : '1'
  const c0 = Math.cos(a0)
  const s0 = Math.sin(a0)
  const c1 = Math.cos(a1)
  const s1 = Math.sin(a1)

  return da >= svgArcMax
    ? r0
      ? // eslint-disable-next-line
        `M0,${r1}A${r1},${r1} 0 1,1 0,${-r1}A${r1},${r1} 0 1,1 0,${r1}M0,${r0}A${r0},${r0} 0 1,0 0,${-r0}A${r0},${r0} 0 1,0 0,${r0}Z`
      : // eslint-disable-next-line
        `M0,${r1}A${r1},${r1} 0 1,1 0,${-r1}A${r1},${r1} 0 1,1 0,${r1}Z`
    : r0
    ? // eslint-disable-next-line
      `M${r1 * c0},${r1 * s0}A${r1},${r1} 0 ${df},1 ${r1 * c1},${r1 * s1}L${
        r0 * c1
      },${r0 * s1}A${r0},${r0} 0 ${df},0 ${r0 * c0},${r0 * s0}Z`
    : // eslint-disable-next-line
      `M${r1 * c0},${r1 * s0}A${r1},${r1} 0 ${df},1 ${r1 * c1},${r1 * s1}L0,0` +
      `Z`
}
