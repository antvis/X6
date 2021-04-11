import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEDiffuseLightingAttributes
  extends SVGCoreAttributes<SVGFEDiffuseLightingElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  surfaceScale?: number
  diffuseConstant?: number
  kernelUnitLength?: number
}
