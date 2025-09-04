import { beforeEach, describe, expect, it } from 'vitest'
import {
  bbox,
  findShapeNode,
  getBBox,
  getBBoxV2,
  getBoundingOffsetRect,
  normalizeMarker,
  toGeometryShape,
  transformLine,
  transformPoint,
  transformPolyline,
  transformRectangle,
  translateAndAutoOrient,
} from '../../../src/common/util/'
import { Ellipse, Line, Path, Polyline, Rectangle } from '../../../src/geometry'

describe('util', () => {
  let svgElement: SVGSVGElement
  let rectElement: SVGRectElement
  let circleElement: SVGCircleElement
  let ellipseElement: SVGEllipseElement
  let lineElement: SVGLineElement
  let polylineElement: SVGPolylineElement
  let polygonElement: SVGPolygonElement
  let pathElement: SVGPathElement
  let groupElement: SVGGElement
  let htmlElement: HTMLDivElement

  beforeEach(() => {
    document.body.innerHTML = ''
    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgElement.setAttribute('width', '100')
    svgElement.setAttribute('height', '100')
    document.body.appendChild(svgElement)

    rectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rectElement.setAttribute('x', '10')
    rectElement.setAttribute('y', '20')
    rectElement.setAttribute('width', '30')
    rectElement.setAttribute('height', '40')
    svgElement.appendChild(rectElement)

    circleElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    circleElement.setAttribute('cx', '50')
    circleElement.setAttribute('cy', '60')
    circleElement.setAttribute('r', '15')
    svgElement.appendChild(circleElement)

    ellipseElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'ellipse',
    )
    ellipseElement.setAttribute('cx', '70')
    ellipseElement.setAttribute('cy', '80')
    ellipseElement.setAttribute('rx', '25')
    ellipseElement.setAttribute('ry', '35')
    svgElement.appendChild(ellipseElement)

    lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    lineElement.setAttribute('x1', '0')
    lineElement.setAttribute('y1', '0')
    lineElement.setAttribute('x2', '100')
    lineElement.setAttribute('y2', '100')
    svgElement.appendChild(lineElement)

    polylineElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline',
    )
    polylineElement.setAttribute('points', '0,0 50,25 100,0')
    svgElement.appendChild(polylineElement)

    polygonElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    )
    polygonElement.setAttribute('points', '0,0 50,0 25,50')
    svgElement.appendChild(polygonElement)

    pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttribute('d', 'M 10 10 L 50 50 Z')
    svgElement.appendChild(pathElement)

    groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    svgElement.appendChild(groupElement)

    htmlElement = document.createElement('div')
    htmlElement.style.position = 'absolute'
    htmlElement.style.left = '10px'
    htmlElement.style.top = '20px'
    htmlElement.style.width = '100px'
    htmlElement.style.height = '50px'
    document.body.appendChild(htmlElement)
  })

  describe('normalizeMarker', () => {
    it('should export normalize function', () => {
      expect(typeof normalizeMarker).toBe('function')
    })
  })

  describe('transformPoint', () => {
    it('should transform point with identity matrix', () => {
      const point = { x: 10, y: 20 }
      const matrix = new DOMMatrix()
      const result = transformPoint(point, matrix)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
    })

    it('should transform point with translation matrix', () => {
      const point = { x: 10, y: 20 }
      const matrix = new DOMMatrix().translate(5, 10)
      const result = transformPoint(point, matrix)
      expect(result.x).toBe(15)
      expect(result.y).toBe(30)
    })

    it('should transform point with scale matrix', () => {
      const point = { x: 10, y: 20 }
      const matrix = new DOMMatrix().scale(2, 3)
      const result = transformPoint(point, matrix)
      expect(result.x).toBe(20)
      expect(result.y).toBe(60)
    })
  })

  describe('transformLine', () => {
    it('should transform line with identity matrix', () => {
      const line = new Line(0, 0, 10, 10)
      const matrix = new DOMMatrix()
      const result = transformLine(line, matrix)
      expect(result.start.x).toBe(0)
      expect(result.start.y).toBe(0)
      expect(result.end.x).toBe(10)
      expect(result.end.y).toBe(10)
    })

    it('should transform line with translation matrix', () => {
      const line = new Line(0, 0, 10, 10)
      const matrix = new DOMMatrix().translate(5, 5)
      const result = transformLine(line, matrix)
      expect(result.start.x).toBe(5)
      expect(result.start.y).toBe(5)
      expect(result.end.x).toBe(15)
      expect(result.end.y).toBe(15)
    })
  })

  describe('transformPolyline', () => {
    it('should transform polyline with identity matrix', () => {
      const polyline = new Polyline([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ])
      const matrix = new DOMMatrix()
      const result = transformPolyline(polyline, matrix)
      expect(result.points[0].x).toBe(0)
      expect(result.points[0].y).toBe(0)
      expect(result.points[1].x).toBe(10)
      expect(result.points[1].y).toBe(10)
    })

    it('should transform polyline with translation matrix', () => {
      const polyline = new Polyline([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ])
      const matrix = new DOMMatrix().translate(5, 5)
      const result = transformPolyline(polyline, matrix)
      expect(result.points[0].x).toBe(5)
      expect(result.points[0].y).toBe(5)
      expect(result.points[1].x).toBe(15)
      expect(result.points[1].y).toBe(15)
    })

    it('should handle non-polyline input', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ]
      const matrix = new DOMMatrix()
      const result = transformPolyline(points as any, matrix)
      expect(result.points[0].x).toBe(0)
      expect(result.points[0].y).toBe(0)
    })

    it('should handle non-array input', () => {
      const matrix = new DOMMatrix()
      const result = transformPolyline({} as any, matrix)
      expect(result.points).toEqual([])
    })
  })

  describe('transformRectangle', () => {
    it('should transform rectangle with identity matrix', () => {
      const rect = { x: 10, y: 20, width: 30, height: 40 }
      const matrix = new DOMMatrix()
      const result = transformRectangle(rect, matrix)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
      expect(result.width).toBe(30)
      expect(result.height).toBe(40)
    })

    it('should transform rectangle with translation matrix', () => {
      const rect = { x: 10, y: 20, width: 30, height: 40 }
      const matrix = new DOMMatrix().translate(5, 10)
      const result = transformRectangle(rect, matrix)
      expect(result.x).toBe(15)
      expect(result.y).toBe(30)
      expect(result.width).toBe(30)
      expect(result.height).toBe(40)
    })

    it('should transform rectangle with scale matrix', () => {
      const rect = { x: 0, y: 0, width: 10, height: 10 }
      const matrix = new DOMMatrix().scale(2, 2)
      const result = transformRectangle(rect, matrix)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(20)
      expect(result.height).toBe(20)
    })

    it('should handle rotation matrix', () => {
      const rect = { x: 0, y: 0, width: 10, height: 10 }
      const matrix = new DOMMatrix().rotate(90)
      const result = transformRectangle(rect, matrix)
      expect(result.width).toBeCloseTo(10, 1)
      expect(result.height).toBeCloseTo(10, 1)
    })
  })

  describe('bbox', () => {
    it('should return zero rectangle for element not in DOM', () => {
      const isolatedRect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      const result = bbox(isolatedRect)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should return bounding box for rect element', () => {
      const result = bbox(rectElement)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should return bounding box without transformations', () => {
      const result = bbox(rectElement, true)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should return bounding box relative to target', () => {
      const result = bbox(rectElement, false, svgElement)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle elements with getBBox error', () => {
      const mockElement = {
        ownerSVGElement: svgElement,
        getBBox: () => {
          throw new Error('Test error')
        },
        clientLeft: 5,
        clientTop: 10,
        clientWidth: 20,
        clientHeight: 30,
      } as any

      const result = bbox(mockElement)
      expect(result).toBeInstanceOf(Rectangle)
    })
  })

  describe('getBBox', () => {
    it('should return zero rectangle for element not in DOM', () => {
      const isolatedRect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      const result = getBBox(isolatedRect)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle HTML elements', () => {
      const result = getBBox(htmlElement as any)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should return bounding box for SVG element', () => {
      const result = getBBox(rectElement)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should return bounding box with target', () => {
      const result = getBBox(rectElement, { target: svgElement })
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle elements with getBBox error', () => {
      const mockElement = {
        ownerSVGElement: svgElement,
        getBBox: () => {
          throw new Error('Test error')
        },
        clientLeft: 5,
        clientTop: 10,
        clientWidth: 20,
        clientHeight: 30,
      } as any

      const result = getBBox(mockElement)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle recursive option with no children', () => {
      const emptyGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      svgElement.appendChild(emptyGroup)
      const result = getBBox(emptyGroup, { recursive: true })
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle recursive option with children', () => {
      groupElement.appendChild(rectElement.cloneNode(true))
      groupElement.appendChild(circleElement.cloneNode(true))
      const result = getBBox(groupElement, { recursive: true })
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle recursive option with nested groups', () => {
      const nestedGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      nestedGroup.appendChild(rectElement.cloneNode(true))
      groupElement.appendChild(nestedGroup)
      const result = getBBox(groupElement, { recursive: true })
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle recursive option with target', () => {
      groupElement.appendChild(rectElement.cloneNode(true))
      const result = getBBox(groupElement, {
        recursive: true,
        target: svgElement,
      })
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle non-SVGGraphicsElement', () => {
      const textElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title',
      )
      svgElement.appendChild(textElement)
      const result = getBBox(textElement)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(100)
      expect(result.height).toBe(100)
    })
  })

  describe('getBoundingOffsetRect', () => {
    it('should return position for HTML element', () => {
      const result = getBoundingOffsetRect(htmlElement)
      expect(result.left).toBeGreaterThanOrEqual(0)
      expect(result.top).toBeGreaterThanOrEqual(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle null element', () => {
      const result = getBoundingOffsetRect(null as any)
      expect(result.left).toBe(0)
      expect(result.top).toBe(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle element with offset parent', () => {
      const parent = document.createElement('div')
      parent.style.position = 'relative'
      parent.style.border = '2px solid black'
      parent.style.padding = '5px'
      document.body.appendChild(parent)

      const child = document.createElement('div')
      child.style.position = 'absolute'
      child.style.left = '10px'
      child.style.top = '20px'
      child.style.width = '50px'
      child.style.height = '30px'
      parent.appendChild(child)

      const result = getBoundingOffsetRect(child)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })
  })

  describe('toGeometryShape', () => {
    it('should convert rect element to Rectangle', () => {
      const result = toGeometryShape(rectElement)
      expect(result).toBeInstanceOf(Rectangle)
      expect((result as Rectangle).x).toBe(10)
      expect((result as Rectangle).y).toBe(20)
      expect((result as Rectangle).width).toBe(30)
      expect((result as Rectangle).height).toBe(40)
    })

    it('should convert circle element to Ellipse', () => {
      const result = toGeometryShape(circleElement)
      expect(result).toBeInstanceOf(Ellipse)
      expect((result as Ellipse).center.x).toBe(50)
      expect((result as Ellipse).center.y).toBe(60)
    })

    it('should convert ellipse element to Ellipse', () => {
      const result = toGeometryShape(ellipseElement)
      expect(result).toBeInstanceOf(Ellipse)
      expect((result as Ellipse).center.x).toBe(70)
      expect((result as Ellipse).center.y).toBe(80)
    })

    it('should convert line element to Line', () => {
      const result = toGeometryShape(lineElement)
      expect(result).toBeInstanceOf(Line)
      expect((result as Line).start.x).toBe(0)
      expect((result as Line).start.y).toBe(0)
      expect((result as Line).end.x).toBe(100)
      expect((result as Line).end.y).toBe(100)
    })

    it('should convert polyline element to Polyline', () => {
      const result = toGeometryShape(polylineElement)
      expect(result).toBeInstanceOf(Polyline)
    })

    it('should convert polygon element to Polyline', () => {
      const result = toGeometryShape(polygonElement)
      expect(result).toBeInstanceOf(Polyline)
    })

    it('should convert path element to Path', () => {
      const result = toGeometryShape(pathElement)
      expect(result).toBeInstanceOf(Path)
    })

    it('should convert path element with invalid d attribute', () => {
      pathElement.setAttribute('d', 'invalid path')
      const result = toGeometryShape(pathElement)
      expect(result).toBeInstanceOf(Path)
    })

    it('should handle elements with missing attributes', () => {
      const emptyRect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      svgElement.appendChild(emptyRect)
      const result = toGeometryShape(emptyRect)
      expect(result).toBeInstanceOf(Rectangle)
      expect((result as Rectangle).x).toBe(0)
      expect((result as Rectangle).y).toBe(0)
      expect((result as Rectangle).width).toBe(0)
      expect((result as Rectangle).height).toBe(0)
    })

    it('should handle elements with invalid numeric attributes', () => {
      rectElement.setAttribute('x', 'invalid')
      rectElement.setAttribute('y', 'invalid')
      const result = toGeometryShape(rectElement)
      expect(result).toBeInstanceOf(Rectangle)
      expect((result as Rectangle).x).toBe(0)
      expect((result as Rectangle).y).toBe(0)
    })

    it('should handle unknown elements', () => {
      const unknownElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'unknown',
      )
      svgElement.appendChild(unknownElement)
      const result = toGeometryShape(unknownElement)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle non-SVG elements', () => {
      const result = toGeometryShape(htmlElement as any)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle polygon with empty points', () => {
      const emptyPolygon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon',
      )
      emptyPolygon.setAttribute('points', '')
      svgElement.appendChild(emptyPolygon)
      const result = toGeometryShape(emptyPolygon)
      expect(result).toBeInstanceOf(Polyline)
    })

    it('should handle polygon with single point', () => {
      const singlePointPolygon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon',
      )
      singlePointPolygon.setAttribute('points', '10,20')
      svgElement.appendChild(singlePointPolygon)
      const result = toGeometryShape(singlePointPolygon)
      expect(result).toBeInstanceOf(Polyline)
    })
  })

  describe('translateAndAutoOrient', () => {
    it('should translate and orient element', () => {
      const position = { x: 50, y: 50 }
      const reference = { x: 100, y: 50 }

      translateAndAutoOrient(rectElement, position, reference)
      expect(rectElement.getAttribute('transform')).toBeTruthy()
    })

    it('should handle element without target', () => {
      const position = { x: 50, y: 50 }
      const reference = { x: 100, y: 50 }

      translateAndAutoOrient(rectElement, position, reference)
      expect(rectElement.getAttribute('transform')).toBeTruthy()
    })

    it('should handle SVG element as target', () => {
      const position = { x: 50, y: 50 }
      const reference = { x: 100, y: 50 }

      translateAndAutoOrient(svgElement, position, reference, svgElement)
      expect(svgElement.getAttribute('transform')).toBeTruthy()
    })

    it('should handle zero angle', () => {
      const position = { x: 50, y: 50 }
      const reference = { x: 50, y: 50 }

      translateAndAutoOrient(rectElement, position, reference)
      expect(rectElement.getAttribute('transform')).toBeTruthy()
    })
  })

  describe('findShapeNode', () => {
    it('should return null for null input', () => {
      const result = findShapeNode(null as any)
      expect(result).toBeNull()
    })

    it('should return the same node for regular elements', () => {
      const result = findShapeNode(rectElement)
      expect(result).toBe(rectElement)
    })

    it('should handle port elements', () => {
      const portElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      portElement.classList.add('x6-port')
      const nextElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      svgElement.appendChild(portElement)
      svgElement.appendChild(nextElement)

      const result = findShapeNode(portElement)
      expect(result).toBe(nextElement)
    })

    it('should handle group elements', () => {
      const groupWithChild = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      const childElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      groupWithChild.appendChild(childElement)
      svgElement.appendChild(groupWithChild)

      const result = findShapeNode(groupWithChild)
      expect(result).toBe(childElement)
    })

    it('should handle title elements', () => {
      const titleElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title',
      )
      const nextElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      svgElement.appendChild(titleElement)
      svgElement.appendChild(nextElement)

      const result = findShapeNode(titleElement)
      expect(result).toBe(nextElement)
    })

    it('should handle elements without tagName', () => {
      const mockElement = {
        tagName: undefined,
      } as any

      const result = findShapeNode(mockElement)
      expect(result).toBeNull()
    })

    it('should handle elements with non-string tagName', () => {
      const mockElement = {
        tagName: 123,
      } as any

      const result = findShapeNode(mockElement)
      expect(result).toBeNull()
    })

    it('should handle empty group elements', () => {
      const emptyGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g',
      )
      svgElement.appendChild(emptyGroup)

      const result = findShapeNode(emptyGroup)
      expect(result).toBeNull()
    })
  })

  describe('getBBoxV2', () => {
    it('should return bounding box for rect element', () => {
      const result = getBBoxV2(rectElement)
      expect(result).toBeInstanceOf(Rectangle)
      expect(result.x).toBe(10)
      expect(result.y).toBe(20)
      expect(result.width).toBe(30)
      expect(result.height).toBe(40)
    })

    it('should handle HTML elements', () => {
      const result = getBBoxV2(htmlElement as any)
      expect(result).toBeInstanceOf(Rectangle)
    })

    it('should handle non-graphics elements', () => {
      const textElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title',
      )
      svgElement.appendChild(textElement)
      const result = getBBoxV2(textElement)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle elements that return null from findShapeNode', () => {
      const result = getBBoxV2(null as any)
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle shapes without bbox', () => {
      const mockElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      svgElement.appendChild(mockElement)
      const result = getBBoxV2(mockElement)
      expect(result).toBeInstanceOf(Rectangle)
    })
  })
})
