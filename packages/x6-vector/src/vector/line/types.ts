import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGLineAttributes
  extends SVGCommonAttributes<SVGLineElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  x1?: string | number
  y1?: string | number
  x2?: string | number
  y2?: string | number
  pathLength?: number
}
