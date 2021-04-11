import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGFEImageAttributes
  extends SVGCoreAttributes<SVGFEImageElement>,
    SVGStyleAttributes,
    SVGXLinkAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes,
    SVGConditionalProcessingAttributes {
  preserveAspectRatio?: string
}
