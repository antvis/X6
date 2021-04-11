import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGRectAttributes
  extends SVGCommonAttributes<SVGRectElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  rx?: string | number
  ry?: string | number
  pathLength?: number
}
