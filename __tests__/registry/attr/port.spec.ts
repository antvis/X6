import { describe, expect, it } from 'vitest'
import { port } from '../../../src/registry/attr/port'

describe('Port attribute', () => {
  it('should return string value directly', () => {
    expect(port.set('8080')).toBe('8080')
    expect(port.set('3000')).toBe('3000')
  })

  it('should extract id from port object', () => {
    expect(port.set({ id: '8080' })).toBe('8080')
    expect(port.set({ id: '3000', otherProp: 'value' })).toBe('3000')
  })

  it('should handle null/undefined values', () => {
    expect(port.set(null)).toBeNull()
    expect(port.set(undefined)).toBeUndefined()
  })
})
