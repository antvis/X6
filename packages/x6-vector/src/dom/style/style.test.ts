import { Dom } from '../dom'
import { Hook } from './hook'

describe('Dom', () => {
  describe('css', () => {
    function withCSSContext(css: string, callback: () => void) {
      const head = document.head || document.getElementsByTagName('head')[0]
      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      head.appendChild(style)

      const elem = style as any
      if (elem.styleSheet) {
        // This is required for IE8 and below.
        elem.styleSheet.cssText = css
      } else {
        style.appendChild(document.createTextNode(css))
      }
      callback()
      style.parentNode?.removeChild(style)
    }

    describe('css()', () => {
      it('should set style with style name-value', () => {
        const div = new Dom('div')
        div.css('border', '1px')
        expect(div.node.getAttribute('style')).toEqual('border: 1px;')
      })

      it('should set style with style cameCase name-value', () => {
        const div = new Dom('div')
        div.css('borderLeft', '1px')
        expect(div.node.getAttribute('style')).toEqual('border-left: 1px;')
      })

      it('should auto add unit when set style with style name-value', () => {
        const div = new Dom('div')
        div.css('border', 1)
        expect(div.node.getAttribute('style')).toEqual('border: 1px;')
      })

      it('should set style with object', () => {
        const div = new Dom('div')
        div.css({ border: 1, fontSize: 12 })
        expect(div.node.getAttribute('style')).toEqual(
          'border: 1px; font-size: 12px;',
        )
      })

      it('should get style by styleName', () => {
        const div = new Dom('div')
        expect(div.css('border')).toEqual('')
        div.css({ border: 1, fontSize: 12 })
        expect(div.css('border')).toEqual('1px')
        expect(div.css('fontSize')).toEqual('12px')
      })

      it('should get computed style by styleName', () => {
        const body = new Dom(document.body)
        const div = new Dom('div')
        body.css({ fontSize: 18 })
        div.appendTo(body)
        expect(div.css('fontSize', true)).toEqual('18px')
        body.attr('style', null)
        div.remove()
      })

      it('should get computed style by styleNames', () => {
        const body = new Dom(document.body)
        const div = new Dom('div')
        body.css({ fontSize: 18, fontWeight: 500 })
        div.appendTo(body)
        expect(div.css(['fontSize', 'fontWeight'], true)).toEqual({
          fontSize: '18px',
          fontWeight: 500,
        })
        body.attr('style', null)
        div.remove()
      })

      it('should return all inline style', () => {
        const div = new Dom('div')
        div.css({ border: 1, left: 0 })
        expect(div.css()).toEqual({
          left: '0px',
          border: '1px',
        })
      })

      it('should return an empty object when get all style on invalid node', () => {
        const mock = new Dom() as any
        mock.node = {}
        expect(mock.css()).toEqual({})
      })

      it('should return undefined when get style on invalid node', () => {
        const mock = new Dom() as any
        mock.node = {}
        expect(mock.css('foo')).toBeUndefined()
      })

      it('should return style by given style names', () => {
        const div = new Dom('div')
        div.css({ border: 1, left: 0 })
        expect(div.css(['left', 'border'])).toEqual({
          left: '0px',
          border: '1px',
        })
      })

      it('should return all the computed style', () => {
        const div = new Dom('div')
        const body = new Dom(document.body)
        body.css({ fontSize: 18 })
        div.appendTo(body)
        expect(div.css(true).fontSize).toEqual('18px')
        body.attr('style', null)
        div.remove()
      })

      it('should fallback to get inline style if node is not in the document', () => {
        const div = new Dom('div')
        div.css({ fontSize: 18 })
        expect(div.css('fontSize', true)).toEqual('18px')
      })

      it('should try to convert style value to number', () => {
        const div = new Dom('div')
        div.css({ fontWeight: 600 })
        expect(div.css('fontWeight', true)).toEqual(600)
        expect(div.css('fontWeight')).toEqual(600)
      })

      it('should set custom style', () => {
        const div = new Dom('div')
        div.css('--custom-key', '10px')
        expect(div.node.getAttribute('style')).toEqual('--custom-key:10px;')
        div.attr('style', null)
        div.css('--customKey', '10px')
        expect(div.node.getAttribute('style')).toEqual('--custom-key:10px;')
      })

      it('should get custom style', () => {
        const div = new Dom('div')
        div.css({
          fontSize: 18,
          '--custom-key': '10px',
        })
        expect(div.css('--customKey')).toEqual('10px')
        expect(div.css('--custom-key')).toEqual('10px')
        expect(div.css()).toEqual({
          fontSize: '18px',
          '--customKey': '10px',
        } as any)
      })

      it('should not set style on text/comment node', () => {
        const text = new Dom(document.createTextNode('test') as any)
        text.css({ fontSize: 18 })
        expect(text.css('fontSize')).toBeUndefined()
        expect(text.css()).toEqual({})
        expect(text.css(true)).toEqual({})

        const comment = new Dom(document.createComment('test') as any)
        comment.css({ fontSize: 18 })
        expect(comment.css('fontSize')).toBeUndefined()
        expect(comment.css()).toEqual({})
        expect(comment.css(true)).toEqual({})
      })

      it('should handle "float" specialy', () => {
        const div = new Dom('div').appendTo(document.body)
        div.css({ float: 'left' })
        expect(div.css('float', true)).toEqual('left')
        expect(div.css('float')).toEqual('left')
        div.remove()
      })

      it('should auto add browser prefix to style name', () => {
        const div = new Dom('div').appendTo(document.body)
        div.css('userDrag', 'none')
        expect(div.node.getAttribute('style')).toEqual(
          '-webkit-user-drag: none;',
        )
        expect(div.css('userDrag', true)).toEqual('none')
        expect(div.css('userDrag')).toEqual('none')
        div.remove()
      })

      it('should apply hook when get style', () => {
        const div = new Dom('div')
        div.css('fontSize', 18)
        Hook.register('fontSize', {
          get(node, computed) {
            return computed ? 16 : 14
          },
        })
        expect(div.css('fontSize', true)).toEqual(16)
        expect(div.css('fontSize')).toEqual(14)
        Hook.unregister('fontSize')
      })

      it('should apply hook when set style', () => {
        const div = new Dom('div')
        Hook.register('fontSize', {
          set() {
            return 20
          },
        })
        div.css('fontSize', 18)
        expect(div.css('fontSize')).toEqual('20px')
      })
    })

    describe('show()', () => {
      it('should not change the "display" style when it\'s visible', () => {
        const div = new Dom('div')
        div.show()
        expect(div.node.getAttribute('style')).toBeNull()
        expect(div.css('display')).toEqual('')
        expect(div.visible()).toBeTrue()
      })

      it('should show the node', () => {
        const div = new Dom('div')
        div.css('display', 'none')
        div.show()
        expect(div.node.getAttribute('style')).toEqual('')
        expect(div.css('display')).toEqual('')
        expect(div.visible()).toBeTrue()
      })

      it('should recover the old value of "display" style', () => {
        const div = new Dom('div')
        div.css('display', 'inline-block')

        div.hide()
        expect(div.css('display')).toEqual('none')
        expect(div.visible()).toBeFalse()

        div.show()
        expect(div.css('display')).toEqual('inline-block')
        expect(div.visible()).toBeTrue()
      })

      it('should force visible when it was hidden in tree', () => {
        withCSSContext('.hidden { display: none; }', () => {
          const div = new Dom('div').appendTo(document.body)
          div.addClass('hidden')
          expect(div.visible()).toBeFalse()
          div.show()
          expect(div.visible()).toBeTrue()
          expect(div.css('display')).toEqual('block')
          div.remove()
        })
      })
    })

    describe('hide()', () => {
      it('should hide the node', () => {
        const div = new Dom('div')
        div.hide()
        expect(div.css('display')).toEqual('none')
        expect(div.visible()).toBeFalse()
        div.show()
        expect(div.css('display')).toEqual('')
        expect(div.visible()).toBeTrue()
      })

      it('should do nothing for invalid node', () => {
        const mock = new Dom() as any
        mock.node = {}
        expect(() => mock.hide()).not.toThrowError()
      })
    })

    describe('visible()', () => {
      it('should return false when it was hidden in tree', () => {
        withCSSContext('.hidden { display: none; }', () => {
          const div = new Dom('div').appendTo(document.body)
          div.addClass('hidden')
          expect(div.visible()).toBeFalse()

          div.removeClass('hidden')
          expect(div.visible()).toBeTrue()

          div.addClass('hidden')
          expect(div.visible()).toBeFalse()

          div.toggle()
          expect(div.visible()).toBeTrue()
          div.toggle()
          expect(div.visible()).toBeFalse()

          div.remove()
        })
      })
    })

    describe('toggle()', () => {
      it('should toggle visible state of node', () => {
        const div = new Dom('div')
        div.toggle()
        expect(div.css('display')).toEqual('none')
        expect(div.visible()).toBeFalse()
        div.toggle()
        expect(div.css('display')).toEqual('')
        expect(div.visible()).toBeTrue()
      })

      it('should set visible state of node', () => {
        const div = new Dom('div')
        div.hide()
        div.toggle(false)
        expect(div.css('display')).toEqual('none')
        expect(div.visible()).toBeFalse()

        div.toggle(true)
        expect(div.css('display')).toEqual('')
        expect(div.visible()).toBeTrue()
      })
    })
  })
})
