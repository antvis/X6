import { ObjUtil } from '../util/obj'

export class SVGArray<T = number> {
  constructor()
  constructor(arrayLength: number)
  constructor(arrayString: string)
  constructor(items: T[])
  constructor(instance: SVGArray<T>)
  constructor(...args: any[]) {
    if (args.length === 0) {
      return
    }

    if (args.length === 1 && typeof args[0] === 'number') {
      this.length = args[0]
      return
    }

    this.push(...this.parse(args.length === 1 ? args[0] : args))
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
    return new Set(this.toArray())
  }
}

export interface SVGArray<T = number> extends Array<T> {}

export namespace SVGArray {
  ObjUtil.applyMixins(SVGArray, Array)

  SVGArray.prototype.valueOf = function () {
    return this.toArray()
  }

  SVGArray.prototype.toString = function () {
    return this.join(' ')
  }
}
