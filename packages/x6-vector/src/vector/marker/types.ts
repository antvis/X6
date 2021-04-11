import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGMarkerAttributes
  extends SVGCommonAttributes<SVGMarkerElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  markerHeight?: string | number
  markerWidth?: string | number
  markerUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
  orient?: 'auto' | 'auto-start-reverse' | number
  preserveAspectRatio?: string
  refX?: 'left' | 'center' | 'right' | number
  refY?: 'top' | 'center' | 'bottom' | number
  viewBox?: string
}
