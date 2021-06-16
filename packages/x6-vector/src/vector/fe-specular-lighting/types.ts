import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export { In }

export interface SVGFESpecularLightingAttributes
  extends SVGCoreAttributes<SVGFESpecularLightingElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  surfaceScale?: number
  specularConstant?: number
  specularExponent?: number
  kernelUnitLength?: number
}
