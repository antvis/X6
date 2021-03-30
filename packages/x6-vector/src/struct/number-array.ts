import { TArray } from './tarray'

export class NumberArray extends TArray<number> {
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
