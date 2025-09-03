import { describe, expect, it } from 'vitest'
import { html } from '../../../src/registry/attr/html'

describe('Html attribute', () => {
  it('should set element innerHTML', () => {
    const elem = document.createElement('div')
    const testHtml = '<span>test</span>'

    html.set(testHtml, { elem })

    expect(elem.innerHTML).toBe(testHtml)
  })

  it('should convert non-string values to string', () => {
    const elem = document.createElement('div')
    const testValue = 123

    html.set(testValue, { elem })

    expect(elem.innerHTML).toBe('123')
  })
})
