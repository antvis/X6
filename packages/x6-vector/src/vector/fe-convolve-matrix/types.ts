import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEConvolveMatrixAttributes
  extends SVGCoreAttributes<SVGFEConvolveMatrixElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  order?: number
  kernelMatrix?: string
  divisor?: number
  bias?: number
  targetX?: number
  targetY?: number
  edgeMode?: 'duplicate' | 'wrap' | 'none'
  kernelUnitLength?: number
  preserveAlpha?: boolean
}
