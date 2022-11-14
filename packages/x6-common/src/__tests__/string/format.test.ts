import { StringExt } from '../../string'

describe('String', () => {
  describe('#format', () => {
    it('should return format string', () => {
      const str = 'lives-Down_by the.River'
      expect(StringExt.pascalCase(str)).toBe('LivesDownByTheRiver')
      // expect(StringExt.constantCase(str)).toBe('LIVES_DOWN_BY_THE_RIVER')
      // expect(StringExt.dotCase(str)).toBe('lives.down.by.the.river')
      // expect(StringExt.pathCase(str)).toBe('lives/down/by/the/river')
      // expect(StringExt.sentenceCase(str)).toBe('Lives down by the river')
      // expect(StringExt.titleCase(str)).toBe('Lives Down By The River')
    })
  })
})
