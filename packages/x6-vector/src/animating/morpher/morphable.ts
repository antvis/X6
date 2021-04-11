// eslint-disable-next-line
export class Morphable<TArray extends any[], TValue> {
  constructor()
  constructor(arg: any)
  constructor(...args: any[])
  // eslint-disable-next-line
  constructor(...args: any[]) {}
}

export interface Morphable<TArray extends any[], TValue> {
  fromArray(arr: TArray): this
  toArray(): TArray
  toValue(): TValue
}
