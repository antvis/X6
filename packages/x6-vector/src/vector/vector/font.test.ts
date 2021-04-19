import sinon from 'sinon'
import { Svg } from '../svg/svg'
import { Text } from '../text/text'

describe('Vector', () => {
  describe('font()', () => {
    let svg: Svg
    let txt: Text

    beforeEach(() => {
      svg = new Svg().appendTo(document.body)
      txt = svg.text('Some text')
    })

    afterEach(() => {
      svg.remove()
    })

    it('should set leading when given', function () {
      const spy = spyOn(txt, 'leading')
      txt.font({ leading: 3 })
      expect(spy).toHaveBeenCalledWith(3)
    })

    it('should sets text-anchor when anchor given', function () {
      const spy = sinon.spy(txt, 'attr')
      txt.font({ anchor: 'start' })
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual(['text-anchor', 'start'])
    })

    it('should set all font properties via attr()', function () {
      const spy = spyOn(txt, 'attr')
      txt.font({
        size: 20,
        family: 'Verdana',
        weight: 'bold',
        stretch: 'wider',
        variant: 'small-caps',
        style: 'italic',
      })
      expect(spy).toHaveBeenCalledWith('font-size', 20)
      expect(spy).toHaveBeenCalledWith('font-family', 'Verdana')
      expect(spy).toHaveBeenCalledWith('font-weight', 'bold')
      expect(spy).toHaveBeenCalledWith('font-stretch', 'wider')
      expect(spy).toHaveBeenCalledWith('font-variant', 'small-caps')
      expect(spy).toHaveBeenCalledWith('font-style', 'italic')
    })

    it('should redirect all other stuff directly to attr()', function () {
      const spy = spyOn(txt, 'attr')
      txt.font({
        foo: 'bar',
        bar: 'baz',
      } as any)
      expect(spy).toHaveBeenCalledWith('foo', 'bar')
      expect(spy).toHaveBeenCalledWith('bar', 'baz')
    })

    it('should set key value pair', function () {
      const spy = spyOn(txt, 'attr')
      txt.font('size', 20)
      expect(spy).toHaveBeenCalledWith('font-size', 20)
    })

    it('should get value if called with one parameter', function () {
      const spy = spyOn(txt, 'attr')
      txt.font('size')
      expect(spy).toHaveBeenCalledWith('font-size', undefined)
    })
  })
})
