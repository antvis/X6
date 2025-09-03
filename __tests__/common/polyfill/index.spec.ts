import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { forEachPolyfill } from '../../../src/common/polyfill'

describe('forEachPolyfill', () => {
  it('forEachPolyfill return null', () => {
    expect(forEachPolyfill([])).toBe(undefined)
  })

  it('after forEachPolyfill, arr contains append', () => {
    const a = [[], []]
    // @ts-expect-error
    expect(a[0].append).toBeUndefined()
    forEachPolyfill(a)
    // @ts-expect-error
    expect(a[0].append).toBeDefined()
    // @ts-expect-error
    expect(typeof a[0].append).toBe('function')
  })
})
