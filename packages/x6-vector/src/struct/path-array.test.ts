import { Box } from './box'
import { PathArray } from './path-array'

describe('PathArray', () => {
  let p1: PathArray
  let p2: PathArray
  let p3: PathArray

  beforeEach(() => {
    p1 = new PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')
    p2 = new PathArray(
      'm10 80 c 40 10 65 10 95 80 s 150 150 180 80 t 300 300 q 52 10 95 80 z',
    )
    p3 = new PathArray('m80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 z')
  })

  describe('constructor()', () => {
    it('should parse flat arrays correctly', () => {
      const arr = new PathArray(['M', 0, 0, 'L', 100, 100, 'z'])
      expect(arr.toString()).toBe('M0 0L100 100Z')
    })

    it('should parse nested arrays correctly', () => {
      const arr = new PathArray([['M', 0, 0], ['L', 100, 100], ['z']])
      expect(arr.toString()).toBe('M0 0L100 100Z')
    })
  })

  describe('move()', () => {
    it('should move all points in a straight path', () => {
      expect(p1.move(100, 200).toString()).toBe('M100 200H180V280H100L400 680Z')
    })

    it('should move all points in a curved path', () => {
      expect(p2.move(100, 200).toString()).toBe(
        'M100 200C140 210 165 210 195 280S345 430 375 360T675 660Q727 670 770 740Z',
      )
    })

    it('should move all points in a arc path', () => {
      expect(p3.move(100, 200).toString()).toBe(
        'M100 200A45 45 0 0 0 145 245L145 200Z',
      )
    })

    it('should do nothing if passed number is not a number', () => {
      expect(p3.move()).toEqual(p3)
    })
  })

  describe('size()', () => {
    it('should resize all points in a straight path', () => {
      expect(p1.size(600, 200).toString()).toBe(
        'M10 10H170V43.333333333333336H10L610 210Z',
      )
    })

    it('should resize all points in a curved path', () => {
      expect(p2.size(600, 200).toString()).toBe(
        'M10 80C45.82089552238806 83.70370370370371 68.2089552238806 83.70370370370371 95.07462686567165 109.62962962962963S229.40298507462686 165.1851851851852 256.2686567164179 139.25925925925927T524.9253731343283 250.37037037037038Q571.4925373134329 254.07407407407408 610 280Z',
      )
    })

    it('should resize all points in a arc path', () => {
      const expected = [
        ['M', 80, 80],
        ['A', 600, 200, 0, 0, 0, 680, 280],
        ['L', 680, 80],
        ['Z'],
      ]

      p3.size(600, 200).forEach((item, index) => {
        expect(item[0].toUpperCase()).toBe(
          (expected[index][0] as string).toUpperCase(),
        )

        for (let j = item.length - 1; j > 0; j -= 1) {
          expect(item[j]).toBeCloseTo(expected[index][j] as number)
        }
      })
    })
  })

  describe('bbox()', () => {
    it('should calculate the bounding box of the PathArray', () => {
      const box = new PathArray('M0 0 L 10 10').bbox()
      expect(box).toEqual(new Box(0, 0, 10, 10))
    })
  })
})
