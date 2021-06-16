import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'
import { In } from '../fe-blend/types'

export { In }

export type EdgeMode = 'duplicate' | 'wrap' | 'none'

export interface SVGFEGaussianBlurAttributes
  extends SVGCoreAttributes<SVGFEGaussianBlurElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  stdDeviation?: number
  edgeMode?: EdgeMode
}
