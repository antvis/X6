import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
} from '../types/attributes-core'

export interface SVGDefsAttributes
  extends SVGCoreAttributes<SVGDefsElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes {}
