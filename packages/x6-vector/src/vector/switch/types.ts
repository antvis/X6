import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGSwitchAttributes
  extends SVGCoreAttributes<SVGSwitchElement>,
    SVGConditionalProcessingAttributes,
    SVGStyleAttributes,
    SVGPresentationAttributes {}
