import { Dom } from '../../../src/common/dom'

describe('Dom', () => {
  describe('#clearSelection', () => {
    it('should clear div selection', () => {
      const div = document.createElement('div')
      div.textContent = '12345'
      document.body.appendChild(div)

      const range = document.createRange()
      range.selectNodeContents(div)
      window.getSelection()?.addRange(range)

      expect(window.getSelection()?.toString()).toBe('12345')

      Dom.clearSelection()

      expect(window.getSelection()?.toString()).toBe('')
      document.body.removeChild(div)
    })
  })
})
