import type { Path } from '../../vector/path/path'
import { PathArray } from '../../struct/path-array'
import { Morphable } from './morphable'

export class MorphablePathArray
  extends PathArray
  implements Morphable<Path.Segment[], Path.Segment[]>
{
  fromArray(arr: any[]) {
    this.length = 0
    this.push(...this.parse(arr))
    return this
  }

  toValue() {
    return this.toArray()
  }
}
