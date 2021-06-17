import { SVGAAttributes } from '../a/types'
import { SVGAnimateAttributes } from '../animate/types'
import { SVGAnimateMotionAttributes } from '../animate-motion/types'
import { SVGAnimateTransformAttributes } from '../animate-transform/types'
import { SVGCircleAttributes } from '../circle/types'
import { SVGClipPathAttributes } from '../clippath/types'
import { SVGDefsAttributes } from '../defs/types'
import { SVGDescAttributes } from '../desc/types'
import { SVGEllipseAttributes } from '../ellipse/types'
import { SVGFEBlendAttributes } from '../fe-blend/types'
import { SVGFEColorMatrixAttributes } from '../fe-color-matrix/types'
import { SVGFEComponentTransferAttributes } from '../fe-component-transfer/types'
import { SVGFECompositeAttributes } from '../fe-composite/types'
import { SVGFEConvolveMatrixAttributes } from '../fe-convolve-matrix/types'
import { SVGFEDiffuseLightingAttributes } from '../fe-diffuse-lighting/types'
import { SVGFEDisplacementMapAttributes } from '../fe-displacement-map/types'
import { SVGFEDistantLightAttributes } from '../fe-distant-light/types'
import { SVGFEFloodAttributes } from '../fe-flood/types'
import { SVGFEFuncAAttributes } from '../fe-func-a/types'
import { SVGFEFuncBAttributes } from '../fe-func-b/types'
import { SVGFEFuncGAttributes } from '../fe-func-g/types'
import { SVGFEFuncRAttributes } from '../fe-func-r/types'
import { SVGFEGaussianBlurAttributes } from '../fe-gaussian-blur/types'
import { SVGFEImageAttributes } from '../fe-image/types'
import { SVGFEMergeNodeAttributes } from '../fe-merge-node/types'
import { SVGFEMergeAttributes } from '../fe-merge/types'
import { SVGFEMorphologyAttributes } from '../fe-morphology/types'
import { SVGFEOffsetAttributes } from '../fe-offset/types'
import { SVGFEPointLightAttributes } from '../fe-point-light/types'
import { SVGFESpecularLightingAttributes } from '../fe-specular-lighting/types'
import { SVGFESpotLightAttributes } from '../fe-spot-light/types'
import { SVGFETileAttributes } from '../fe-tile/types'
import { SVGFETurbulenceAttributes } from '../fe-turbulence/types'
import { SVGFilterAttributes } from '../filter/types'
import { SVGForeignObjectAttributes } from '../foreignobject/types'
import { SVGGAttributes } from '../g/types'
import {
  SVGLinearGradientAttributes,
  SVGRadialGradientAttributes,
  SVGStopAttributes,
} from '../gradient/types'
import { SVGImageAttributes } from '../image/types'
import { SVGLineAttributes } from '../line/types'
import { SVGMarkerAttributes } from '../marker/types'
import { SVGMaskAttributes } from '../mask/types'
import { SVGMetadataAttributes } from '../metadata/types'
import { SVGPathAttributes } from '../path/types'
import { SVGPatternAttributes } from '../pattern/types'
import { SVGPolygonAttributes } from '../polygon/types'
import { SVGPolylineAttributes } from '../polyline/types'
import { SVGRectAttributes } from '../rect/types'
import { SVGScriptAttributes } from '../script/types'
import { SVGStyleAttributes } from '../style/types'
import { SVGSVGAttributes } from '../svg/types'
import { SVGSwitchAttributes } from '../switch/types'
import { SVGSymbolAttributes } from '../symbol/types'
import { SVGTextAttributes } from '../text/types'
import { SVGTextPathAttributes } from '../textpath/types'
import { SVGTitleAttributes } from '../title/types'
import { SVGTSpanAttributes } from '../tspan/types'
import { SVGUseAttributes } from '../use/types'
import { SVGViewAttributes } from '../view/types'
import { SVGCoreAttributes } from './attributes-core'

export interface SVGAttributesTagNameMap {
  a: SVGAAttributes
  animate: SVGAnimateAttributes
  animateMotion: SVGAnimateMotionAttributes
  animateTransform: SVGAnimateTransformAttributes
  circle: SVGCircleAttributes
  clipPath: SVGClipPathAttributes
  defs: SVGDefsAttributes
  desc: SVGDescAttributes
  ellipse: SVGEllipseAttributes
  feBlend: SVGFEBlendAttributes
  feColorMatrix: SVGFEColorMatrixAttributes
  feComponentTransfer: SVGFEComponentTransferAttributes
  feComposite: SVGFECompositeAttributes
  feConvolveMatrix: SVGFEConvolveMatrixAttributes
  feDiffuseLighting: SVGFEDiffuseLightingAttributes
  feDisplacementMap: SVGFEDisplacementMapAttributes
  feDistantLight: SVGFEDistantLightAttributes
  feFlood: SVGFEFloodAttributes
  feFuncA: SVGFEFuncAAttributes
  feFuncB: SVGFEFuncBAttributes
  feFuncG: SVGFEFuncGAttributes
  feFuncR: SVGFEFuncRAttributes
  feGaussianBlur: SVGFEGaussianBlurAttributes
  feImage: SVGFEImageAttributes
  feMerge: SVGFEMergeAttributes
  feMergeNode: SVGFEMergeNodeAttributes
  feMorphology: SVGFEMorphologyAttributes
  feOffset: SVGFEOffsetAttributes
  fePointLight: SVGFEPointLightAttributes
  feSpecularLighting: SVGFESpecularLightingAttributes
  feSpotLight: SVGFESpotLightAttributes
  feTile: SVGFETileAttributes
  feTurbulence: SVGFETurbulenceAttributes
  filter: SVGFilterAttributes
  foreignObject: SVGForeignObjectAttributes
  g: SVGGAttributes
  image: SVGImageAttributes
  line: SVGLineAttributes
  linearGradient: SVGLinearGradientAttributes
  marker: SVGMarkerAttributes
  mask: SVGMaskAttributes
  metadata: SVGMetadataAttributes
  path: SVGPathAttributes
  pattern: SVGPatternAttributes
  polygon: SVGPolygonAttributes
  polyline: SVGPolylineAttributes
  radialGradient: SVGRadialGradientAttributes
  rect: SVGRectAttributes
  script: SVGScriptAttributes
  stop: SVGStopAttributes
  style: SVGStyleAttributes
  svg: SVGSVGAttributes
  switch: SVGSwitchAttributes
  symbol: SVGSymbolAttributes
  text: SVGTextAttributes
  textPath: SVGTextPathAttributes
  title: SVGTitleAttributes
  tspan: SVGTSpanAttributes
  use: SVGUseAttributes
  view: SVGViewAttributes
}

