import { Dom } from '../dom'
import { ClassName } from './classname'

describe('Dom', () => {
  describe('classname', () => {
    let elem: Dom<HTMLDivElement>

    beforeEach(() => {
      elem = new Dom<HTMLDivElement>('div').addClass('foo bar')
    })

    describe('classes()', () => {
      it('should return sorted classnames', () => {
        expect(elem.classes()).toEqual(['bar', 'foo'])
      })
    })

    describe('hasClass()', () => {
      it('should return `false` when given classname is null or empty', () => {
        expect(elem.hasClass('')).toBeFalse()
        expect(elem.hasClass(null as any)).toBeFalse()
        expect(elem.hasClass(undefined as any)).toBeFalse()
        expect(ClassName.has(null, null)).toBeFalse()
        expect(ClassName.has(null, undefined)).toBeFalse()
      })

      it('should return `false` when the node is invalid', () => {
        const text = document.createTextNode('text')
        ClassName.add(text as any, 'test')
        expect(ClassName.has(text as any, 'test')).toBeFalse()
      })

      it('should return `true` when contains the given classname', () => {
        expect(elem.hasClass('foo')).toBeTrue()
        expect(elem.hasClass('bar')).toBeTrue()
      })

      it('should return `false` when do not contains the given classname', () => {
        expect(elem.hasClass('fo')).toBeFalse()
        expect(elem.hasClass('ba')).toBeFalse()
      })

      it('should return `true` when contains the given classnames', () => {
        expect(elem.hasClass('foo bar')).toBeTrue()
        expect(elem.hasClass('bar foo')).toBeTrue()
      })

      it('should return `false` when do not contains the given classnames', () => {
        expect(elem.hasClass('foo bar 0')).toBeFalse()
        expect(elem.hasClass('bar foo 1')).toBeFalse()
      })
    })

    describe('addClass()', () => {
      it('should do nothing for invalid class', () => {
        elem.addClass(null as any)
        elem.addClass(undefined as any)
        expect(elem.attr('class')).toEqual('foo bar')
      })

      it('should add single class', () => {
        elem.addClass('test')
        expect(elem.hasClass('test')).toBeTrue()
      })

      it('should add an array of classes', () => {
        elem.addClass(['test1', 'test2'])
        expect(elem.hasClass('foo')).toBeTrue()
        expect(elem.hasClass('bar')).toBeTrue()
        expect(elem.hasClass('test1')).toBeTrue()
        expect(elem.hasClass('test2')).toBeTrue()
      })

      it('should add an multi classes with string', () => {
        elem.addClass('test1 test2')
        expect(elem.hasClass('bar')).toBeTrue()
        expect(elem.hasClass('foo')).toBeTrue()
        expect(elem.hasClass('test1')).toBeTrue()
        expect(elem.hasClass('test2')).toBeTrue()
      })

      it('should not add the same class twice in same element', () => {
        elem.addClass('foo').addClass('foo')
        expect(elem.attr('class')).toEqual('foo bar')
        elem.addClass('foo foo')
        expect(elem.attr('class')).toEqual('foo bar')
      })

      it('should not add empty string', () => {
        elem.addClass('test')
        elem.addClass(' ')
        expect(elem.attr('class')).toEqual('foo bar test')
      })

      it('should call hook', () => {
        elem.removeClass().addClass('test')
        elem.addClass((cls) => `${cls} foo`)
        expect(elem.attr('class')).toEqual('test foo')
      })
    })

    describe('removeClass()', () => {
      it('should do nothing for invalid node', () => {
        ClassName.remove(null)
      })

      it('should remove one', () => {
        elem.removeClass('foo test')
        expect(elem.attr('class')).toEqual('bar')
      })

      it('should remove an array of classes', () => {
        elem.addClass('test').removeClass(['foo', 'test'])
        expect(elem.attr('class')).toEqual('bar')
      })

      it('should remove all', () => {
        elem.removeClass()
        expect(elem.attr('class')).toEqual('')

        elem.addClass('test foo')
        elem.removeClass(null as any)
        expect(elem.attr('class')).toEqual('')
      })

      it('should call hook', () => {
        elem.removeClass((cls) => cls.split(' ')[1])
        expect(elem.attr('class')).toEqual('foo')
      })
    })

    describe('toggleClass()', () => {
      it('should do nothing for invalid class', () => {
        elem.toggleClass('test')
        elem.toggleClass(null as any)
        elem.toggleClass(undefined as any)
        expect(elem.attr('class')).toEqual('foo bar')
      })

      it('should toggle class', () => {
        elem.removeClass()

        elem.toggleClass('foo bar')
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass('foo')
        expect(elem.attr('class')).toEqual('bar')

        elem.toggleClass('foo')
        expect(elem.attr('class')).toEqual('bar foo')
      })

      it('should not toggle empty strings', () => {
        elem.removeClass()

        elem.toggleClass('foo bar')
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass(' ')
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass(' ')
        expect(elem.attr('class')).toEqual('foo bar')
      })

      it('should work with the specified next state', () => {
        elem.removeClass()

        elem.toggleClass('foo bar')
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass('foo', true)
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass('foo', true)
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass('foo', false)
        expect(elem.attr('class')).toEqual('bar')
      })

      it('should call hook', () => {
        elem.removeClass()

        elem.toggleClass(() => 'foo bar')
        expect(elem.attr('class')).toEqual('foo bar')

        elem.toggleClass(() => 'foo', false)
        expect(elem.attr('class')).toEqual('bar')
      })
    })
  })
})
