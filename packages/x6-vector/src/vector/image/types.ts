import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGImageAttributes
  extends SVGCommonAttributes<SVGImageElement>,
    SVGStyleAttributes,
    SVGXLinkAttributes,
    SVGPresentationAttributes,
    SVGConditionalProcessingAttributes {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  href?: string
  preserveAspectRatio?: string
  crossorigin?: string
}
