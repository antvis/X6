import { EdgeStyle } from './edgestyle'
import { Perimeter } from './perimeter'
import { EdgeType, Perimeters } from '../struct'

export namespace StyleRegistry {
  export const values: { [name: string]: any } = {}

  export function register(name: string, obj: any) {
    values[name] = obj
  }

  export function getValue(name: string) {
    return values[name]
  }

  export function getName(value: any) {
    for (const key in values) {
      if (values[key] === value) {
        return key
      }
    }

    return null
  }
}

StyleRegistry.register(EdgeType.elbow, EdgeStyle.elbowConnector)
StyleRegistry.register(EdgeType.entityRelation, EdgeStyle.entityRelation)
StyleRegistry.register(EdgeType.loop, EdgeStyle.loop)
StyleRegistry.register(EdgeType.sideToSide, EdgeStyle.sideToSide)
StyleRegistry.register(EdgeType.topToBottom, EdgeStyle.topToBottom)
StyleRegistry.register(EdgeType.orthogonal, EdgeStyle.orthConnector)
StyleRegistry.register(EdgeType.segment, EdgeStyle.segmentConnector)

StyleRegistry.register(Perimeters.ellipse, Perimeter.ellipse)
StyleRegistry.register(Perimeters.rectangle, Perimeter.rectangle)
StyleRegistry.register(Perimeters.rhombus, Perimeter.rhombus)
StyleRegistry.register(Perimeters.triangle, Perimeter.triangle)
StyleRegistry.register(Perimeters.hexagon, Perimeter.hexagon)
