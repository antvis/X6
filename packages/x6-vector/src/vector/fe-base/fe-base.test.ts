import { Filter } from '../filter/filter'
import { FeBlend } from '../fe-blend/fe-blend'

describe('FeBase', () => {
  describe('filter()', () => {
    it('should return null when element not appended to filter', () => {
      expect(FeBlend.create().filter()).toBeNull()
    })

    it('should return the parent filter element', () => {
      const filter = new Filter()
      expect(filter.feBlend().filter()).toEqual(filter)
    })
  })
})
