import { DomAnimator } from './dom'
import { SVGAnimator } from './svg'
import { SVGAAnimator } from './vector/a'
import { SVGClipPathAnimator } from './vector/clippath'
import { SVGGAnimator } from './vector/g'
import { SVGDefsAnimator } from './vector/defs'
import { SVGGradientAnimator } from './vector/gradient'
import { SVGMarkerAnimator } from './vector/marker'
import { SVGMaskAnimator } from './vector/mask'
import { SVGPatternAnimator } from './vector/pattern'
import { SVGSVGAnimator } from './vector/svg'
import { SVGSymbolAnimator } from './vector/symbol'
import { SVGCircleAnimator } from './vector/circle'
import { SVGEllipseAnimator } from './vector/ellipse'
import { SVGImageAnimator } from './vector/image'
import { SVGLineAnimator } from './vector/line'
import { SVGPolygonAnimator } from './vector/polygon'
import { SVGPolylineAnimator } from './vector/polyline'
import { SVGRectAnimator } from './vector/rect'
import { SVGStyleAnimator } from './vector/style'
import { SVGTextAnimator } from './vector/text'
import { SVGTSpanAnimator } from './vector/tspan'
import { SVGUseAnimator } from './vector/use'
import { SVGPathAnimator } from './vector/path'
import { SVGForeignObjectAnimator } from './vector/foreignobject'
import { SVGLinearGradientAnimator } from './vector/linear-gradient'
import { SVGRadialGradientAnimator } from './vector/radial-gradient'

// prettier-ignore
export type AnimatorMap<T> =
      T extends SVGAElement              ? SVGAAnimator
    : T extends SVGLineElement           ? SVGLineAnimator
    : T extends SVGPathElement           ? SVGPathAnimator
    : T extends SVGCircleElement         ? SVGCircleAnimator
    : T extends SVGClipPathElement       ? SVGClipPathAnimator
    : T extends SVGEllipseElement        ? SVGEllipseAnimator
    : T extends SVGImageElement          ? SVGImageAnimator
    : T extends SVGRectElement           ? SVGRectAnimator
    : T extends SVGUseElement            ? SVGUseAnimator
    : T extends SVGSVGElement            ? SVGSVGAnimator
    : T extends SVGForeignObjectElement  ? SVGForeignObjectAnimator
    : T extends SVGTSpanElement          ? SVGTSpanAnimator
    : T extends SVGTextElement           ? SVGTextAnimator
    : T extends SVGPolylineElement       ? SVGPolylineAnimator
    : T extends SVGPolygonElement        ? SVGPolygonAnimator
    : T extends SVGGElement              ? SVGGAnimator
    : T extends SVGDefsElement           ? SVGDefsAnimator
    : T extends SVGGradientElement       ? SVGGradientAnimator<T>
    : T extends SVGLinearGradientElement ? SVGLinearGradientAnimator
    : T extends SVGRadialGradientElement ? SVGRadialGradientAnimator
    : T extends SVGMarkerElement         ? SVGMarkerAnimator
    : T extends SVGMaskElement           ? SVGMaskAnimator
    : T extends SVGPatternElement        ? SVGPatternAnimator
    : T extends SVGPolygonElement        ? SVGPolygonAnimator
    : T extends SVGPolylineElement       ? SVGPolylineAnimator
    : T extends SVGSymbolElement         ? SVGSymbolAnimator
    : T extends SVGStyleElement          ? SVGStyleAnimator
    : T extends SVGElement               ? SVGAnimator<T>

    : T extends Element ? DomAnimator<T>
    : DomAnimator<any>
