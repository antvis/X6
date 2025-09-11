import { describe, expect, it, vi } from 'vitest'
import {
  darken,
  hex2rgb,
  hsla2rgba,
  hue2rgb,
  invert,
  lighten,
  lum,
  named,
  randomHex,
  rgb2hex,
  rgba2hsla,
} from '../../../src/common/color'

describe('named colors', () => {
  it('should contain standard color names', () => {
    expect(named.red).toBe('#ff0000')
    expect(named.blue).toBe('#0000ff')
    expect(named.green).toBe('#008000')
    expect(named.white).toBe('#ffffff')
    expect(named.black).toBe('#000000')
  })
})

describe('hue2rgb', () => {
  it('should handle h < 0', () => {
    const result = hue2rgb(0.2, 0.8, -0.5)
    expect(result).toBe(0.8)
  })

  it('should handle h > 1', () => {
    const result = hue2rgb(0.2, 0.8, 1.5)
    expect(result).toBe(0.8)
  })

  it('should handle h6 < 1', () => {
    const result = hue2rgb(0.2, 0.8, 0.1)
    expect(result).toBe(0.56)
  })

  it('should handle 2*h < 1', () => {
    const result = hue2rgb(0.2, 0.8, 0.4)
    expect(result).toBe(0.8)
  })

  it('should handle 3*h < 2', () => {
    const result = hue2rgb(0.2, 0.8, 0.6)
    expect(result).toBeCloseTo(0.44)
  })

  it('should return m1 for other cases', () => {
    const result = hue2rgb(0.2, 0.8, 0.8)
    expect(result).toBe(0.2)
  })
})

describe('rgba2hsla', () => {
  it('should convert rgba array to hsla', () => {
    const result = rgba2hsla([255, 0, 0, 1])
    expect(result).toEqual([0, -1.007905138339921, 127.5, 1])
  })

  it('should convert rgba parameters to hsla', () => {
    const result = rgba2hsla(255, 0, 0, 1)
    expect(result).toEqual([0, -1.007905138339921, 127.5, 1])
  })

  it('should handle grayscale colors', () => {
    const result = rgba2hsla(128, 128, 128, 0.5)
    expect(result).toEqual([0, 0, 128, 0.5])
  })

  it('should handle green max case', () => {
    const result = rgba2hsla(0, 255, 0, 1)
    expect(result[0]).toBeCloseTo(0.3333, 4)
  })

  it('should handle blue max case', () => {
    const result = rgba2hsla(0, 0, 255, 1)
    expect(result[0]).toBeCloseTo(0.6667, 4)
  })

  it('should handle g < b case for red max', () => {
    const result = rgba2hsla(255, 0, 128, 1)
    expect(result[0]).toBeCloseTo(0.9163, 4)
  })

  it('should default alpha to 1 when not provided', () => {
    const result = rgba2hsla(255, 0, 0)
    expect(result[3]).toBe(1)
  })
})

describe('hsla2rgba', () => {
  it('should convert hsla array to rgba', () => {
    const result = hsla2rgba([0, 1, 0.5, 1])
    expect(result[0]).toBeCloseTo(256, 0)
    expect(result[1]).toBeCloseTo(0, 0)
    expect(result[2]).toBeCloseTo(0, 0)
    expect(result[3]).toBe(1)
  })

  it('should convert hsla parameters to rgba', () => {
    const result = hsla2rgba(0, 1, 0.5, 1)
    expect(result[0]).toBeCloseTo(256, 0)
    expect(result[1]).toBeCloseTo(0, 0)
    expect(result[2]).toBeCloseTo(0, 0)
    expect(result[3]).toBe(1)
  })

  it('should handle l > 0.5 case', () => {
    const result = hsla2rgba(0, 0.5, 0.8, 1)
    expect(result).toBeDefined()
  })

  it('should default alpha to 1 when not provided', () => {
    const result = hsla2rgba(0, 1, 0.5)
    expect(result[3]).toBe(1)
  })
})

