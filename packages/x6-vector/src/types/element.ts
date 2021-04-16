import { Fragment } from '../vector/fragment/fragment'

import { A } from '../vector/a/a'
import { ClipPath } from '../vector/clippath/clippath'
import { Defs } from '../vector/defs/defs'
import { G } from '../vector/g/g'
import { Stop } from '../vector/gradient/stop'
import { LinearGradient } from '../vector/gradient/linear'
import { RadialGradient } from '../vector/gradient/radial'
import { Marker } from '../vector/marker/marker'
import { Mask } from '../vector/mask/mask'
import { Pattern } from '../vector/pattern/pattern'
import { Svg } from '../vector/svg/svg'
import { Symbol } from '../vector/symbol/symbol'
import { Dom } from '../dom/dom'
import { Vector } from '../vector/vector/vector'
import { Circle } from '../vector/circle/circle'
import { Ellipse } from '../vector/ellipse/ellipse'
import { ForeignObject } from '../vector/foreignobject/foreignobject'
import { Image } from '../vector/image/image'
import { Line } from '../vector/line/line'
import { Path } from '../vector/path/path'
import { Polygon } from '../vector/polygon/polygon'
import { Polyline } from '../vector/polyline/polyline'
import { Rect } from '../vector/rect/rect'
import { Style } from '../vector/style/style'
import { Text } from '../vector/text/text'
import { TextPath } from '../vector/textpath/textpath'
import { TSpan } from '../vector/tspan/tspan'
import { Use } from '../vector/use/use'

// prettier-ignore
export type ElementMap<T> =
  T extends SVGAElement              ? A :
  T extends SVGClipPathElement       ? ClipPath :
  T extends SVGDefsElement           ? Defs :
  T extends SVGGElement              ? G :
  T extends SVGStopElement           ? Stop :
  T extends SVGLinearGradientElement ? LinearGradient :
  T extends SVGRadialGradientElement ? RadialGradient :
  T extends SVGMarkerElement         ? Marker :
  T extends SVGMaskElement           ? Mask :
  T extends SVGPatternElement        ? Pattern :
  T extends SVGSVGElement            ? Svg :
  T extends SVGSymbolElement         ? Symbol : // eslint-disable-line

  T extends SVGCircleElement         ? Circle :
  T extends SVGEllipseElement        ? Ellipse :
  T extends SVGForeignObjectElement  ? ForeignObject :
  T extends DocumentFragment         ? Fragment :
  T extends SVGImageElement          ? Image :
  T extends SVGLineElement           ? Line :
  T extends SVGPathElement           ? Path :
  T extends SVGPolygonElement        ? Polygon :
  T extends SVGPolylineElement       ? Polyline :
  T extends SVGRectElement           ? Rect :
  T extends SVGStyleElement          ? Style :
  T extends SVGTextElement           ? Text :
  T extends SVGTextPathElement       ? TextPath :
  T extends SVGTSpanElement          ? TSpan :
  T extends SVGUseElement            ? Use :
  T extends SVGElement               ? Vector<T>:
  T extends HTMLElement              ? Dom<T> : Dom<Element>

export type SVGTagNameMap = {
  [K in keyof SVGElementTagNameMap]: ElementMap<SVGElementTagNameMap[K]>
}

export type HTMLTagNameMap = {
  [K in keyof HTMLElementTagNameMap]: Dom<HTMLElementTagNameMap[K]>
}
