import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'
import { In } from '../fe-blend/types'

export { In }

export type Channel = 'R' | 'G' | 'B' | 'A'

export interface SVGFEDisplacementMapAttributes
  extends SVGCoreAttributes<SVGFEDisplacementMapElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  in2?: In | string
  scale?: number
  xChannelSelector?: Channel
  yChannelSelector?: Channel
}
