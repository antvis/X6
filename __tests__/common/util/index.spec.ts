import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Util } from '../../../src/common'
import { Dom } from '../../../src/common/dom'
import {
  Ellipse,
  Line,
  Point,
  Polyline,
  Rectangle,
} from '../../../src/geometry'

describe('Util', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('transformPoint should apply matrix transformation', () => {
    const matrix = new DOMMatrix().translate(10, 20)
    const p = Util.transformPoint({ x: 1, y: 2 }, matrix)
    expect(p).toBeInstanceOf(Point)
    expect(p.x).toBe(11)
    expect(p.y).toBe(22)
  })

  it('transformLine should apply matrix to both points', () => {
    const line = new Line(0, 0, 1, 1)
    const matrix = new DOMMatrix().translate(5, 5)
    const result = Util.transformLine(line, matrix)
    expect(result.start.equals(new Point(5, 5))).toBe(true)
    expect(result.end.equals(new Point(6, 6))).toBe(true)
  })

  it('transformPolyline should map points', () => {
    const poly = new Polyline([new Point(0, 0), new Point(1, 1)])
    const matrix = new DOMMatrix().translate(2, 3)
    const result = Util.transformPolyline(poly, matrix)
    expect(result.points[0].x).toBe(2)
    expect(result.points[0].y).toBe(3)
  })

  it('transformRectangle should transform corners', () => {
    const rect = new Rectangle(0, 0, 10, 20)
    const matrix = new DOMMatrix().translate(5, 5)
    const result = Util.transformRectangle(rect, matrix)
    expect(result).toBeInstanceOf(Rectangle)
    expect(result.x).toBe(5)
    expect(result.y).toBe(5)
  })

  it('bbox should return fallback when element not in DOM', () => {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    expect(Util.bbox(elem)).toEqual(new Rectangle(0, 0, 0, 0))
  })

  it('getBBox should return zero rect when not SVGGraphicsElement', () => {
    const div = document.createElement('div')
    expect(Util.getBBox(div as any)).toEqual(new Rectangle(0, 0, 0, 0))
  })

  it('getBBox should use getBBox when available', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    svg.appendChild(rect)
    rect.getBBox = vi.fn(() => ({ x: 1, y: 2, width: 3, height: 4 })) as any
    expect(Util.getBBox(rect)).toEqual(new Rectangle(1, 2, 3, 4))
  })

  it('toGeometryShape should handle rect/circle/ellipse/line', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', '1')
    rect.setAttribute('y', '2')
    rect.setAttribute('width', '3')
    rect.setAttribute('height', '4')
    expect(Util.toGeometryShape(rect)).toBeInstanceOf(Rectangle)

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    circle.setAttribute('cx', '5')
    circle.setAttribute('cy', '6')
    circle.setAttribute('r', '7')
    expect(Util.toGeometryShape(circle)).toBeInstanceOf(Ellipse)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', '0')
    line.setAttribute('y1', '0')
    line.setAttribute('x2', '10')
    line.setAttribute('y2', '10')
    expect(Util.toGeometryShape(line)).toBeInstanceOf(Line)
  })

  it('toGeometryShape should handle polygon closing', () => {
    const poly = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    )
    vi.spyOn(Dom, 'getPointsFromSvgElement').mockReturnValue([
      // @ts-expect-error
      new Point(0, 0),
      // @ts-expect-error
      new Point(1, 1),
    ])
    const result = Util.toGeometryShape(poly) as Polyline
    expect(result.points.length).toBe(3) // closed
  })

  it('translateAndAutoOrient should set transform attribute', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    svg.appendChild(rect)
    vi.spyOn(Util, 'getBBox').mockReturnValue(new Rectangle(0, 0, 10, 10))
    // @ts-expect-error
    vi.spyOn(Dom, 'scale').mockReturnValue({ sx: 1, sy: 1 })
    vi.spyOn(Dom, 'getTransformToElement').mockReturnValue(new DOMMatrix())
    vi.spyOn(Dom, 'matrixToTransformString').mockReturnValue('matrix(...)')
    Util.translateAndAutoOrient(rect, { x: 0, y: 0 }, { x: 1, y: 0 }, svg)
    expect(rect.getAttribute('transform')).toBe('matrix(...)')
  })

  it('findShapeNode should skip x6-port class and TITLE', () => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const port = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    port.classList.add('x6-port')
    g.appendChild(port)
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    g.appendChild(circle)
    const result = Util.findShapeNode(port)
    expect(result).toBe(circle)
  })

  it('getBBoxV2 should return geometry bbox', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', '1')
    rect.setAttribute('y', '2')
    rect.setAttribute('width', '3')
    rect.setAttribute('height', '4')
    const result = Util.getBBoxV2(rect)
    expect(result).toBeInstanceOf(Rectangle)
    expect(result.width).toBe(3)
  })
})
