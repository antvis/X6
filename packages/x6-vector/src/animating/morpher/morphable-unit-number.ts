import { UNumber } from '../../struct/unumber'
import { Morphable } from './morphable'

export class MorphableUnitNumber
  extends UNumber
  implements Morphable<UNumber.UNumberArray, number> {
  fromArray(arr: UNumber.UNumberArray) {
    this.unit = arr[1] || ''
    if (typeof arr[0] === 'string') {
      const obj = UNumber.parse(arr[0])
      if (obj) {
        this.value = obj.value
        this.unit = obj.unit
      }
    } else {
      this.value = arr[0]
    }

    return this
  }
}
