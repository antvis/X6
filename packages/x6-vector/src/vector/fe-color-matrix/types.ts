import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export type Type = 'matrix' | 'saturate' | 'hueRotate' | 'luminanceToAlpha'

export interface SVGFEColorMatrixAttributes
  extends SVGCoreAttributes<SVGFEColorMatrixElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  type?: Type
  values?: string
}

export { In }
