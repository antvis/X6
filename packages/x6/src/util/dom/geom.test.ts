import { Rectangle, Ellipse, Polyline, Path } from '../../geometry'
import { createVector } from './vector'
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
      foreignDiv
    } = setupTest()

    afterEach(clearnTest)

    describe('#bbox', () => {
      it('should return a rectangle instance', () => {
        expect(createVector('circle').bbox()).toBeInstanceOf(Rectangle)
        expect(createVector(svgCircle).bbox()).toBeInstanceOf(Rectangle)
        expect(createVector(svgCircle).bbox(true)).toBeInstanceOf(Rectangle)
        expect(createVector(svgCircle).bbox(true, svgGroup1)).toBeInstanceOf(
          Rectangle,
        )
        expect(createVector(svgLinearGradient).bbox()).toBeInstanceOf(Rectangle)
      })
    })

    describe('#getBBox', () => {
      it('should return a rectangle instance', () => {
        expect(createVector('circle').getBBox()).toBeInstanceOf(Rectangle)
        expect(createVector(svgCircle).getBBox()).toBeInstanceOf(Rectangle)
        expect(createVector(svgCircle).getBBox({})).toBeInstanceOf(Rectangle)
        expect(createVector(svgLinearGradient).getBBox()).toBeInstanceOf(
          Rectangle,
        )

        expect(
          createVector(svgCircle).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)

        expect(
          createVector(svgGroup).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgGroup).getBBox({ target: svgContainer }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgGroup).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)

        expect(
          createVector(svgGroup1).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgGroup1).getBBox({ target: svgContainer }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgGroup1).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)

        expect(
          createVector(svgLinearGradient).getBBox({ recursive: true }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgLinearGradient).getBBox({
            target: svgContainer,
          }),
        ).toBeInstanceOf(Rectangle)
        expect(
          createVector(svgLinearGradient).getBBox({ target: svgCircle }),
        ).toBeInstanceOf(Rectangle)
        
        expect(getBBox(foreignDiv as any)).toBeInstanceOf(Rectangle)
      })
    })

    describe('#toLocalPoint', () => {
      it('convert absolute coordinates to coordinates relative to svgContainer', () => {
        const { x, y } = svgContainer.getBoundingClientRect()
        const { x: localX, y: localY } = createVector(svgContainer).toLocalPoint(x, y)
        expect(localX).toBe(0)
        expect(localY).toBe(0)
      })
    })

    describe('#toGeometryShape', () => {
      it('convert the SVGElement to an equivalent geometric shap', () => {
        expect(createVector(svgEllipse).toGeometryShape()).toBeInstanceOf(Ellipse)
        expect(createVector(svgCircle).toGeometryShape()).toBeInstanceOf(Ellipse)
        expect(createVector(svgPolygon).toGeometryShape()).toBeInstanceOf(Polyline)
        expect(createVector(svgRectangle).toGeometryShape()).toBeInstanceOf(Rectangle)
        expect(createVector(svgPath).toGeometryShape()).toBeInstanceOf(Path)
        expect(createVector(svgGroup).toGeometryShape()).toBeInstanceOf(Rectangle)
      })
    })

    describe('#animateAlongPath', () => {
      it('should not throw error', () => {
        let result: boolean = true;
        try {
          createVector(svgEllipse).animateAlongPath({}, svgPath)
        } catch(e) {
          result = false
        }
        expect(result).toBeTruthy()
      })
    })
  })
})
