import sinon from 'sinon'
import { Matrix } from '../../struct/matrix'
import { Dom } from '../dom'

describe('Dom', () => {
  describe('transform()', () => {
    it('should act as full getter with no argument', () => {
      const dom = new Dom().attr('transform', 'translate(10, 20) rotate(45)')
      const actual = dom.transform()
      const expected = new Matrix().rotate(45).translate(10, 20).decompose()

      expect(actual).toEqual(expected)
    })

    it('should return a single transformation value when string was passed', () => {
      const dom = new Dom().attr('transform', 'translate(10, 20) rotate(45)')
      expect(dom.transform('rotate')).toBe(45)
      expect(dom.transform('translateX')).toBe(10)
      expect(dom.transform('translateY')).toBe(20)
    })

    it('should set the transformation with an object', () => {
      const dom = new Dom().transform({ rotate: 45, translate: [10, 20] })
      expect(dom.transform('rotate')).toBe(45)
      expect(dom.transform('translateX')).toBe(10)
      expect(dom.transform('translateY')).toBe(20)
    })

    it('should perform a relative transformation', () => {
      const dom = new Dom()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, true)
      expect(dom.transform('rotate')).toBeCloseTo(55, 5) // rounding errors
      expect(dom.transform('translateX')).toBe(10)
      expect(dom.transform('translateY')).toBe(20)
    })

    it('should perform a relative transformation with other matrix', () => {
      const dom = new Dom()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, new Matrix().rotate(30))
      expect(dom.transform('rotate')).toBeCloseTo(40, 5) // rounding errors
      expect(dom.transform('translateX')).toBe(0)
      expect(dom.transform('translateY')).toBe(0)
    })

    it('should perform a relative transformation with other element', () => {
      const ref = new Dom().transform({ rotate: 30 })
      const dom = new Dom()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, ref)
      expect(dom.transform('rotate')).toBeCloseTo(40, 5) // rounding errors
      expect(dom.transform('translateX')).toBe(0)
      expect(dom.transform('translateY')).toBe(0)
    })
  })

  describe('untransform()', () => {
    it('should return itself', () => {
      const dom = new Dom()
      expect(dom.untransform()).toBe(dom)
    })

    it('should delete the transform attribute', () => {
      const dom = new Dom()
      expect(dom.untransform().attr('transform') as any).toBe(undefined)
    })
  })

  describe('matrixify()', () => {
    it('should get an empty matrix when there is not transformations', () => {
      expect(new Dom().matrixify()).toEqual(new Matrix())
    })

    it('should reduce all transformations of the transform list into one matrix [1]', () => {
      const dom = new Dom().attr('transform', 'matrix(1, 0, 1, 1, 0, 1)')
      expect(dom.matrixify()).toEqual(new Matrix(1, 0, 1, 1, 0, 1))
    })

    it('should reduce all transformations of the transform list into one matrix [2]', () => {
      const dom = new Dom().attr('transform', 'translate(10, 20) rotate(45)')
      expect(dom.matrixify()).toEqual(new Matrix().rotate(45).translate(10, 20))
    })

    it('should reduce all transformations of the transform list into one matrix [3]', () => {
      const dom = new Dom().attr(
        'transform',
        'translate(10, 20) rotate(45) skew(1,2) skewX(10) skewY(20)',
      )
      expect(dom.matrixify()).toEqual(
        new Matrix()
          .skewY(20)
          .skewX(10)
          .skew(1, 2)
          .rotate(45)
          .translate(10, 20),
      )
    })
  })

  describe('matrix()', () => {
    it('should get transform as a matrix', () => {
      expect(new Dom().matrixify()).toEqual(new Matrix())
      const dom = new Dom().transform({ rotate: 45, translate: [10, 20] })
      expect(dom.matrix()).toEqual(new Matrix().rotate(45).translate(10, 20))
    })

    it('should transform element with matrix', () => {
      expect(
        new Dom().matrix(new Matrix().translate(10, 20)).attr('transform'),
      ).toEqual('matrix(1,0,0,1,10,20)')

      expect(new Dom().matrix(1, 0, 0, 1, 10, 20).attr('transform')).toEqual(
        'matrix(1,0,0,1,10,20)',
      )
    })
  })

  describe('rotate()', () => {
    it('should rotate element', () => {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.rotate(1, 2, 3)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ rotate: 1, ox: 2, oy: 3 }, true])
    })
  })

  describe('skew()', () => {
    it('should skew element with no argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.skew()
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { skew: undefined, ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should skew element with one argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.skew(5)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { skew: 5, ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should skew element with two argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.skew(5, 6)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { skew: [5, 6], ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should skew element with three arguments', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.skew(5, 6, 7)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ skew: 5, ox: 6, oy: 7 }, true])
    })

    it('should skew element with four arguments', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.skew(5, 6, 7, 8)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ skew: [5, 6], ox: 7, oy: 8 }, true])
    })
  })

  describe('shear()', () => {
    it('should shear element', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.shear(1, 2, 3)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ shear: 1, ox: 2, oy: 3 }, true])
    })
  })

  describe('scale()', () => {
    it('should scale element with no argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.scale()
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { scale: undefined, ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should scale element with one argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.scale(5)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { scale: 5, ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should scale element with two argument', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.scale(5, 6)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([
        { scale: [5, 6], ox: undefined, oy: undefined },
        true,
      ])
    })

    it('should scale element with three arguments', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.scale(5, 6, 7)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ scale: 5, ox: 6, oy: 7 }, true])
    })

    it('should scale element with four arguments', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.scale(5, 6, 7, 8)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ scale: [5, 6], ox: 7, oy: 8 }, true])
    })
  })

  describe('translate()', () => {
    it('should translate element', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.translate(1, 2)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ translate: [1, 2] }, true])
    })
  })

  describe('relative()', () => {
    it('should relative element', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.relative(1, 2)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ relative: [1, 2] }, true])
    })
  })

  describe('flip()', () => {
    it('should flip element', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.flip('x', 2)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ flip: 'x', origin: 2 }, true])
    })

    it('should sets flip to "both" when calling without anything', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.flip()
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ flip: 'both', origin: 'center' }, true])
    })

    it('should set flip to both and origin to number when called with origin only', function () {
      const dom = new Dom()
      const spy = sinon.spy(dom, 'transform')
      dom.flip(5)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([{ flip: 'both', origin: 5 }, true])
    })
  })
})
