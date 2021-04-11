import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'
import { BlendMode } from '../fe-blend/types'

export interface SVGFEColorMatrixAttributes
  extends SVGCoreAttributes<SVGFEColorMatrixElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  type?: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'
  values?: BlendMode
}
