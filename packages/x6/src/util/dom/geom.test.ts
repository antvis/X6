import { Rectangle } from '../../geometry'
import { createVector } from './vector'
import { setupTest, clearnTest } from './elem.test'

describe('Dom', () => {
  describe('geom', () => {
    const {
      svgContainer,
      svgGroup,
      svgGroup1,
      svgCircle,
      svgLinearGradient,
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
      })
    })
  })
})
