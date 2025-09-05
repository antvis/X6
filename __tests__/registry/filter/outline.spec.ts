import { describe, expect, it } from 'vitest'
import { outline } from '../../../src/registry/filter/outline'

describe('outline filter', () => {
  it('should return default outline filter with default parameters', () => {
    const result = outline()

    expect(result).toContain('flood-color="blue"')
    expect(result).toContain('flood-opacity="1"')
    expect(result).toContain('radius="2"')
    expect(result).toContain('radius="3"')
    expect(result).toContain('<feMergeNode in="SourceGraphic"/>')
    expect(result).toMatch(/<filter>[\s\S]*<\/filter>/)
  })

  it('should use custom color when provided', () => {
    const result = outline({ color: 'red' })

    expect(result).toContain('flood-color="red"')
    expect(result).toContain('flood-opacity="1"')
  })

  it('should use custom width when provided', () => {
    const result = outline({ width: 3 })

    expect(result).toContain('radius="2"')
    expect(result).toContain('radius="5"')
  })

  it('should use custom margin when provided', () => {
    const result = outline({ margin: 5 })

    expect(result).toContain('radius="5"')
    expect(result).toContain('radius="6"')
  })

  it('should use custom opacity when provided', () => {
    const result = outline({ opacity: 0.5 })

    expect(result).toContain('flood-opacity="0.5"')
  })

  it('should handle multiple custom parameters', () => {
    const result = outline({
      color: 'green',
      width: 2,
      margin: 3,
      opacity: 0.8,
    })

    expect(result).toContain('flood-color="green"')
    expect(result).toContain('flood-opacity="0.8"')
    expect(result).toContain('radius="3"')
    expect(result).toContain('radius="5"')
  })

  it('should return valid SVG filter structure', () => {
    const result = outline()

    expect(result).toMatch(/^<filter>[\s\S]*<\/filter>$/)
    expect(result).toContain('<feFlood')
    expect(result).toContain('<feMorphology')
    expect(result).toContain('<feComposite')
    expect(result).toContain('<feMerge>')
  })
})
