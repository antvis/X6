import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export { In }

export interface SVGFEOffsetAttributes
  extends SVGCoreAttributes<SVGFEOffsetElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
  dx?: number | string
  dy?: number | string
}
