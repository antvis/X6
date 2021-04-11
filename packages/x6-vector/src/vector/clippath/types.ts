import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGClipPathAttributes
  extends SVGCoreAttributes<SVGClipPathElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  /**
   * Defines the coordinate system for the contents of the `<clipPath>` element.
   */
  clipPathUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
