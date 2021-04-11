import { NumberArray } from '../../struct/number-array'
import { Morphable } from './morphable'

export class MorphableNumberArray
  extends NumberArray
  implements Morphable<number[], number[]> {
  fromArray(arr: number[]) {
    this.length = 0
    this.push(...arr)
    return this
  }

  toValue() {
    return this.toArray()
  }
}
