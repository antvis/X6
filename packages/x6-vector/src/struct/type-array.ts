import { applyMixins } from '../util'

export abstract class TypeArray<T, I = any> {
  constructor()
  constructor(arrayLength: number)
  constructor(arrayString: string)
  constructor(items: T[] | I)
  constructor(instance: TypeArray<T, I>)
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

  abstract parse(raw?: I | T[]): T[]

  clone(): this {
    const Ctor = this.constructor as any
    return new Ctor(this.toArray())
  }

  toArray(): T[] {
    return [...this]
  }

  toSet() {
    return new Set(this.toArray())
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypeArray<T, I> extends Array<T> {}

export namespace TypeArray {
  applyMixins(TypeArray as any, Array)

  TypeArray.prototype.valueOf = function () {
    return this.toArray()
  }

  TypeArray.prototype.toString = function () {
    return this.join(' ')
  }
}
