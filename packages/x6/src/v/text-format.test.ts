import { v } from './v'

describe('v', () => {
  describe('#annotateString', () => {
    it('should cut string into pieces and attributed according to the spans', () => {
      const annotations = v.annotateString(
        'This is a text that goes on multiple lines.',
        [
          { start: 2, end: 5, attrs: { fill: 'red' } },
          { start: 4, end: 8, attrs: { fill: 'blue' } },
        ],
      )
      expect(annotations).toEqual([
        'Th',
        { t: 'is', attrs: { fill: 'red' } },
        { t: ' is ', attrs: { fill: 'blue' } },
        'a text that goes on multiple lines.',
      ])
    })

    it('should cut string into pieces and attributed according to the annotations including concatenated classes', () => {
      const annotations = v.annotateString('abcdefgh', [
        { start: 1, end: 3, attrs: { class: 'one' } },
        { start: 2, end: 5, attrs: { class: 'two', fill: 'blue' } },
      ])
      expect(annotations).toEqual([
        'a',
        { t: 'b', attrs: { class: 'one' } },
        { t: 'c', attrs: { class: 'one two', fill: 'blue' } },
        { t: 'de', attrs: { class: 'two', fill: 'blue' } },
        'fgh',
      ])
    })

    it('should cut string into pieces and attributed according to the annotations including concatenated classes', () => {
      const annotations = v.annotateString(
        'abcdefgh',
        [
          { start: 1, end: 3, attrs: { class: 'one' } },
          { start: 2, end: 5, attrs: { class: 'two', fill: 'blue' } },
        ],
        { includeAnnotationIndices: true },
      )

      expect(annotations).toEqual([
        'a',
        { t: 'b', attrs: { class: 'one' }, annotations: [0] },
        {
          t: 'c',
          attrs: { class: 'one two', fill: 'blue' },
          annotations: [0, 1],
        },
        { t: 'de', attrs: { class: 'two', fill: 'blue' }, annotations: [1] },
        'fgh',
      ])
    })
  })
})
