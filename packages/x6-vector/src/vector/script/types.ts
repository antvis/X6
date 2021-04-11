import {
  SVGCoreAttributes,
  SVGStyleAttributes,
  SVGXLinkAttributes,
} from '../types/attributes-core'

export interface SVGScriptAttributes
  extends SVGCoreAttributes<SVGScriptElement>,
    SVGStyleAttributes,
    SVGXLinkAttributes {
  href?: string
  crossorigin?: string
  type?: string
}
