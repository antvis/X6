import { TypeArray } from './type-array'

export class NumberArray extends TypeArray<number> {
  parse(raw: string | number[] = []): number[] {
    if (Array.isArray(raw)) {
      return raw
    }

    return raw
      .trim()
      .split(/[\s,]+/)
      .map((s) => Number.parseFloat(s))
  }
}
