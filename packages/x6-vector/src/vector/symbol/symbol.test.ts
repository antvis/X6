import { G } from '../g/g'
import { Symbol } from './symbol'

describe('Symbol', () => {
  describe('constructor()', () => {
    it('should create a new object of type Symbol', () => {
      expect(Symbol.create()).toBeInstanceOf(Symbol)
    })

    it('should create an instance with given attributes', () => {
      expect(Symbol.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from container element', () => {
      expect(new G().symbol()).toBeInstanceOf(Symbol)
    })
  })
})
