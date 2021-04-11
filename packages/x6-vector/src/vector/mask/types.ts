import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGMaskAttributes
  extends SVGCoreAttributes<SVGMaskElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  markerUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  maskContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
