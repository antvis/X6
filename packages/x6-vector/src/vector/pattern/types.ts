import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGPatternAttributes
  extends SVGCoreAttributes<SVGPatternElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes,
    SVGXLinkAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  href?: string
  patternUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  patternContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  patternTransform?: string
  preserveAspectRatio?: string
  viewBox?: string
}
