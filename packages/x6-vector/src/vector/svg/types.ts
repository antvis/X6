import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGPresentationAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGSVGAttributes
  extends SVGCommonAttributes<SVGSVGElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes,
    SVGPresentationAttributes {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  preserveAspectRatio?: string
  version?: number
  viewBox?: string
  baseProfile?: string
  contentScriptType?: string
  contentStyleType?: string
}
