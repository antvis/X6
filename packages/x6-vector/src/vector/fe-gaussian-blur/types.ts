import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEGaussianBlurAttributes
  extends SVGCoreAttributes<SVGFEGaussianBlurElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  stdDeviation?: number
  edgeMode?: 'duplicate' | 'wrap' | 'none'
}
