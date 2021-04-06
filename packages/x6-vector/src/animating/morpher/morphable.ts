// eslint-disable-next-line
export class Morphable<TArray extends any[], TValueOf> {
  constructor()
  constructor(arg: any)
  constructor(...args: any[])
  // eslint-disable-next-line
  constructor(...args: any[]) {}
}

export interface Morphable<TArray extends any[], TValueOf> {
  fromArray(arr: TArray): this
  toArray(): TArray
  valueOf(): TValueOf
}
