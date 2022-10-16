import { Dom } from '../../dom'

describe('Dom', () => {
  describe('#setPrefixedStyle', () => {
    it('should return prefixed attr', () => {
      const style = {}
      Dom.setPrefixedStyle(style, 'userDrag', 'true')
      expect(style).toEqual({
        userDrag: 'true',
        webkitUserDrag: 'true',
      })
    })

    describe('#hasScrollbars', () => {
      const container = document.createElement('div')

      beforeAll(() => {
        container.style.overflow = 'auto'
        document.body.appendChild(container)
      })

      afterAll(() => {
        document.body.removeChild(container)
      })

      it('should return true with an elem has scrollbar', () => {
        expect(Dom.hasScrollbars(container)).toBeTruthy()
        container.style.overflow = 'scroll'
        expect(Dom.hasScrollbars(container)).toBeTruthy()
        container.style.overflow = 'hidden'
        expect(Dom.hasScrollbars(container)).toBeFalsy()
      })
    })
  })
})
