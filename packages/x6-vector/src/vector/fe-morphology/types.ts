import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export { In }

export type Operator =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'lighter'
  | 'arithmetic'

export interface SVGFEMorphologyAttributes
  extends SVGCoreAttributes<SVGFEMorphologyElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  radius?: number
  operator?: Operator
}
