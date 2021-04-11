import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFECompositeAttributes
  extends SVGCoreAttributes<SVGFECompositeElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  in2?: string
  operator: 'over' | 'in' | 'out' | 'atop' | 'xor' | 'lighter' | 'arithmetic'
  k1?: number
  k2?: number
  k3?: number
  k4?: number
}
