import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGFilterPrimitiveAttributes,
} from '../types/attributes-core'

import { In } from '../fe-blend/types'

export interface SVGFEComponentTransferAttributes
  extends SVGCoreAttributes<SVGFEComponentTransferElement>,
    SVGStyleAttributes,
    SVGPresentationAttributes,
    SVGFilterPrimitiveAttributes {
  in?: In | string
}

export { In }
