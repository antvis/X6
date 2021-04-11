import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGPolygonAttributes
  extends SVGCommonAttributes<SVGPolygonElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  points?: string
  pathLength?: number
  requiredExtensions?: string
  systemLanguage?: string
}
