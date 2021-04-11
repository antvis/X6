import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGFilterAttributes
  extends SVGCoreAttributes<SVGFilterElement>,
    SVGStyleAttributes,
    SVGXLinkAttributes,
    SVGPresentationAttributes,
    SVGConditionalProcessingAttributes {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  filterRes?: string
  filterUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  primitiveUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
