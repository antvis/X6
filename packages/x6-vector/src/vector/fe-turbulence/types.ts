import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export type StitchTiles = 'noStitch' | 'stitch'

export type Type = 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'

export interface SVGFETurbulenceAttributes
  extends SVGCoreAttributes<SVGFETurbulenceElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  baseFrequency?: number
  numOctaves?: number
  seed?: number
  type?: Type
  stitchTiles?: StitchTiles
}