describe('randomHex', () => {
  it('should generate random hex color', () => {
    const mathSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const result = randomHex()
    expect(result).toBe('#888888')
    mathSpy.mockRestore()
  })

  it('should always start with #', () => {
    const result = randomHex()
    expect(result).toMatch(/^#[0-9A-F]{6}$/)
  })
})

describe('invert', () => {
  it('should invert hex color string with #', () => {
    const result = invert('#ff0000', false)
    expect(result).toBe('#00ffff')
  })

  it('should invert hex color string without #', () => {
    const result = invert('ff0000', false)
    expect(result).toBe('00ffff')
  })

  it('should return black/white for hex when bw=true (bright color)', () => {
    const result = invert('#ffffff', true)
    expect(result).toBe('#000000')
  })

  it('should return black/white for hex when bw=true (dark color)', () => {
    const result = invert('#000000', true)
    expect(result).toBe('#ffffff')
  })

  it('should invert rgba array', () => {
    const result = invert([255, 0, 0, 1], false)
    expect(result).toEqual([0, 255, 255, 1])
  })

  it('should return black/white for rgba when bw=true (bright)', () => {
    const result = invert([255, 255, 255, 0.5], true)
    expect(result).toEqual([0, 0, 0, 0.5])
  })

  it('should return black/white for rgba when bw=true (dark)', () => {
    const result = invert([0, 0, 0, 0.5], true)
    expect(result).toEqual([255, 255, 255, 0.5])
  })
})

describe('hex2rgb', () => {
  it('should convert 6-digit hex to rgb', () => {
    const result = hex2rgb('#ff0000')
    expect(result).toEqual([255, 0, 0])
  })

  it('should convert 6-digit hex without # to rgb', () => {
    const result = hex2rgb('ff0000')
    expect(result).toEqual([255, 0, 0])
  })

  it('should convert 3-digit hex to rgb', () => {
    const result = hex2rgb('#f00')
    expect(result).toEqual([255, 0, 0])
  })

  it('should throw error for invalid hex length', () => {
    expect(() => hex2rgb('#ff00')).toThrow('Invalid hex color.')
  })

  it('should throw error for invalid hex characters', () => {
    expect(() => hex2rgb('#gggggg')).toThrow('Invalid hex color.')
  })
})

describe('rgb2hex', () => {
  it('should convert rgb to hex', () => {
    const result = rgb2hex(255, 0, 0)
    expect(result).toBe('ff0000')
  })

  it('should pad single digit values', () => {
    const result = rgb2hex(1, 2, 3)
    expect(result).toBe('010203')
  })
})

describe('lum', () => {
  it('should adjust luminosity of hex string with #', () => {
    const result = lum('#808080', 50)
    expect(typeof result).toBe('string')
    expect(result).toMatch(/^#/)
  })

  it('should adjust luminosity of hex string without #', () => {
    const result = lum('808080', 50)
    expect(typeof result).toBe('string')
    expect(result).not.toMatch(/^#/)
  })

  it('should clamp values at boundaries', () => {
    const result = lum('#ffffff', 50)
    expect(result).toBe('#ffffff')
  })

  it('should adjust luminosity of rgba array', () => {
    const result = lum([128, 128, 128, 0.5], 50)
    expect(Array.isArray(result)).toBe(true)
    expect((result as number[])[3]).toBe(0.5)
  })

  it('should handle negative adjustments', () => {
    const result = lum([200, 200, 200, 1], -50)
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('lighten', () => {
  it('should lighten hex color', () => {
    const result = lighten('#808080', 50)
    expect(typeof result).toBe('string')
  })

  it('should lighten rgba color', () => {
    const result = lighten([128, 128, 128, 1], 50)
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('darken', () => {
  it('should darken hex color', () => {
    const result = darken('#808080', 50)
    expect(typeof result).toBe('string')
  })

  it('should darken rgba color', () => {
    const result = darken([128, 128, 128, 1], 50)
    expect(Array.isArray(result)).toBe(true)
  })
})
