import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEDisplacementMapAttributes
  extends SVGCoreAttributes<SVGFEDisplacementMapElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  in2?: string
  scale?: number
  xChannelSelector?: 'R' | 'G' | 'B' | 'A'
  yChannelSelector?: 'R' | 'G' | 'B' | 'A'
}
