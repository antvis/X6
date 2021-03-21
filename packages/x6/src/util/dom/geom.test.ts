import { Rectangle, Ellipse, Polyline, Path } from '../../geometry'
import { Vector } from '../vector'
import { setupTest, clearnTest } from './elem.test'
import { getBBox } from './geom'

describe('Dom', () => {
  describe('geom', () => {
    const {
      svgContainer,
      svgGroup,
      svgGroup1,
      svgCircle,
      svgLinearGradient,
      svgEllipse,
      svgPolygon,
      svgRectangle,
      svgPath,
      foreignDiv,
    } = setupTest()

    afterEach(clearnTest)

    describe('#bbox', () => {
      it('should return a rectangle instance', () => {
        expect(Vector.create('circle').bbox()).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgCircle).bbox()).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgCircle).bbox(true)).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgCircle).bbox(true, svgGroup1)).toBeInstanceOf(
          Rectangle,
        )
        expect(Vector.create(svgLinearGradient).bbox()).toBeInstanceOf(
          Rectangle,
        )
      })
    })

    describe('#getBBox', () => {
      it('should return a rectangle instance', () => {
        expect(Vector.create('circle').getBBox()).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgCircle).getBBox()).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgCircle).getBBox({})).toBeInstanceOf(Rectangle)
        expect(Vector.create(svgLinearGradient).getBBox()).toBeInstanceOf(
          Rectangle,
        )

        expect(
          Vector.create(svgCircle).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)

        expect(
          Vector.create(svgGroup).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgGroup).getBBox({ target: svgContainer }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgGroup).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)

        expect(
          Vector.create(svgGroup1).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgGroup1).getBBox({ target: svgContainer }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgGroup1).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)

        expect(
          Vector.create(svgLinearGradient).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgLinearGradient).getBBox({
            target: svgContainer,
          }),
        ).toBeInstanceOf(Rectangle)
        expect(
          Vector.create(svgLinearGradient).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)

        expect(getBBox(foreignDiv as any)).toBeInstanceOf(Rectangle)
      })
    })

    describe('#toLocalPoint', () => {
      it('convert absolute coordinates to coordinates relative to svgContainer', () => {
        const { x, y } = svgContainer.getBoundingClientRect()
        const { x: localX, y: localY } = Vector.create(
          svgContainer,
        ).toLocalPoint(x, y)
        expect(localX).toBe(0)
        expect(localY).toBe(0)
      })
    })

    describe('#toGeometryShape', () => {
      it('convert the SVGElement to an equivalent geometric shap', () => {
        expect(Vector.create(svgEllipse).toGeometryShape()).toBeInstanceOf(
          Ellipse,
        )
        expect(Vector.create(svgCircle).toGeometryShape()).toBeInstanceOf(
          Ellipse,
        )
        expect(Vector.create(svgPolygon).toGeometryShape()).toBeInstanceOf(
          Polyline,
        )
        expect(Vector.create(svgRectangle).toGeometryShape()).toBeInstanceOf(
          Rectangle,
        )
        expect(Vector.create(svgPath).toGeometryShape()).toBeInstanceOf(Path)
        expect(Vector.create(svgGroup).toGeometryShape()).toBeInstanceOf(
          Rectangle,
        )
      })
    })

    describe('#animateAlongPath', () => {
      it('should not throw error', () => {
        let result = true
        try {
          Vector.create(svgEllipse).animateAlongPath({}, svgPath)
        } catch (e) {
          result = false
        }
        expect(result).toBeTruthy()
      })
    })
  })
})
