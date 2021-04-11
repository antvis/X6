import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

export interface SVGFEMorphologyAttributes
  extends SVGCoreAttributes<SVGFEMorphologyElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: string
  operator?: 'over' | 'in' | 'out' | 'atop' | 'xor' | 'lighter' | 'arithmetic'
  radius?: number
}
