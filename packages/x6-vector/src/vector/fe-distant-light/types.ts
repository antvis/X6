import { SVGCoreAttributes } from '../types/attributes-core'

export interface SVGFEDistantLightAttributes
  extends SVGCoreAttributes<SVGFEDistantLightElement> {
  azimuth?: number
  elevation?: number
}
