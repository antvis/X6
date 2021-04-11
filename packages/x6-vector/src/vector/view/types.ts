import {
  SVGCommonAttributes,
  SVGStyleAttributes,
  SVGConditionalProcessingAttributes,
} from '../types/attributes-core'

export interface SVGViewAttributes
  extends SVGCommonAttributes<SVGViewElement>,
    SVGStyleAttributes,
    SVGConditionalProcessingAttributes {
  viewBox?: string
  preserveAspectRatio?: string
  zoomAndPan?: 'disable' | 'magnify'
  viewTarget?: string
}
