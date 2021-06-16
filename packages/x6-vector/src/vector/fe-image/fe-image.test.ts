import { Filter } from '../filter/filter'
import { FEImage } from './fe-image'

describe('FEImage', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEImage.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feImage()).toBeInstanceOf(FEImage)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feImage({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('href()', () => {
    it('should set `xlink:href` attribute', () => {
      const fe = new FEImage()
      const url = '/files/6457/mdn_logo_only_color.png'
      fe.href(url)
      expect(fe.href()).toEqual(url)
      expect(fe.attr('xlink:href')).toEqual(url)
    })
  })

  describe('preserveAspectRatio()', () => {
    it('should set preserveAspectRatio attribute', () => {
      const fe = new FEImage()
      fe.preserveAspectRatio('xMidYMid meet')
      expect(fe.preserveAspectRatio()).toEqual('xMidYMid meet')
      expect(fe.attr('preserveAspectRatio')).toEqual('xMidYMid meet')
    })
  })
})
