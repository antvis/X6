import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGPathAttributes
  extends SVGCommonAttributes<SVGPathElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  d?: string
  pathLength?: string | number
}
