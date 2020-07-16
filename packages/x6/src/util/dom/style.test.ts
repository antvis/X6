import { setPrefixedStyle, hasScrollbars } from './style'

describe('Dom', () => {
  describe('#setPrefixedStyle', () => {
    it('should return prefixed attr', () => {
      const style = {}
      setPrefixedStyle(style, 'userDrag', 'true')
      expect(style).toEqual({
        userDrag: 'true',
        WebkitUserDrag: 'true',
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
        expect(hasScrollbars(container)).toBeTruthy()
        container.style.overflow = 'scroll'
        expect(hasScrollbars(container)).toBeTruthy()
        container.style.overflow = 'hidden'
        expect(hasScrollbars(container)).toBeFalsy()
      })
    })
  })
})
