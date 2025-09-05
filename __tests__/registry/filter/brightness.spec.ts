import { describe, expect, it } from 'vitest'
import {
  type BrightnessArgs,
  brightness,
} from '../../../src/registry/filter/brightness'

describe('brightness filter', () => {
  describe('brightness function', () => {
    it('should return default filter when no arguments provided', () => {
      const result = brightness()
      expect(result).toContain('<filter>')
      expect(result).toContain('<feComponentTransfer>')
      expect(result).toContain('slope="1"')
    })

    it('should return filter with custom amount', () => {
      const args: BrightnessArgs = { amount: 0.5 }
      const result = brightness(args)
      expect(result).toContain('slope="0.5"')
    })

    it('should handle amount of 0', () => {
      const args: BrightnessArgs = { amount: 0 }
      const result = brightness(args)
      expect(result).toContain('slope="0"')
    })

    it('should handle amount greater than 1', () => {
      const args: BrightnessArgs = { amount: 2 }
      const result = brightness(args)
      expect(result).toContain('slope="2"')
    })

    it('should use default amount when amount is null', () => {
      const args: BrightnessArgs = { amount: null as any }
      const result = brightness(args)
      expect(result).toContain('slope="1"')
    })

    it('should use default amount when amount is undefined', () => {
      const args: BrightnessArgs = { amount: undefined }
      const result = brightness(args)
      expect(result).toContain('slope="1"')
    })

    it('should use default amount when amount is NaN', () => {
      const args: BrightnessArgs = { amount: NaN }
      const result = brightness(args)
      expect(result).toContain('slope="1"')
    })

    it('should return properly formatted SVG filter string', () => {
      const result = brightness({ amount: 0.8 })
      expect(result).toBe(
        `<filter>
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.8"/>
        <feFuncG type="linear" slope="0.8"/>
        <feFuncB type="linear" slope="0.8"/>
      </feComponentTransfer>
    </filter>`,
      )
    })
  })

  describe('BrightnessArgs interface', () => {
    it('should allow optional amount property', () => {
      const args: BrightnessArgs = {}
      expect(args.amount).toBeUndefined()
    })

    it('should accept number values for amount', () => {
      const args: BrightnessArgs = { amount: 0.7 }
      expect(args.amount).toBe(0.7)
    })
  })
})
