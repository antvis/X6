import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGEllipseAttributes
  extends SVGCommonAttributes<SVGEllipseElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  cx?: string | number
  cy?: string | number
  r?: string | number
  pathLength?: number
}
