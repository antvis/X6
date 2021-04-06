export class UnitNumber implements UnitNumber.UnitNumberLike {
  public value: number
  public unit: string

  constructor()
  constructor(
    value: number | string | UnitNumber.UnitNumberLike | null | undefined,
    unit?: string,
  )
  constructor(array: [number | string, string?])
  constructor(arg1?: UnitNumber.Raw, arg2?: string) {
    const value = Array.isArray(arg1) ? arg1[0] : arg1
    const unit = Array.isArray(arg1) ? arg1[1] : arg2

    this.value = 0
    this.unit = unit || ''

    if (value != null) {
      if (typeof value === 'number') {
        this.value = UnitNumber.normalize(value)
      } else if (typeof value === 'string') {
        const obj = UnitNumber.parse(value)
        if (obj) {
          this.value = obj.value
          this.unit = obj.unit
        }
      } else if (typeof value === 'object') {
        this.value = value.value
        this.unit = value.unit
      }
    }
  }

  minus(number: UnitNumber.Raw) {
    const input = UnitNumber.create(number)
    return new UnitNumber(this.value - input.value, this.unit || input.unit)
  }

  plus(number: UnitNumber.Raw) {
    const input = UnitNumber.create(number)
    return new UnitNumber(this.value + input.value, this.unit || input.unit)
  }

  times(number: UnitNumber.Raw) {
    const input = UnitNumber.create(number)
    return new UnitNumber(this.value * input.value, this.unit || input.unit)
  }

  divide(number: UnitNumber.Raw) {
    const input = UnitNumber.create(number)
    return new UnitNumber(this.value / input.value, this.unit || input.unit)
  }

  convert(unit: string) {
    return new UnitNumber(this.value, unit)
  }

  toArray(): UnitNumber.UnitNumberArray {
    return [this.value, this.unit]
  }

  toJSON(): UnitNumber.UnitNumberLike {
    return { value: this.value, unit: this.unit }
  }

  toString() {
    const value =
      this.unit === '%'
        ? Math.trunc(this.value * 1e8) / 1e6
        : this.unit === 's'
        ? this.value / 1e3
        : this.value

    return `${value}${this.unit}`
  }

  valueOf() {
    return this.value
  }
}

export namespace UnitNumber {
  export type Raw =
    | undefined
    | null
    | number
    | string
    | UnitNumberLike
    | [number | string, string?]

  export interface UnitNumberLike {
    value: number
    unit: string
  }

  export type UnitNumberArray = [number, string]

  export function create(): UnitNumber
  export function create(number: number, unit?: string): UnitNumber
  export function create(number: Raw): UnitNumber
  export function create(number?: Raw, unit?: string) {
    return Array.isArray(number)
      ? new UnitNumber(number[0], number[1])
      : new UnitNumber(number, unit)
  }

  export function plus(left: Raw, right: Raw) {
    if (typeof left === 'number' && typeof right === 'number') {
      return left + right
    }
    return create(left).plus(right).toString()
  }

  export function minus(left: Raw, right: Raw) {
    if (typeof left === 'number' && typeof right === 'number') {
      return left - right
    }
    return create(left).minus(right).toString()
  }

  export function times(left: Raw, right: Raw) {
    if (typeof left === 'number' && typeof right === 'number') {
      return left * right
    }
    return create(left).times(right).toString()
  }

  export function divide(left: Raw, right: Raw) {
    if (typeof left === 'number' && typeof right === 'number') {
      return left / right
    }
    return create(left).divide(right).toString()
  }

  export function normalize(v: number) {
    return Number.isNaN(v)
      ? 0
      : !Number.isFinite(v)
      ? v < 0
        ? -3.4e38
        : +3.4e38
      : v
  }

  export const REGEX_NUMBER_UNIT = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

  export function parse(str: string): UnitNumberLike | null {
    const matches = str.match(REGEX_NUMBER_UNIT)
    if (matches) {
      let value = normalize(Number.parseFloat(matches[1]))
      const unit = matches[5] || ''

      // normalize
      if (unit === '%') {
        value /= 100
      } else if (unit === 's') {
        value *= 1000
      }
      return { value, unit }
    }
    return null
  }

  export function toNumber(v: number | string) {
    return typeof v === 'number' ? normalize(v) : create(v).valueOf()
  }
}
