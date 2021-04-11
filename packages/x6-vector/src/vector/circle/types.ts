import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGCircleAttributes
  extends SVGCommonAttributes<SVGCircleElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  cx?: string | number
  cy?: string | number
  r?: string | number
  pathLength?: number
  requiredExtensions?: string
  systemLanguage?: string
}
