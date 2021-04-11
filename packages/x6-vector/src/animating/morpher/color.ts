import { Color } from '../../struct/color'
import { Morphable } from './morphable'

export class MorphableColor
  extends Color
  implements Morphable<Color.RGBA, Color.RGBA> {
  fromArray(arr: Color.RGBA) {
    this.set(...arr)
    return this
  }

  toValue() {
    return this.toArray()
  }
}
