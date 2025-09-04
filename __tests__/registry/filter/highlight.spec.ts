import { describe, expect, it } from 'vitest'
import {
  type HighlightArgs,
  highlight,
} from '../../../src/registry/filter/highlight'

describe('highlight filter', () => {
  it('should return default filter when no args provided', () => {
    const result = highlight()
    expect(result).toContain('flood-color="red"')
    expect(result).toContain('flood-opacity="1"')
    expect(result).toContain('radius="1"')
    expect(result).toContain('stdDeviation="0"')
    expect(result).toMatchSnapshot()
  })

  it('should apply custom color', () => {
    const args: HighlightArgs = { color: 'blue' }
    const result = highlight(args)
    expect(result).toContain('flood-color="blue"')
    expect(result).toContain('flood-opacity="1"')
  })

  it('should apply custom blur', () => {
    const args: HighlightArgs = { blur: 5 }
    const result = highlight(args)
    expect(result).toContain('stdDeviation="5"')
  })

  it('should apply custom width', () => {
    const args: HighlightArgs = { width: 3 }
    const result = highlight(args)
    expect(result).toContain('radius="3"')
  })

  it('should apply custom opacity', () => {
    const args: HighlightArgs = { opacity: 0.5 }
    const result = highlight(args)
    expect(result).toContain('flood-opacity="0.5"')
  })

  it('should apply multiple custom parameters', () => {
    const args: HighlightArgs = {
      color: 'green',
      blur: 2,
      width: 4,
      opacity: 0.8,
    }
    const result = highlight(args)
    expect(result).toContain('flood-color="green"')
    expect(result).toContain('stdDeviation="2"')
    expect(result).toContain('radius="4"')
    expect(result).toContain('flood-opacity="0.8"')
  })

  it('should handle edge cases for numeric values', () => {
    const args: HighlightArgs = {
      blur: 0,
      width: 0,
      opacity: 0,
    }
    const result = highlight(args)
    expect(result).toContain('stdDeviation="0"')
    expect(result).toContain('radius="0"')
    expect(result).toContain('flood-opacity="0"')
  })

  it('should generate valid SVG filter syntax', () => {
    const result = highlight()
    expect(result).toContain('<filter>')
    expect(result).toContain('</filter>')
    expect(result).toContain('<feFlood')
    expect(result).toContain('<feMorphology')
    expect(result).toContain('<feComposite')
    expect(result).toContain('<feGaussianBlur')
    expect(result).toContain('<feBlend')
  })
})
