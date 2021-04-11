import { Box } from '../../struct/box'
import { Morphable } from './morphable'

export class MorphableBox
  extends Box
  implements Morphable<Box.BoxArray, Box.BoxArray> {
  fromArray(arr: Box.BoxArray) {
    this.x = arr[0]
    this.y = arr[0]
    this.width = arr[0]
    this.height = arr[0]
    return this
  }

  toValue() {
    return this.toArray()
  }
}
