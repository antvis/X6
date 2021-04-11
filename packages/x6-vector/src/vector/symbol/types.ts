import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
} from '../types/attributes-core'

export interface SVGSymbolAttributes
  extends SVGCommonAttributes<SVGSymbolElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  viewBox?: string
  refX?: string | number
  refY?: string | number
  preserveAspectRatio?: string
}
