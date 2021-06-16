import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'
import { In } from '../fe-blend/types'

export { In }

export type EdgeMode = 'duplicate' | 'wrap' | 'none'

export interface SVGFEConvolveMatrixAttributes
  extends SVGCoreAttributes<SVGFEConvolveMatrixElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  order?: number
  kernelMatrix?: string
  divisor?: number
  bias?: number
  targetX?: number
  targetY?: number
  edgeMode?: EdgeMode
  kernelUnitLength?: number
  preserveAlpha?: boolean
}
