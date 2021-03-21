export class SVGArray<T = number> extends Array<T> {
  constructor(arrayLength: number)
  constructor(arrayString: string)
  constructor(items: T[])
  constructor(instance: SVGArray<T>)
  constructor(...args: any[]) {
    if (args.length === 1 && typeof args[0] === 'number') {
      super(args[0])
    } else {
      super()
      this.length = 0
      if (args.length === 1) {
        this.push(...this.parse(args[0]))
      } else {
        this.push(...this.parse(args))
      }
    }
  }

  parse(raw: string | T[] = []): T[] {
    if (Array.isArray(raw)) {
      return raw
    }

    return raw
      .trim()
      .split(/[\s,]+/)
      .map((s) => Number.parseFloat(s)) as any
  }

  clone() {
    const ctor = this.constructor as new (instance: SVGArray<T>) => SVGArray<T>
    return new ctor(this) // eslint-disable-line new-cap
  }

  toArray(): T[] {
    return [...this]
  }

  toSet() {
    return new Set(this)
  }

  toString() {
    return this.join(' ')
  }

  valueOf() {
    return this.toArray()
  }
}
