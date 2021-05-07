import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export type FilterUnits = 'userSpaceOnUse' | 'objectBoundingBox'
export type PrimitiveUnits = 'userSpaceOnUse' | 'objectBoundingBox'

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
  filterUnits?: FilterUnits
  primitiveUnits?: PrimitiveUnits
}
