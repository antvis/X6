import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFETurbulenceAttributes
  extends SVGCoreAttributes<SVGFETurbulenceElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  baseFrequency?: number
  numOctaves?: number
  seed?: number
  stitchTiles?: 'noStitch' | 'stitch'
  type?: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'
}
