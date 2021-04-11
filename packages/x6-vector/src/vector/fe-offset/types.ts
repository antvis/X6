import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEOffsetAttributes
  extends SVGCoreAttributes<SVGFEOffsetElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  dx?: number | string
  dy?: number | string
}
