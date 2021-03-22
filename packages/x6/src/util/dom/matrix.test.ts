import {
  transformPoint,
  createSVGMatrix,
  matrixToScale,
  matrixToRotation,
  matrixToTranslation,
  parseTransformString,
  transformStringToMatrix,
  matrixToTransformString,
  createSVGTransform,
  transformLine,
  transformPolyline,
} from './matrix'
import { createSvgElement } from './elem'
import { Vector } from '../vector'
import { Line, Point, Polyline } from '../../geometry'

describe('Dom', () => {
  describe('matrix', () => {
    const fixture = document.createElement('div')
    const svgContainer = Vector.create('svg').node
    fixture.appendChild(svgContainer)
    document.body.appendChild(fixture)

    afterAll(() => {
      fixture.parentNode?.removeChild(fixture)
    })

    describe('createSVGTransform', () => {
      it('should return SVG transform object', () => {
        const svgDocument = createSvgElement('svg') as SVGSVGElement
        const matrix = svgDocument.createSVGMatrix()
        expect(createSVGTransform(matrix)).toBeInstanceOf(SVGTransform)
        expect(
          createSVGTransform({
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0,
          }),
        ).toBeInstanceOf(SVGTransform)
      })
    })

    describe('#transformPoint', () => {
      const p = { x: 1, y: 2 }
      const group = Vector.create('g')
      const node = group.node as SVGGraphicsElement
      svgContainer.appendChild(group.node)

      it('should return the point unchanged when transformed without transformation', () => {
        const t = transformPoint(p, node.getCTM()!)
        expect(t.equals(p)).toBe(true)
      })
      it('should returns correct point when transformed with scale transformation', () => {
        group.scale(2, 3)
        const t = transformPoint(p, node.getCTM()!)
        expect(t.equals({ x: 2, y: 6 })).toBe(true)
      })
      it('should returns correct point when transformed with rotate transformation', () => {
        group.attr('transform', 'rotate(90)')
        const t = transformPoint(p, node.getCTM()!)
        expect(t.equals({ x: -2, y: 1 })).toBe(true)
      })
    })

    describe('#transformLine', () => {
      const matrix = createSVGMatrix().translate(50, 50)
      const line = new Line(new Point(0, 0), new Point(10, 10))

      it('should return the transformed line', () => {
        const l = transformLine(line, matrix)
        expect(l.start.x).toBe(50)
        expect(l.start.y).toBe(50)
      })
    })

    describe('#transformPolyline', () => {
      const matrix = createSVGMatrix().translate(50, 50)
      const points = [new Point(0, 0), new Point(10, 10)]
      const polyline = new Polyline(points)

      it('should return transformed polyline', () => {
        const p = transformPolyline(polyline, matrix)
        expect(p.pointAt(0)?.x).toBe(50)
        expect(p.pointAt(0)?.y).toBe(50)
      })
    })

    describe('#getTransformToElement', () => {
      it('rotate', () => {
        const normalizeFloat = (value: number) => {
          const temp = value * 100
          return temp > 0 ? Math.floor(temp) : Math.ceil(temp)
        }

        const container = Vector.create(svgContainer)
        const group = Vector.create('g')
        const rect = Vector.create('rect')

        container.append(group)
        container.append(rect)

        rect.rotate(45)

        const matrix = group.getTransformToElement(rect.node)
        expect({
          a: normalizeFloat(matrix.a),
          b: normalizeFloat(matrix.b),
          c: normalizeFloat(matrix.c),
          d: normalizeFloat(matrix.d),
          e: normalizeFloat(matrix.e),
          f: normalizeFloat(matrix.f),
        }).toEqual({
          a: normalizeFloat(0.7071067811865476),
          b: normalizeFloat(-0.7071067811865475),
          c: normalizeFloat(0.7071067811865475),
          d: normalizeFloat(0.7071067811865476),
          e: normalizeFloat(0),
          f: normalizeFloat(0),
        })

        group.remove()
        rect.remove()
      })

      it('translate', () => {
        const container = Vector.create(svgContainer)
        const group = Vector.create('g')
        const rect = Vector.create('rect')

        container.append(group)
        container.append(rect)

        rect.translate(10, 10)

        const matrix = group.getTransformToElement(rect.node)
        expect({
          a: matrix.a,
          b: matrix.b,
          c: matrix.c,
          d: matrix.d,
          e: matrix.e,
          f: matrix.f,
        }).toEqual({
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: -10,
          f: -10,
        })

        group.remove()
        rect.remove()
      })
    })

    describe('#parseTransformString', () => {
      it('should parse scale, rotate, translate', () => {
        const parsed = parseTransformString(
          'scale(3) rotate(6) translate(9) xxx(11)',
        )

        expect(parsed.scale).toEqual({ sx: 3, sy: 3 })
        expect(parsed.rotation).toEqual({
          angle: 6,
          cx: undefined,
          cy: undefined,
        })
        expect(parsed.translation).toEqual({ tx: 9, ty: 0 })
      })

      it('should parse martix', () => {
        const parsed = parseTransformString('matrix(1,0,0,1,30,30)')

        expect(parsed.scale).toEqual({ sx: 1, sy: 1 })
        expect(parsed.rotation).toEqual({
          angle: 0,
          cx: undefined,
          cy: undefined,
        })
        expect(parsed.translation).toEqual({ tx: 30, ty: 30 })
      })
    })

    describe('#transformStringToMatrix', () => {
      let svgTestGroup: Vector

      beforeEach(() => {
        svgTestGroup = Vector.create('g')
        svgContainer.appendChild(svgTestGroup.node)
      })

      afterEach(() => {
        svgTestGroup.remove()
      })

      const arr = [
        '',
        'scale(2)',
        'scale(2,3)',
        'scale(2.5,3.1)',
        'translate(10, 10)',
        'translate(10,10)',
        'translate(10.2,11.6)',
        'rotate(10)',
        'rotate(10,100,100)',
        'skewX(40)',
        'skewY(60)',
        'scale(2,2) matrix(1 0 0 1 10 10)',
        'matrix(1 0 0 1 10 10) scale(2,2)',
        'rotate(10,100,100) matrix(1 0 0 1 10 10) scale(2,2) translate(10,20)',
      ]

      arr.forEach((transformString) => {
        it(`should convert "${transformString}" to matrix`, () => {
          svgTestGroup.attr('transform', transformString)
          expect(transformStringToMatrix(transformString)).toEqual(
            (svgTestGroup.node as SVGGraphicsElement).getCTM() as any,
          )
        })
      })
    })

    describe('#matrixToTransformString', () => {
      it('should return correct transformation string', () => {
        expect(matrixToTransformString()).toEqual('matrix(1,0,0,1,0,0)')
        expect(matrixToTransformString({ a: 2, d: 2 })).toEqual(
          'matrix(2,0,0,2,0,0)',
        )

        expect(
          matrixToTransformString({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
        ).toEqual('matrix(1,2,3,4,5,6)')

        expect(
          matrixToTransformString(
            createSVGMatrix({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
          ),
        ).toEqual('matrix(1,2,3,4,5,6)')
        expect(
          matrixToTransformString({ a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 }),
        ).toEqual('matrix(0,1,1,0,0,0)')
      })
    })

    describe('#matrixTo[Transformation]', () => {
      function roundObject(obj: any) {
        // eslint-disable-next-line
        for (const i in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, i)) {
            obj[i] = Math.round(obj[i])
          }
        }
        return obj
      }

      it('should convert matrix to rotation metadata', () => {
        let angle
        angle = matrixToRotation(createSVGMatrix().rotate(45))
        expect(roundObject(angle)).toEqual({ angle: 45 })

        angle = matrixToRotation(createSVGMatrix().translate(50, 50).rotate(15))
        expect(roundObject(angle)).toEqual({ angle: 15 })

        angle = matrixToRotation(
          createSVGMatrix().translate(50, 50).rotate(60).scale(2),
        )
        expect(roundObject(angle)).toEqual({ angle: 60 })

        angle = matrixToRotation(createSVGMatrix().rotate(60).rotate(60))
        expect(roundObject(angle)).toEqual({ angle: 120 })
      })

      it('should convert matrix to translation medata', () => {
        let translate
        translate = matrixToTranslation(createSVGMatrix().translate(10, 20))
        expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

        translate = matrixToTranslation(
          createSVGMatrix().translate(10, 20).rotate(10, 20).scale(2),
        )
        expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

        translate = matrixToTranslation(
          createSVGMatrix().translate(10, 20).translate(30, 40),
        )
        expect(roundObject(translate)).toEqual({ tx: 40, ty: 60 })
      })

      it('should convert matrix to scaling metadata', () => {
        let scale
        scale = matrixToScale(createSVGMatrix().scale(2))
        expect(roundObject(scale)).toEqual({ sx: 2, sy: 2 })

        scale = matrixToScale(
          createSVGMatrix()
            .translate(15, 15)
            .scaleNonUniform(2, 3)
            .rotate(10, 20),
        )
        expect(roundObject(scale)).toEqual({ sx: 2, sy: 3 })

        scale = matrixToScale(createSVGMatrix().scale(2, 2).scale(3, 3))
        expect(roundObject(scale)).toEqual({ sx: 6, sy: 6 })
      })
    })
  })
})
