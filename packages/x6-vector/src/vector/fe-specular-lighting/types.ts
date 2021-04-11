import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFESpecularLightingAttributes
  extends SVGCoreAttributes<SVGFESpecularLightingElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  surfaceScale?: number
  specularConstant?: number
  specularExponent?: number
  kernelUnitLength?: number
}
