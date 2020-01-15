import { v } from './v'
import { Rectangle } from '../geometry'
import { setupTest, clearnTest } from './elem.test'

describe('v', () => {
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
      expect(v('circle').bbox()).toBeInstanceOf(Rectangle)
      expect(v(svgCircle).bbox()).toBeInstanceOf(Rectangle)
      expect(v(svgCircle).bbox(true)).toBeInstanceOf(Rectangle)
      expect(v(svgCircle).bbox(true, svgGroup1)).toBeInstanceOf(Rectangle)
      expect(v(svgLinearGradient).bbox()).toBeInstanceOf(Rectangle)
    })
  })

  describe('#getBBox', () => {
    it('should return a rectangle instance', () => {
      expect(v('circle').getBBox()).toBeInstanceOf(Rectangle)
      expect(v(svgCircle).getBBox()).toBeInstanceOf(Rectangle)
      expect(v(svgCircle).getBBox({})).toBeInstanceOf(Rectangle)
      expect(v(svgLinearGradient).getBBox()).toBeInstanceOf(Rectangle)

      expect(v(svgCircle).getBBox({ recursive: true })).toBeInstanceOf(
        Rectangle,
      )

      expect(v(svgGroup).getBBox({ recursive: true })).toBeInstanceOf(Rectangle)
      expect(v(svgGroup).getBBox({ target: svgContainer })).toBeInstanceOf(
        Rectangle,
      )
      expect(v(svgGroup).getBBox({ target: svgCircle })).toBeInstanceOf(
        Rectangle,
      )

      expect(v(svgGroup1).getBBox({ recursive: true })).toBeInstanceOf(
        Rectangle,
      )
      expect(v(svgGroup1).getBBox({ target: svgContainer })).toBeInstanceOf(
        Rectangle,
      )
      expect(v(svgGroup1).getBBox({ target: svgCircle })).toBeInstanceOf(
        Rectangle,
      )

      expect(v(svgLinearGradient).getBBox({ recursive: true })).toBeInstanceOf(
        Rectangle,
      )
      expect(
        v(svgLinearGradient).getBBox({ target: svgContainer }),
      ).toBeInstanceOf(Rectangle)
      expect(
        v(svgLinearGradient).getBBox({ target: svgCircle }),
      ).toBeInstanceOf(Rectangle)
    })
  })
})
