import { describe, expect, it } from 'vitest'
import { Config } from '../../src/config'

describe('Config', () => {
  it('should have default prefixCls', () => {
    expect(Config.prefixCls).toBe('x6')
  })

  it('should have autoInsertCSS as true', () => {
    expect(Config.autoInsertCSS).toBe(true)
  })

  it('should have useCSSSelector as true', () => {
    expect(Config.useCSSSelector).toBe(true)
  })

  it('should prefix suffix correctly', () => {
    expect(Config.prefix('test')).toBe('x6-test')
    expect(Config.prefix('container')).toBe('x6-container')
    expect(Config.prefix('')).toBe('x6-')
  })

  it('should reflect changes to prefixCls in prefix method', () => {
    const originalPrefixCls = Config.prefixCls
    Config.prefixCls = 'custom'
    expect(Config.prefix('item')).toBe('custom-item')
    Config.prefixCls = originalPrefixCls // restore
  })
})
