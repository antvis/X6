import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGXLinkAttributes,
} from '../types/attributes-core'

export interface SVGStopAttributes
  extends SVGCoreAttributes<SVGStopElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes {
  offset?: string | number
  stopColor?: string
  stopOpacity?: number
}

export interface SVGRadialGradientAttributes
  extends SVGCoreAttributes<SVGRadialGradientElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGXLinkAttributes {
  cx?: string | number
  cy?: string | number
  fr?: string | number
  fx?: string | number
  fy?: string | number
  r?: string | number
  href?: string
  gradientTransform?: string
  spreadMethod?: 'pad' | 'reflect' | 'repeat'
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}

export interface SVGLinearGradientAttributes
  extends SVGCoreAttributes<SVGLinearGradientElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGXLinkAttributes {
  x1?: string | number
  y1?: string | number
  x2?: string | number
  y2?: string | number
  href?: string
  gradientTransform?: string
  spreadMethod?: 'pad' | 'reflect' | 'repeat'
  gradientUnits?: 'userSpaceOnUse' | 'objectBoundingBox'
}
