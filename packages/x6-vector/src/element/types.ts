import { A } from './container/a'
import { ClipPath } from './container/clippath'
import { Defs } from './container/defs'
import { G } from './container/g'
import { Gradient } from './container/gradient'
import { Marker } from './container/marker'
import { Mask } from './container/mask'
import { Pattern } from './container/pattern'
import { Svg } from './container/svg'
import { Symbol } from './container/symbol'
import { Dom } from './dom'
import { VectorElement } from './element'
import { Circle } from './shape/circle'
import { Ellipse } from './shape/ellipse'
import { ForeignObject } from './shape/foreignobject'
import { Fragment } from './shape/fragment'
import { Image } from './shape/image'
import { Line } from './shape/line'
import { Path } from './shape/path'
import { Polygon } from './shape/polygon'
import { Polyline } from './shape/polyline'
import { Rect } from './shape/rect'
import { Style } from './shape/style'
import { Text } from './shape/text'
import { TSpan } from './shape/tspan'
import { Use } from './shape/use'

// prettier-ignore
export type ElementMapping<T> =
        T extends SVGAElement ? A :
        T extends SVGClipPathElement ? ClipPath :
        T extends SVGDefsElement ? Defs :
        T extends SVGGElement ? G :
        T extends SVGLinearGradientElement ? Gradient :
        T extends SVGRadialGradientElement ? Gradient :
        T extends SVGMarkerElement ? Marker :
        T extends SVGMaskElement ? Mask :
        T extends SVGPatternElement ? Pattern :
        T extends SVGSVGElement ? Svg :
        T extends SVGSymbolElement ? Symbol : // eslint-disable-line

        T extends SVGCircleElement ? Circle :
        T extends SVGEllipseElement ? Ellipse :
        T extends SVGForeignObjectElement ? ForeignObject :
        T extends DocumentFragment ? Fragment :
        T extends SVGImageElement ? Image :
        T extends SVGLineElement ? Line :
        T extends SVGPathElement ? Path :
        T extends SVGPolygonElement ? Polygon :
        T extends SVGPolylineElement ? Polyline :
        T extends SVGRectElement ? Rect :
        T extends SVGStyleElement ? Style :
        T extends SVGTextElement ? Text :
        T extends SVGTSpanElement ? TSpan :
        T extends SVGUseElement ? Use :

        T extends SVGElement ? VectorElement<T>:
        T extends HTMLElement ? Dom<T> : Dom<Node>

export type HTMLElementMapping<T extends HTMLElement> = Dom<T>

export type SVGTagMapping = {
  [K in keyof SVGElementTagNameMap]: ElementMapping<SVGElementTagNameMap[K]>
}

export type HTMLTagMapping = {
  [K in keyof HTMLElementTagNameMap]: Dom<HTMLElementTagNameMap[K]>
}
