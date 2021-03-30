export class UNumber implements UNumber.UNumberLike {
  public value: number
  public unit: string

  constructor()
  constructor(
    value: number | string | UNumber.UNumberLike | null | undefined,
    unit?: string,
  )
  constructor(array: [number | string, string?])
  constructor(arg1?: UNumber.Raw, arg2?: string) {
    const value = Array.isArray(arg1) ? arg1[0] : arg1
    const unit = Array.isArray(arg1) ? arg1[1] : arg2

    this.value = 0
    this.unit = unit || ''

    if (value != null) {
      if (typeof value === 'number') {
        this.value = UNumber.normalizeNumber(value)
      } else if (typeof value === 'string') {
        const matches = value.match(
          /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([%a-z]*)$/i,
        )
        if (matches) {
          this.value = Number.parseFloat(matches[1])
          this.unit = matches[5]

          // normalize
          if (this.unit === '%') {
            this.value /= 100
          } else if (this.unit === 's') {
            this.value *= 1000
          }
        }
      } else if (typeof value === 'object') {
        this.value = value.value
        this.unit = value.unit
      }
    }
  }

  minus(number: UNumber.Raw) {
    const input = UNumber.create(number)
    return new UNumber(this.value - input.value, this.unit || input.unit)
  }

  plus(number: UNumber.Raw) {
    const input = UNumber.create(number)
    return new UNumber(this.value + input.value, this.unit || input.unit)
  }

  times(number: UNumber.Raw) {
    const input = UNumber.create(number)
    return new UNumber(this.value * input.value, this.unit || input.unit)
  }

  divide(number: UNumber.Raw) {
    const input = UNumber.create(number)
    return new UNumber(this.value / input.value, this.unit || input.unit)
  }

  convert(unit: string) {
    return new UNumber(this.value, unit)
  }

  toArray(): UNumber.SVGNumberArray {
    return [this.value, this.unit]
  }

  toJSON(): UNumber.UNumberLike {
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

export namespace UNumber {
  export type Raw =
    | undefined
    | null
    | number
    | string
    | UNumberLike
    | [number | string, string?]

  export interface UNumberLike {
    value: number
    unit: string
  }

  export type SVGNumberArray = [number, string]

  export function create(): UNumber
  export function create(number: number, unit?: string): UNumber
  export function create(number: Raw): UNumber
  export function create(number?: Raw, unit?: string) {
    return Array.isArray(number)
      ? new UNumber(number[0], number[1])
      : new UNumber(number, unit)
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

  export function normalizeNumber(v: number) {
    return Number.isNaN(v)
      ? 0
      : !Number.isFinite(v)
      ? v < 0
        ? -3.4e38
        : +3.4e38
      : v
  }

  export function toNumber(v: number | string) {
    return typeof v === 'number' ? normalizeNumber(v) : create(v).valueOf()
  }
}