// prettier-ignore
export type SVGAttributesMap<T> =
  T extends SVGAElement ? SVGAAttributes :
  T extends SVGAnimateElement ? SVGAnimateAttributes :
  T extends SVGAnimateMotionElement ? SVGAnimateMotionAttributes :
  T extends SVGAnimateTransformElement ? SVGAnimateTransformAttributes :
  T extends SVGCircleElement ? SVGCircleAttributes :
  T extends SVGClipPathElement ? SVGClipPathAttributes :
  T extends SVGDefsElement ? SVGDefsAttributes :
  T extends SVGDescElement ? SVGDescAttributes :
  T extends SVGEllipseElement ? SVGEllipseAttributes :
  T extends SVGFEBlendElement ? SVGFEBlendAttributes :
  T extends SVGFEColorMatrixElement ? SVGFEColorMatrixAttributes :
  T extends SVGFEComponentTransferElement ? SVGFEComponentTransferAttributes :
  T extends SVGFECompositeElement ? SVGFECompositeAttributes :
  T extends SVGFEConvolveMatrixElement ? SVGFEConvolveMatrixAttributes :
  T extends SVGFEDiffuseLightingElement ? SVGFEDiffuseLightingAttributes :
  T extends SVGFEDisplacementMapElement ? SVGFEDisplacementMapAttributes :
  T extends SVGFEDistantLightElement ? SVGFEDistantLightAttributes :
  T extends SVGFEFloodElement ? SVGFEFloodAttributes :
  T extends SVGFEFuncAElement ? SVGFEFuncAAttributes :
  T extends SVGFEFuncBElement ? SVGFEFuncBAttributes :
  T extends SVGFEFuncGElement ? SVGFEFuncGAttributes :
  T extends SVGFEFuncRElement ? SVGFEFuncRAttributes :
  T extends SVGFEGaussianBlurElement ? SVGFEGaussianBlurAttributes :
  T extends SVGFEImageElement ? SVGFEImageAttributes :
  T extends SVGFEMergeElement ? SVGFEMergeAttributes :
  T extends SVGFEMergeNodeElement ? SVGFEMergeNodeAttributes :
  T extends SVGFEMorphologyElement ? SVGFEMorphologyAttributes :
  T extends SVGFEOffsetElement ? SVGFEOffsetAttributes :
  T extends SVGFEPointLightElement ? SVGFEPointLightAttributes :
  T extends SVGFETileElement ? SVGFETileAttributes :
  T extends SVGFETurbulenceElement ? SVGFETurbulenceAttributes :
  T extends SVGFilterElement ? SVGFilterAttributes :
  T extends SVGForeignObjectElement ? SVGForeignObjectAttributes :
  T extends SVGGElement ? SVGGAttributes :
  T extends SVGImageElement ? SVGImageAttributes :
  T extends SVGLineElement ? SVGLineAttributes :
  T extends SVGLinearGradientElement ? SVGLinearGradientAttributes :
  T extends SVGMarkerElement ? SVGMarkerAttributes :
  T extends SVGMaskElement ? SVGMaskAttributes :
  T extends SVGMetadataElement ? SVGMetadataAttributes :
  T extends SVGPathElement ? SVGPathAttributes :
  T extends SVGPatternElement ? SVGPatternAttributes :
  T extends SVGPolygonElement ? SVGPolygonAttributes :
  T extends SVGPolylineElement ? SVGPolylineAttributes :
  T extends SVGRadialGradientElement ? SVGRadialGradientAttributes :
  T extends SVGRectElement ? SVGRectAttributes :
  T extends SVGScriptElement ? SVGScriptAttributes :
  T extends SVGStopElement ? SVGStopAttributes :
  T extends SVGStyleElement ? SVGStyleAttributes :
  T extends SVGSVGElement ? SVGSVGAttributes :
  T extends SVGSwitchElement ? SVGSwitchAttributes :
  T extends SVGSymbolElement ? SVGSymbolAttributes :
  T extends SVGTextElement ? SVGTextAttributes :
  T extends SVGTextPathElement ? SVGTextPathAttributes :
  T extends SVGTSpanElement ? SVGTSpanAttributes :
  T extends SVGTitleElement ? SVGTitleAttributes :
  T extends SVGUseElement ? SVGUseAttributes :
  T extends SVGViewElement ? SVGViewAttributes
  : SVGCoreAttributes<SVGElement>
