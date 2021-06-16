import { SVGCoreAttributes } from '../types/attributes-core'
import { In } from '../fe-blend/types'

export { In }

export interface SVGFEMergeNodeAttributes
  extends SVGCoreAttributes<SVGFEMergeNodeElement> {
  in?: In | string
}
