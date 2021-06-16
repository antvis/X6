import { Base } from '../common/base'
import { Filter } from '../filter/filter'

export class FeBase<
  T extends
    | SVGFEBlendElement
    | SVGFEColorMatrixElement
    | SVGFEComponentTransferElement
    | SVGFECompositeElement
    | SVGFEConvolveMatrixElement
    | SVGFEDiffuseLightingElement
    | SVGFEDisplacementMapElement
    | SVGFEDistantLightElement
    | SVGFEFloodElement
    | SVGFEFuncAElement
    | SVGFEFuncBElement
    | SVGFEFuncGElement
    | SVGFEFuncRElement
    | SVGFEGaussianBlurElement
    | SVGFEImageElement
    | SVGFEMergeElement
    | SVGFEMergeNodeElement
    | SVGFEMorphologyElement
    | SVGFEOffsetElement
    | SVGFEPointLightElement
    | SVGFESpecularLightingElement
    | SVGFESpotLightElement
    | SVGFETileElement
    | SVGFETurbulenceElement,
> extends Base<T> {
  filter(): Filter | null {
    return this.parent<Filter>(Filter)
  }
}
