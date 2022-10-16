import { Dom } from '../../dom'
import { Vector } from '../../vector'

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
        const svgDocument = Dom.createSvgElement('svg') as SVGSVGElement
        const matrix = svgDocument.createSVGMatrix()
        expect(Dom.createSVGTransform(matrix)).toBeInstanceOf(SVGTransform)
        expect(
          Dom.createSVGTransform({
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

    describe('#parseTransformString', () => {
      it('should parse scale, rotate, translate', () => {
        const parsed = Dom.parseTransformString(
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
        const parsed = Dom.parseTransformString('matrix(1,0,0,1,30,30)')

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
          expect(Dom.transformStringToMatrix(transformString)).toEqual(
            (svgTestGroup.node as SVGGraphicsElement).getCTM() as any,
          )
        })
      })
    })

    describe('#matrixToTransformString', () => {
      it('should return correct transformation string', () => {
        expect(Dom.matrixToTransformString()).toEqual('matrix(1,0,0,1,0,0)')
        expect(Dom.matrixToTransformString({ a: 2, d: 2 })).toEqual(
          'matrix(2,0,0,2,0,0)',
        )

        expect(
          Dom.matrixToTransformString({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
        ).toEqual('matrix(1,2,3,4,5,6)')

        expect(
          Dom.matrixToTransformString(
            Dom.createSVGMatrix({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }),
          ),
        ).toEqual('matrix(1,2,3,4,5,6)')
        expect(
          Dom.matrixToTransformString({ a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 }),
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
        angle = Dom.matrixToRotation(Dom.createSVGMatrix().rotate(45))
        expect(roundObject(angle)).toEqual({ angle: 45 })

        angle = Dom.matrixToRotation(
          Dom.createSVGMatrix().translate(50, 50).rotate(15),
        )
        expect(roundObject(angle)).toEqual({ angle: 15 })

        angle = Dom.matrixToRotation(
          Dom.createSVGMatrix().translate(50, 50).rotate(60).scale(2),
        )
        expect(roundObject(angle)).toEqual({ angle: 60 })

        angle = Dom.matrixToRotation(
          Dom.createSVGMatrix().rotate(60).rotate(60),
        )
        expect(roundObject(angle)).toEqual({ angle: 120 })
      })

      it('should convert matrix to translation medata', () => {
        let translate
        translate = Dom.matrixToTranslation(
          Dom.createSVGMatrix().translate(10, 20),
        )
        expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

        translate = Dom.matrixToTranslation(
          Dom.createSVGMatrix().translate(10, 20).rotate(10, 20).scale(2),
        )
        expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 })

        translate = Dom.matrixToTranslation(
          Dom.createSVGMatrix().translate(10, 20).translate(30, 40),
        )
        expect(roundObject(translate)).toEqual({ tx: 40, ty: 60 })
      })

      it('should convert matrix to scaling metadata', () => {
        let scale
        scale = Dom.matrixToScale(Dom.createSVGMatrix().scale(2))
        expect(roundObject(scale)).toEqual({ sx: 2, sy: 2 })

        scale = Dom.matrixToScale(
          Dom.createSVGMatrix()
            .translate(15, 15)
            .scaleNonUniform(2, 3)
            .rotate(10, 20),
        )
        expect(roundObject(scale)).toEqual({ sx: 2, sy: 3 })

        scale = Dom.matrixToScale(Dom.createSVGMatrix().scale(2, 2).scale(3, 3))
        expect(roundObject(scale)).toEqual({ sx: 6, sy: 6 })
      })
    })
  })
})
