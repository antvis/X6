import { getSpellingSuggestion } from './suggestion'

describe('String', () => {
  describe('#getSpellingSuggestion', () => {
    it('should return the best suggestion', () => {
      let candidates: string[] = ['asurance', 'assurance', 'assurances']
      expect(
        getSpellingSuggestion(
          'assurance',
          candidates,
          (candidate) => candidate,
        ),
      ).toBe('asurance')

      candidates = ['aransue', 'assurance', 'assurances']
      expect(
        getSpellingSuggestion(
          'assurance',
          candidates,
          (candidate) => candidate,
        ),
      ).toBe('assurances')
    })
  })
})
