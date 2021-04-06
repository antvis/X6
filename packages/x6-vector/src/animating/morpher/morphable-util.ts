import { Morphable } from './morphable'
import { MorphableBox } from './morphable-box'
import { MorphableColor } from './morphable-color'
import { MorphableMatrix } from './morphable-matrix'
import { MorphableObject } from './morphable-object'
import { MorphableFallback } from './morphable-fallback'
import { MorphablePathArray } from './morphable-path-array'
import { MorphablePointArray } from './morphable-point-array'
import { MorphableTransform } from './morphable-transform'
import { MorphableUnitNumber } from './morphable-unit-number'
import { MorphableNumberArray } from './morphable-number-array'

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
