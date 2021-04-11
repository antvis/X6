import { Morphable } from './morphable'
import { MorphableBox } from './box'
import { MorphableColor } from './color'
import { MorphableMatrix } from './matrix'
import { MorphableObject } from './object'
import { MorphableFallback } from './fallback'
import { MorphablePathArray } from './path-array'
import { MorphablePointArray } from './point-array'
import { MorphableTransform } from './transform'
import { MorphableUnitNumber } from './unit-number'
import { MorphableNumberArray } from './number-array'

export namespace Util {
  const delimiter = /[\s,]+/
  const isPathLetter = /[MLHVCSQTAZ]/i
  const presets = [
    MorphableBox,
    MorphableColor,
    MorphableMatrix,
    MorphableFallback,
    MorphableNumberArray,
    MorphableUnitNumber,
    MorphableObject,
    MorphablePathArray,
    MorphablePointArray,
    MorphableTransform,
  ]

  export function getClassForType(value: any): typeof Morphable {
    const type = typeof value

    if (type === 'number') {
      return MorphableUnitNumber
    }

    if (type === 'string') {
      if (MorphableColor.isColor(value)) {
        return MorphableColor
      }

      if (delimiter.test(value)) {
        return isPathLetter.test(value)
          ? MorphablePathArray
          : MorphableNumberArray
      }

      if (MorphableUnitNumber.REGEX_NUMBER_UNIT.test(value)) {
        return MorphableUnitNumber
      }

      return MorphableFallback as any
    }

    if (presets.includes(value.constructor)) {
      return value.constructor as typeof Morphable
    }

    if (Array.isArray(value)) {
      return MorphableNumberArray
    }

    if (type === 'object') {
      return MorphableObject
    }

    return MorphableFallback as any
  }
}
