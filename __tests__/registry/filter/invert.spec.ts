import { describe, expect, it } from 'vitest'
import { type InvertArgs, invert } from '../../../src/registry/filter/invert'

describe('invert filter', () => {
  it('should return default invert filter when no arguments provided', () => {
    const result = invert()
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })

  it('should return full invert filter when amount is 1', () => {
    const args: InvertArgs = { amount: 1 }
    const result = invert(args)
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })

  it('should return partial invert filter when amount is 0.5', () => {
    const args: InvertArgs = { amount: 0.5 }
    const result = invert(args)
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.5 0.5"/>
          <feFuncG type="table" tableValues="0.5 0.5"/>
          <feFuncB type="table" tableValues="0.5 0.5"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })

  it('should return no invert filter when amount is 0', () => {
    const args: InvertArgs = { amount: 0 }
    const result = invert(args)
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0 1"/>
          <feFuncG type="table" tableValues="0 1"/>
          <feFuncB type="table" tableValues="0 1"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })

  it('should handle undefined amount by using default value', () => {
    const args: InvertArgs = { amount: undefined }
    const result = invert(args)
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })

  it('should handle null amount by using default value', () => {
    const args = { amount: null } as unknown as InvertArgs
    const result = invert(args)
    const expected = `<filter>
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>`

    expect(result.replace(/\s+/g, ' ').trim()).toEqual(
      expected.replace(/\s+/g, ' ').trim(),
    )
  })
})
