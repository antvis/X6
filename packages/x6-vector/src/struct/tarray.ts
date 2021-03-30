import { Obj } from '../util/obj'

export abstract class TArray<T, I = any> {
  constructor()
  constructor(arrayLength: number)
  constructor(arrayString: string)
  constructor(items: T[] | I)
  constructor(instance: TArray<T, I>)
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

  abstract parse(raw?: string | T[]): T[]

  clone() {
    const ctor = this.constructor as new (instance: T[]) => TArray<T>
    return new ctor(this.toArray()) // eslint-disable-line new-cap
  }

  toArray(): T[] {
    return [...this]
  }

  toSet() {
    return new Set(this.toArray())
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TArray<T, I> extends Array<T> {}

export namespace TArray {
  Obj.applyMixins(TArray as any, Array)

  TArray.prototype.valueOf = function () {
    return this.toArray()
  }

  TArray.prototype.toString = function () {
    return this.join(' ')
  }
}
