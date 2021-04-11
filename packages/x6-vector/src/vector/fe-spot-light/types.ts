import { SVGCoreAttributes } from '../types/attributes-core'

export interface SVGFESpotLightAttributes
  extends SVGCoreAttributes<SVGFESpotLightElement> {
  x?: string | number
  y?: string | number
  z?: string | number
  pointsAtX?: number
  pointsAtY?: number
  pointsAtZ?: number
  specularExponent?: number
  limitingConeAngle?: number
}
