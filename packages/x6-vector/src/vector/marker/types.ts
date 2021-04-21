import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export type MarkerType = 'start' | 'end' | 'mid' | 'all'
export type MarkerUnits = 'userSpaceOnUse' | 'objectBoundingBox'
export type MarkerOrient = 'auto' | 'auto-start-reverse' | number
export type MarkerRefX = 'left' | 'center' | 'right' | number
export type MarkerRefY = 'top' | 'center' | 'bottom' | number

export interface SVGMarkerAttributes
  extends SVGCommonAttributes<SVGMarkerElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  markerHeight?: string | number
  markerWidth?: string | number
  markerUnits?: MarkerUnits
  orient?: MarkerOrient
  preserveAspectRatio?: string
  refX?: MarkerRefX
  refY?: MarkerRefY
  viewBox?: string
}
