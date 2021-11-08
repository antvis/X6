import { Box } from '../../struct/box'
import { SVG } from '../svg/svg'
import { TSpan } from '../tspan/tspan'
import { Text } from './text'

describe('TextBase', () => {
  let svg: SVG
  let text: Text
  let tspan: TSpan

  beforeEach(() => {
    svg = new SVG().appendTo(document.body)
    text = svg.text('Hello World\nIn two lines')
    tspan = text.get<TSpan>(0)!
  })

  afterEach(() => {
    svg.remove()
  })

  describe('x()', () => {
    it('should return the value of x on a text', () => {
      expect(text.x(0).x()).toEqual(0)
    })

    it('should set the x value of the bbox on a text', () => {
      text.x(123)
      expect(text.bbox().x).toEqual(123)
    })

    it('should sets the value of all lines', () => {
      text.x(200)
      text.eachChild((child: TSpan) => {
        expect(child.x()).toEqual(text.x())
      })
    })

    it('should return the value of x on a tspan', () => {
      expect(tspan.x(10).x()).toEqual(10)
    })

    it('should set the x value of the bbox on a tspan', () => {
      tspan.x(123)
      expect(tspan.bbox().x).toEqual(123)
    })
  })

  describe('y()', () => {
    it('should return the value of y on a text', () => {
      expect(text.y(0).y()).toEqual(0)
    })

    it('should set the y value of the bbox on a text', () => {
      text.y(123)
      expect(text.bbox().y).toEqual(123)
    })

    it('should set the y position of first line', () => {
      text.y(200)
      expect(text.firstChild<TSpan>()!.y()).toEqual(text.y())
    })

    it('should return the value of y on a tspan', () => {
      expect(tspan.y(10).y()).toEqual(10)
    })

    it('should set the y value of the bbox on a tspan', () => {
      tspan.y(123)
      expect(tspan.bbox().y).toEqual(123)
    })
  })

  describe('move()', () => {
    it('should call x() and y() with parameters on text', () => {
      const spyX = spyOn(text, 'x').and.callThrough()
      const spyY = spyOn(text, 'y').and.callThrough()
      const box = new Box()
      text.move(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })

    it('should call x() and y() with parameters on tspan', () => {
      const spyX = spyOn(tspan, 'x').and.callThrough()
      const spyY = spyOn(tspan, 'y').and.callThrough()
      const box = new Box()
      tspan.move(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })
  })

  describe('ax()', () => {
    it('should set the value of x with a percent value with Text', () => {
      text.ax('40%')
      expect(text.node.getAttribute('x')).toEqual('40%')
    })

    it('should return the value of x when x is a percentual value with Text', () => {
      expect(text.ax('40%').ax()).toEqual('40%')
    })

    it('should set the value of x with a percent value with Tspan', () => {
      tspan.ax('40%')
      expect(tspan.node.getAttribute('x')).toEqual('40%')
    })

    it('should return the value of x when x is a percentual value with Tspan', () => {
      tspan.ax('40%')
      expect(tspan.ax()).toEqual('40%')
    })
  })

  describe('ay()', () => {
    it('should set the value of y with a percent value with Text', () => {
      text.ay('40%')
      expect(text.node.getAttribute('y')).toEqual('40%')
    })

    it('should return the value of y when y is a percentual value with Tspan', () => {
      expect(text.ay('45%').ay()).toEqual('45%')
    })

    it('should set the value of y with a percent value with Text', () => {
      tspan.ay('40%')
      expect(tspan.node.getAttribute('y')).toEqual('40%')
    })

    it('should return the value of y when y is a percentual value with Tspan', () => {
      tspan.ay('40%')
      expect(tspan.ay()).toEqual('40%')
    })
  })

  describe('amove()', () => {
    it('should call ax() and ay() with parameters on text', () => {
      const spyX = spyOn(text, 'ax').and.callThrough()
      const spyY = spyOn(text, 'ay').and.callThrough()
      text.amove(1, 2)
      expect(spyX).toHaveBeenCalledWith(1)
      expect(spyY).toHaveBeenCalledWith(2)
    })

    it('should call ax() and ay() with parameters on tspan', () => {
      const spyX = spyOn(tspan, 'ax').and.callThrough()
      const spyY = spyOn(tspan, 'ay').and.callThrough()
      tspan.amove(1, 2)
      expect(spyX).toHaveBeenCalledWith(1)
      expect(spyY).toHaveBeenCalledWith(2)
    })
  })

  describe('cx()', () => {
    it('should return the value of cx on Text', () => {
      const box = text.bbox()
      expect(text.cx()).toBeCloseTo(box.x + box.width / 2)
    })

    it('should set the value of cx on Text', () => {
      text.cx(123)
      const box = text.bbox()
      expect(box.cx).toBeCloseTo(box.x + box.width / 2)
    })

    it('should return the value of cx on Tspan', () => {
      const box = tspan.bbox()
      expect(tspan.cx()).toBeCloseTo(box.x + box.width / 2)
    })

    it('should set the value of cx on Tspan', () => {
      tspan.cx(123)
      const box = tspan.bbox()
      expect(box.cx).toBeCloseTo(box.x + box.width / 2)
    })
  })

  describe('cy()', () => {
    it('should return the value of cy on Tspan', () => {
      const box = tspan.bbox()
      expect(tspan.cy()).toEqual(box.cy)
    })

    it('should set the value of cy on Tspan', () => {
      tspan.cy(345)
      const box = tspan.bbox()
      expect(Math.round(box.cy * 10) / 10).toEqual(345)
    })

    it('should return the value of cy on Tspan', () => {
      const box = tspan.bbox()
      expect(tspan.cy()).toEqual(box.cy)
    })

    it('should set the value of cy on Tspan', () => {
      tspan.cy(345)
      const box = tspan.bbox()
      expect(Math.round(box.cy * 10) / 10).toEqual(345)
    })
  })

  describe('center()', () => {
    it('should call cx() and cy() with parameters on Text', () => {
      const spyX = spyOn(text, 'cx').and.callThrough()
      const spyY = spyOn(text, 'cy').and.callThrough()
      const box = new Box()
      text.center(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })

    it('should call cx() and cy() with parameters on Tspan', () => {
      const spyX = spyOn(tspan, 'cx').and.callThrough()
      const spyY = spyOn(tspan, 'cy').and.callThrough()
      const box = new Box()
      tspan.center(1, 2, box)
      expect(spyX).toHaveBeenCalledWith(1, box)
      expect(spyY).toHaveBeenCalledWith(2, box)
    })
  })

  describe('length()', () => {
    it('should return the text length as number', () => {
      expect(Number.isFinite(text.length())).toBeTrue()
    })

    it('should get the total length of text', () => {
      text.text((t) => {
        t.tspan('The first.')
        t.tspan('The second.')
        t.tspan('The third.')
      })

      expect(text.length()).toBeCloseTo(
        text.get<TSpan>(0)!.length() +
          text.get<TSpan>(1)!.length() +
          text.get<TSpan>(2)!.length(),
        3,
      )
    })

    it('should get total length of tspan', () => {
      tspan.text((add) => {
        add.tspan('The first.')
        add.tspan('The second.')
        add.tspan('The third.')
      })

      expect(tspan.length()).toBeCloseTo(
        tspan.get<TSpan>(0)!.length() +
          tspan.get<TSpan>(1)!.length() +
          tspan.get<TSpan>(2)!.length(),
        3,
      )
    })
  })

  describe('build()', () => {
    it('should enable adding multiple plain text nodes when given true for Text', () => {
      text.clear().build(true)
      text.plain('A great piece!')
      text.plain('Another great piece!')
      expect((text.node.childNodes[0] as any).data).toBe('A great piece!')
      expect((text.node.childNodes[1] as any).data).toBe('Another great piece!')
    })

    it('should enable adding multiple tspan nodes when given true for Text', () => {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.tspan('Another great piece!')
      expect((text.node.childNodes[0].childNodes[0] as any).data).toBe(
        'A great piece!',
      )
      expect((text.node.childNodes[1].childNodes[0] as any).data).toBe(
        'Another great piece!',
      )
    })

    it('should disable adding multiple plain text nodes when given false for Text', () => {
      text.clear().build(true)
      text.plain('A great piece!')
      text.build(false).plain('Another great piece!')
      expect((text.node.childNodes[0] as any).data).toBe('Another great piece!')
      expect(text.node.childNodes[1]).toBeUndefined()
    })

    it('should disable adding multiple tspan nodes when given false for Text', () => {
      text.clear().build(true)
      text.tspan('A great piece!')
      text.build(false).tspan('Another great piece!')
      expect((text.node.childNodes[0].childNodes[0] as any).data).toBe(
        'Another great piece!',
      )
      expect(text.node.childNodes[1]).toBeUndefined()
    })

    it('should enable adding multiple plain text nodes when given true for Tspan', () => {
      tspan.clear().build(true)
      tspan.plain('A great piece!')
      tspan.plain('Another great piece!')
      expect((tspan.node.childNodes[0] as any).data).toBe('A great piece!')
      expect((tspan.node.childNodes[1] as any).data).toBe(
        'Another great piece!',
      )
    })

    it('should enable adding multiple text nodes when given true for Tspan', () => {
      tspan.clear().build(true)
      tspan.tspan('A great piece!')
      tspan.tspan('Another great piece!')
      expect((tspan.node.childNodes[0].childNodes[0] as any).data).toBe(
        'A great piece!',
      )
      expect((tspan.node.childNodes[1].childNodes[0] as any).data).toBe(
        'Another great piece!',
      )
    })

    it('should disable adding multiple plain text nodes when given false for Tspan', () => {
      tspan.clear().build(true)
      tspan.plain('A great piece!')
      tspan.build(false).plain('Another great piece!')
      expect((tspan.node.childNodes[0] as any).data).toBe(
        'Another great piece!',
      )
      expect(tspan.node.childNodes[1]).toBeUndefined()
    })

    it('should disable adding multiple tspan nodes when given false for Tspan', () => {
      tspan.clear().build(true)
      tspan.tspan('A great piece!')
      tspan.build(false).tspan('Another great piece!')
      expect((tspan.node.childNodes[0].childNodes[0] as any).data).toBe(
        'Another great piece!',
      )
      expect(tspan.node.childNodes[1]).toBeUndefined()
    })
  })

  describe('plain()', () => {
    it('should add content without a tspan with Text', () => {
      text.plain('It is a bear!')
      expect(text.node.childNodes[0].nodeType).toEqual(3)
      expect((text.node.childNodes[0] as any).data).toEqual('It is a bear!')
    })

    it('should clear content before adding new content with Text', () => {
      text.plain('It is not a bear!')
      expect(text.node.childNodes.length).toEqual(1)
      expect((text.node.childNodes[0] as any).data).toEqual('It is not a bear!')
    })

    it('should restore the content from the dom with Text', () => {
      text.plain('Just plain text!')
      expect(text.text()).toEqual('Just plain text!')
    })

    it('should add content without a tspan with Tspan', () => {
      tspan.plain('It is a bear!')
      expect(tspan.node.childNodes[0].nodeType).toEqual(3)
      expect((tspan.node.childNodes[0] as any).data).toEqual('It is a bear!')
    })

    it('should clear content before adding new content with Tspan', () => {
      tspan.plain('It is not a bear!')
      expect(tspan.node.childNodes.length).toEqual(1)
      expect((tspan.node.childNodes[0] as any).data).toEqual(
        'It is not a bear!',
      )
    })

    it('should restore the content from the dom with Tspan', () => {
      const tspan = new TSpan().plain('Just plain text!')
      expect(tspan.text()).toEqual('Just plain text!')
    })

    it('should create plain text with container', () => {
      const text1 = svg.plain('Just plain text!', { id: 'foo' })
      const text2 = svg.plain({ id: 'bar' })
      const text3 = svg.plain()

      expect(text1.text()).toEqual('Just plain text!')
      expect(text1.id()).toEqual('foo')

      expect(text2.id()).toEqual('bar')

      expect(text3).toBeInstanceOf(Text)
    })

    it('should create text with container', () => {
      const text1 = svg.text('Just text!', { id: 'foo' })
      const text2 = svg.text({ id: 'bar' })
      const text3 = svg.text()

      expect(text1.text()).toEqual('Just text!')
      expect(text1.id()).toEqual('foo')

      expect(text2.id()).toEqual('bar')

      expect(text3).toBeInstanceOf(Text)
    })
  })
})
