import { describe, expect, it } from 'vitest'
import { dropShadow } from '../../../src/registry/filter/drop-shadow'

describe('dropShadow', () => {
  it('应该使用默认参数生成正确的SVG filter', () => {
    const result = dropShadow()
    expect(result).toContain('<filter>')
    expect(result).toContain('</filter>')

    expect(result).toContain('dx="0"')
    expect(result).toContain('dy="0"')
    expect(result).toContain('flood-color="black"')
    expect(result).toContain('stdDeviation="4"')

    if ('SVGFEDropShadowElement' in window) {
      expect(result).toContain('flood-opacity="1"')
    } else {
      expect(result).toContain('slope="1"')
    }
  })

  it('应该正确处理所有自定义参数', () => {
    const args = {
      dx: 10,
      dy: -5,
      color: 'red',
      blur: 8,
      opacity: 0.5,
    }
    const result = dropShadow(args)

    expect(result).toContain('dx="10"')
    expect(result).toContain('dy="-5"')
    expect(result).toContain('flood-color="red"')
    expect(result).toContain('stdDeviation="8"')

    if ('SVGFEDropShadowElement' in window) {
      expect(result).toContain('flood-opacity="0.5"')
      expect(result).toContain('feDropShadow')
    } else {
      expect(result).toContain('slope="0.5"')
      expect(result).toContain('feComponentTransfer')
      expect(result).toContain('feFuncA')
    }
  })

  it('应该处理部分参数缺失的情况', () => {
    const result = dropShadow({ dx: 15, color: 'blue' })
    expect(result).toContain('dx="15"')
    expect(result).toContain('dy="0"')
    expect(result).toContain('flood-color="blue"')
    expect(result).toContain('stdDeviation="4"')

    if ('SVGFEDropShadowElement' in window) {
      expect(result).toContain('flood-opacity="1"')
    } else {
      expect(result).toContain('slope="1"')
    }
  })

  it('应该根据浏览器支持返回不同的SVG结构', () => {
    const result = dropShadow()

    if ('SVGFEDropShadowElement' in window) {
      expect(result).toContain('feDropShadow')
      expect(result).not.toContain('feGaussianBlur')
    } else {
      expect(result).toContain('feGaussianBlur')
      expect(result).toContain('feOffset')
      expect(result).toContain('feFlood')
      expect(result).toContain('feComponentTransfer')
      expect(result).not.toContain('feDropShadow')
    }
  })

  it('应该返回trimmed的字符串', () => {
    const result = dropShadow()

    expect(result).not.toMatch(/^\s/)
    expect(result).not.toMatch(/\s$/)
  })
})
