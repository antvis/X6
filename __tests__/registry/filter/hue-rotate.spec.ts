import { describe, expect, it } from 'vitest'
import { hueRotate } from '../../../src/registry/filter/hue-rotate'

describe('hueRotate', () => {
  it('should return default filter with angle 0 when no arguments provided', () => {
    const result = hueRotate()
    expect(result).toBe(
      `
      <filter>
        <feColorMatrix type="hueRotate" values="0"/>
      </filter>
    `.trim(),
    )
  })

  it('should return filter with specified angle', () => {
    const result = hueRotate({ angle: 90 })
    expect(result).toBe(
      `
      <filter>
        <feColorMatrix type="hueRotate" values="90"/>
      </filter>
    `.trim(),
    )
  })

  it('should handle angle as 0', () => {
    const result = hueRotate({ angle: 0 })
    expect(result).toBe(
      `
      <filter>
        <feColorMatrix type="hueRotate" values="0"/>
      </filter>
    `.trim(),
    )
  })

  it('should handle negative angles', () => {
    const result = hueRotate({ angle: -45 })
    expect(result).toBe(
      `
      <filter>
        <feColorMatrix type="hueRotate" values="-45"/>
      </filter>
    `.trim(),
    )
  })

  it('should handle decimal angles', () => {
    const result = hueRotate({ angle: 45.5 })
    expect(result).toBe(
      `
      <filter>
        <feColorMatrix type="hueRotate" values="45.5"/>
      </filter>
    `.trim(),
    )
  })
})
