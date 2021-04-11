import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGForeignObjectAttributes
  extends SVGCommonAttributes<SVGForeignObjectElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
}
