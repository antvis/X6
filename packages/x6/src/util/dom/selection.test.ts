import { clearSelection } from './selection'

describe('Dom', () => {
  describe('#clearSelection', () => {
    const input = document.createElement('input')

    beforeAll(() => {
      input.value = '12345'
      document.body.appendChild(input)
      input.select()
    })

    afterAll(() => {
      document.body.removeChild(input)
    })

    it('should clear input selection', () => {
      expect(window.getSelection()?.toString()).toBe('12345')
      clearSelection()
      expect(window.getSelection()?.toString()).toBe('')
    })
  })
})
