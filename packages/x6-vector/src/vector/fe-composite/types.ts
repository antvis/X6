import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export type Operator =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'lighter'
  | 'arithmetic'

export interface SVGFECompositeAttributes
  extends SVGCoreAttributes<SVGFECompositeElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  in2?: In | string
  operator?: Operator
  k1?: number
  k2?: number
  k3?: number
  k4?: number
}

export { In }
