import {
  SVGCoreAttributes,
  SVGStyleAttributes as StyleAttributes,
} from '../types/attributes-core'

export interface SVGStyleAttributes
  extends SVGCoreAttributes<SVGStyleElement>,
    StyleAttributes {
  type?: string
  media?: string
  title?: string
}
