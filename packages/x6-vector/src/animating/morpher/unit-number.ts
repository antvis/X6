import { UnitNumber } from '../../struct/unit-number'
import { Morphable } from './morphable'

export class MorphableUnitNumber
  extends UnitNumber
  implements Morphable<UnitNumber.UnitNumberArray, UnitNumber.UnitNumberArray>
{
  fromArray(arr: UnitNumber.UnitNumberArray) {
    this.unit = arr[1] || ''
    if (typeof arr[0] === 'string') {
      const obj = UnitNumber.parse(arr[0])
      if (obj) {
        this.value = obj.value
        this.unit = obj.unit
      }
    } else {
      this.value = arr[0]
    }

    return this
  }

  toValue() {
    return this.toArray()
  }
}
