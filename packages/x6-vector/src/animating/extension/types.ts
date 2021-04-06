import { Animator } from '../animator'
import { HTMLAnimator } from './html'
import { SVGAnimator } from './svg'
import { SVGAAnimator } from './container/a'
import { SVGClipPathAnimator } from './container/clippath'
import { SVGGAnimator } from './container/g'
import { SVGDefsAnimator } from './container/defs'
import { SVGGradientAnimator } from './container/gradient'
import { SVGMarkerAnimator } from './container/marker'
import { SVGMaskAnimator } from './container/mask'
import { SVGPatternAnimator } from './container/pattern'
import { SVGSVGAnimator } from './container/svg'
import { SVGSymbolAnimator } from './container/symbol'
import { SVGCircleAnimator } from './shape/circle'
import { SVGEllipseAnimator } from './shape/ellipse'
import { SVGImageAnimator } from './shape/image'
import { SVGLineAnimator } from './shape/line'
import { SVGPolyAnimator } from './shape/poly'
import { SVGPolygonAnimator } from './shape/polygon'
import { SVGPolylineAnimator } from './shape/polyline'
import { SVGRectAnimator } from './shape/rect'
import { SVGStyleAnimator } from './shape/style'
import { SVGTextAnimator } from './shape/text'
import { SVGTSpanAnimator } from './shape/tspan'
import { SVGUseAnimator } from './shape/use'
import { SVGPathAnimator } from './shape/path'
import { SVGViewboxAnimator } from './container/container-viewbox'
import { SVGContainerAnimator } from './container/container'
import { SVGForeignObjectAnimator } from './shape/foreignobject'

// prettier-ignore
export type AnimatorType<T> =
      T extends SVGAElement             ? SVGAAnimator
    : T extends SVGLineElement          ? SVGLineAnimator
    : T extends SVGPathElement          ? SVGPathAnimator
    : T extends SVGCircleElement        ? SVGCircleAnimator
    : T extends SVGClipPathElement      ? SVGClipPathAnimator
    : T extends SVGEllipseElement       ? SVGEllipseAnimator
    : T extends SVGImageElement         ? SVGImageAnimator
    : T extends SVGRectElement          ? SVGRectAnimator
    : T extends SVGUseElement           ? SVGUseAnimator
    : T extends SVGSVGElement           ? SVGSVGAnimator
    : T extends SVGForeignObjectElement ? SVGForeignObjectAnimator
    : T extends SVGTSpanElement         ? SVGTSpanAnimator
    : T extends SVGTextElement          ? SVGTextAnimator
    : T extends SVGPolylineElement      ? SVGPolylineAnimator
    : T extends SVGPolygonElement       ? SVGPolygonAnimator
    : T extends SVGGElement             ? SVGGAnimator
    : T extends SVGDefsElement          ? SVGDefsAnimator
    : T extends SVGGradientElement      ? SVGGradientAnimator
    : T extends SVGMarkerElement        ? SVGMarkerAnimator
    : T extends SVGMaskElement          ? SVGMaskAnimator
    : T extends SVGPatternElement       ? SVGPatternAnimator
    : T extends SVGSymbolElement        ? SVGSymbolAnimator
    : T extends SVGStyleElement         ? SVGStyleAnimator
    : T extends SVGElement              ? SVGAnimator<T>

    : T extends
        | SVGAElement
        | SVGGElement ? SVGContainerAnimator<T>

    : T extends
        | SVGLinearGradientElement
        | SVGRadialGradientElement ? SVGGradientAnimator

    : T extends
        | SVGPolygonElement
        | SVGPolylineElement ? SVGPolyAnimator<T>

    : T extends
        | SVGSVGElement
        | SVGSymbolElement
        | SVGPatternElement
        | SVGMarkerElement ? SVGViewboxAnimator<T>

    : T extends Node ? HTMLAnimator<T>
    : Animator<any, any, any>
