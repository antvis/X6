import { PointArray } from '../../struct/point-array'
import { Morphable } from './morphable'

export class MorphablePointArray
  extends PointArray
  implements Morphable<[number, number][], [number, number][]> {
  fromArray(arr: any[]) {
    this.length = 0
    this.push(...this.parse(arr))
    return this
  }

  toValue() {
    return this.toArray()
  }
}
