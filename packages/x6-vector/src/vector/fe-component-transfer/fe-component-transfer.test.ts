import { FEFuncA } from '../fe-func-a/fe-func-a'
import { FEFuncB } from '../fe-func-b/fe-func-b'
import { FEFuncG } from '../fe-func-g/fe-func-g'
import { FEFuncR } from '../fe-func-r/fe-func-r'
import { Filter } from '../filter/filter'
import { FEComponentTransfer } from './fe-component-transfer'

describe('FeBlend', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEComponentTransfer.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feComponentTransfer()).toBeInstanceOf(FEComponentTransfer)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feComponentTransfer({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('feFuncA()', () => {
    it('should create an instance of FEFuncA', () => {
      const fe = new FEComponentTransfer()
      const fun = fe.feFuncA()
      expect(fun).toBeInstanceOf(FEFuncA)
    })

    it('should create an instance of FEFuncA with given attributes', () => {
      const fe = new FEComponentTransfer()
      const light = fe.feFuncA({ id: 'bar' })
      expect(light).toBeInstanceOf(FEFuncA)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('feFuncB()', () => {
    it('should create an instance of FEFuncB', () => {
      const fe = new FEComponentTransfer()
      const fun = fe.feFuncB()
      expect(fun).toBeInstanceOf(FEFuncB)
    })

    it('should create an instance of FEFuncB with given attributes', () => {
      const fe = new FEComponentTransfer()
      const light = fe.feFuncB({ id: 'bar' })
      expect(light).toBeInstanceOf(FEFuncB)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('feFuncG()', () => {
    it('should create an instance of FEFuncG', () => {
      const fe = new FEComponentTransfer()
      const fun = fe.feFuncG()
      expect(fun).toBeInstanceOf(FEFuncG)
    })

    it('should create an instance of FEFuncG with given attributes', () => {
      const fe = new FEComponentTransfer()
      const light = fe.feFuncG({ id: 'bar' })
      expect(light).toBeInstanceOf(FEFuncG)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('feFuncR()', () => {
    it('should create an instance of FEFuncR', () => {
      const fe = new FEComponentTransfer()
      const fun = fe.feFuncR()
      expect(fun).toBeInstanceOf(FEFuncR)
    })

    it('should create an instance of FEFuncR with given attributes', () => {
      const fe = new FEComponentTransfer()
      const light = fe.feFuncR({ id: 'bar' })
      expect(light).toBeInstanceOf(FEFuncR)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEComponentTransfer()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })
})
