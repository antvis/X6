import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGUseAttributes
  extends SVGCommonAttributes<SVGUseElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes,
    SVGXLinkAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  href?: string
}
