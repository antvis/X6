import { Stylesheet } from './stylesheet'
import { EdgeStyle } from './edgestyle'
import { Perimeter } from './perimeter'
import { constants } from '../common'

export namespace StyleRegistry {
  export const values: { [name: string]: Stylesheet.Styles } = {}

  export function register(name: string, obj: Stylesheet.Styles) {
    values[name] = obj
  }

  export function getValue(name: string) {
    return values[name]
  }

  export function getName(value: Stylesheet.Styles) {
    for (const key in values) {
      if (values[key] === value) {
        return key
      }
    }

    return null
  }
}

StyleRegistry.register(constants.EDGESTYLE_ELBOW, EdgeStyle.elbowConnector)
StyleRegistry.register(constants.EDGESTYLE_ENTITY_RELATION, EdgeStyle.entityRelation)
StyleRegistry.register(constants.EDGESTYLE_LOOP, EdgeStyle.loop)
StyleRegistry.register(constants.EDGESTYLE_SIDETOSIDE, EdgeStyle.sideToSide)
StyleRegistry.register(constants.EDGESTYLE_TOPTOBOTTOM, EdgeStyle.topToBottom)
StyleRegistry.register(constants.EDGESTYLE_ORTHOGONAL, EdgeStyle.orthConnector)
StyleRegistry.register(constants.EDGESTYLE_SEGMENT, EdgeStyle.segmentConnector)

StyleRegistry.register(constants.PERIMETER_ELLIPSE, Perimeter.ellipse)
StyleRegistry.register(constants.PERIMETER_RECTANGLE, Perimeter.rectangle)
StyleRegistry.register(constants.PERIMETER_RHOMBUS, Perimeter.rhombus)
StyleRegistry.register(constants.PERIMETER_TRIANGLE, Perimeter.triangle)
StyleRegistry.register(constants.PERIMETER_HEXAGON, Perimeter.hexagon)
