import { SVGCoreAttributes } from '../types/attributes-core'

export interface SVGFEPointLightAttributes
  extends SVGCoreAttributes<SVGFEPointLightElement> {
  x?: string | number
  y?: string | number
  z?: string | number
}
