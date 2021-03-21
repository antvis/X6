import {
  pascalCase,
  constantCase,
  dotCase,
  pathCase,
  sentenceCase,
  titleCase,
} from './format'

describe('String', () => {
  describe('#format', () => {
    it('should return format string', () => {
      const str = 'lives-Down_by the.River'
      expect(pascalCase(str)).toBe('LivesDownByTheRiver')
      expect(constantCase(str)).toBe('LIVES_DOWN_BY_THE_RIVER')
      expect(dotCase(str)).toBe('lives.down.by.the.river')
      expect(pathCase(str)).toBe('lives/down/by/the/river')
      expect(sentenceCase(str)).toBe('Lives down by the river')
      expect(titleCase(str)).toBe('Lives Down By The River')
    })
  })
})
