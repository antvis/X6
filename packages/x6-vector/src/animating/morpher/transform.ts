import { Morphable } from './morphable'

export class MorphableTransform
  implements Morphable<MorphableTransform.Array, MorphableTransform.Array> {
  scaleX: number
  scaleY: number
  shear: number
  rotate: number
  translateX: number
  translateY: number
  originX: number
  originY: number

  fromArray(arr: MorphableTransform.Array) {
    const obj = {
      scaleX: arr[0],
      scaleY: arr[1],
      shear: arr[2],
      rotate: arr[3],
      translateX: arr[4],
      translateY: arr[5],
      originX: arr[6],
      originY: arr[7],
    }
    Object.assign(this, MorphableTransform.defaults, obj)
    return this
  }

  toArray(): MorphableTransform.Array {
    return [
      this.scaleX,
      this.scaleY,
      this.shear,
      this.rotate,
      this.translateX,
      this.translateY,
      this.originX,
      this.originY,
    ]
  }

  toValue(): MorphableTransform.Array {
    return this.toArray()
  }
}

export namespace MorphableTransform {
  export const defaults = {
    scaleX: 1,
    scaleY: 1,
    shear: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0,
  }

  export type Array = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
}
