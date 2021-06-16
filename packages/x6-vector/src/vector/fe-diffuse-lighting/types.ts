import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export { In }

export interface SVGFEDiffuseLightingAttributes
  extends SVGCoreAttributes<SVGFEDiffuseLightingElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  surfaceScale?: number
  diffuseConstant?: number
  kernelUnitLength?: number
}
