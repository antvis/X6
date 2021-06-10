import { Morphable } from './morphable'
import { Util } from './util'

export class MorphableObject<
  T extends Record<string, any> = Record<string, any>,
> implements Morphable<any[], T>
{
  protected values: any[]

  constructor(input?: any[] | T) {
    if (input != null) {
      if (Array.isArray(input)) {
        this.fromArray(input)
      } else if (typeof input === 'object') {
        const entries: [string, typeof Morphable, number, ...any[]][] = []
        Object.keys(input).forEach((key) => {
          const Type = Util.getClassForType(input[key])
          const val = new Type(input[key]).toArray()
          entries.push([key, Type, val.length, ...val])
        })

        entries.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
        this.values = entries.reduce<any[]>(
          (memo, curr) => memo.concat(curr),
          [],
        )
      }
    }

    if (this.values == null) {
      this.values = []
    }
  }

  fromArray(arr: any[]) {
    this.values = arr.slice()
    return this
  }

  toArray() {
    return this.values.slice()
  }

  toValue(): T {
    const obj: Record<string, any> = {}
    const arr = this.values
    while (arr.length) {
      const key = arr.shift()
      const Type = arr.shift()
      const len = arr.shift()
      const values = arr.splice(0, len)
      obj[key] = new Type().formArray(values).toValue()
    }

    return obj as T
  }
}
