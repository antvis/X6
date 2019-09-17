import { FontStyle } from './struct'
import { PerimeterFunction, RoutingFunction } from './core/registry'

export type Dialect = 'svg' | 'html'
export type Align = 'left' | 'center' | 'right'
export type VAlign = 'top' | 'middle' | 'bottom'
export type LabelPosition = 'left' | 'center' | 'right'
export type LabelVerticalPosition = 'top' | 'middle' | 'bottom'
export type Direction = 'north' | 'south' | 'east' | 'west'
export type LineCap = 'butt' | 'round' | 'square'
export type LineJoin = 'miter' | 'round' | 'bevel'
export type TextDirection = '' | 'auto' | 'ltr' | 'rtl'

export interface Style {
  shape?: string
  edge?: string | RoutingFunction | null

  perimeter?: string | PerimeterFunction | null
  sourcePort?: string
  targetPort?: string
  portConstraint?: string
  portConstraintRotation?: number
  sourcePortConstraint?: string
  targetPortConstraint?: string

  /**
   * Defines if the connection points on either end of the edge should be
   * computed so that the edge is vertical or horizontal if possible and
   * if the point is not at a fixed location.
   */
  orthogonal?: boolean

  /**
   * The horizontal relative coordinate connection point of an edge with
   * its source terminal.
   */
  exitX?: number

  /**
   * The vertical relative coordinate connection point of an edge with
   * its source terminal.
   */
  exitY?: number

  /**
   * The horizontal offset of the connection point of an edge with its
   * source terminal.
   */
  exitDx?: number

  /**
   * The vertical offset of the connection point of an edge with its
   * source terminal.
   */
  exitDy?: number

  /**
   * The horizontal relative coordinate connection point of an edge with
   * its target terminal.
   */
  entryX?: number

  /**
   * The vertical relative coordinate connection point of an edge with
   * its target terminal.
   */
  entryY?: number

  /**
   * The horizontal offset of the connection point of an edge with its
   * target terminal.
   */
  entryDx?: number

  /**
   * The vertical offset of the connection point of an edge with its
   * target terminal.
   */
  entryDy?: number

  /**
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the source.
   *
   * Default is `true`.
   */
  exitPerimeter?: boolean

  /**
   * Defines if the perimeter should be used to find the exact entry point
   * along the perimeter of the target.
   *
   * Default is `true`.
   */
  entryPerimeter?: boolean

  cursor?: string
  opacity?: number
  rotation?: number
  className?: string
  pointerEvents?: boolean

  fill?: string
  fillOpacity?: number

  stroke?: string
  strokeWidth?: number
  strokeOpacity?: number

  dashed?: boolean
  dashPattern?: string
  fixDash?: boolean

  fontColor?: string
  fontFamily?: string
  fontSize?: number
  fontStyle?: FontStyle
  textOpacity?: number
  textDirection?: TextDirection
  overflow?: 'fill' | 'width' | 'visible' | 'hidden'
  whiteSpace?: 'nowrap' | 'wrap'
  align?: Align
  verticalAlign?: VAlign
  labelWidth?: number

  /**
   * The horizontal label position of vertices. Possible values are
   * `left`, `center`, `right`.
   *
   * Default is `center`.
   *
   * `left` means the entire label bounds is placed completely just
   * to the left of the node, `right` means adjust to the right and
   * `center` means the label bounds are vertically aligned with the
   * bounds of the node.
   *
   * Note this style doesn't affect the positioning of label within the
   * label bounds, to move the label horizontally within the label bounds,
   * use `align` style.
   */
  labelPosition?: LabelPosition

  /**
   * The vertical label position of vertices. Possible values are
   * `top`, `middle`, `bottom`.
   *
   * Default is `middle`.
   *
   * `top` means the entire label bounds is placed completely just
   * on the top of the node, `bottom` means adjust on the bottom
   * and `middle` means the label bounds are horizontally aligned
   * with the bounds of the vertex.
   *
   * Note this value doesn't affect the positioning of label within the
   * label bounds, to move the label vertically within the label bounds,
   * use `verticalAlign` style.
   */
  labelVerticalPosition?: LabelVerticalPosition
  labelBackgroundColor?: string
  labelBorderColor?: string
  labelPadding?: number
  labelClassName?: string
  /**
   * If this is true then no label is visible for a given cell.
   */
  noLabel?: boolean

  gradientColor?: string
  gradientDirection?: Direction

  direction?: Direction
  horizontal?: boolean

  separatorColor?: string
  swimlaneFillColor?: string
  margin?: number

  image?: string
  imageWidth?: number
  imageHeight?: number
  imageBackgroundColor?: string
  imageBorderColor?: string
  imageAlign?: Align
  imageVerticalAlign?: VAlign
  /**
   * Specify whether keep image aspect or not.
   */
  imageAspect?: boolean
  imageFlipH?: boolean
  imageFlipV?: boolean

  flipH?: boolean
  flipV?: boolean

  /**
   * If this is true then no edge style is applied for a given edge.
   */
  noEdgeStyle?: boolean

  indicatorShape?: string
  indicatorImage?: string
  indicatorColor?: string
  indicatorStrokeColor?: string
  indicatorGradientColor?: string
  indicatorSpacing?: number
  indicatorWidth?: number
  indicatorHeight?: number
  indicatorDirection?: Direction

  segment?: number
  endArrow?: string
  startArrow?: string
  endSize?: number
  startSize?: number
  endFilled?: boolean
  startFilled?: boolean

  glass?: boolean
  shadow?: boolean
  rounded?: boolean
  curved?: boolean
  arcSize?: number
  absoluteArcSize?: boolean

  perimeterSpacing?: number
  sourcePerimeterSpacing?: number
  targetPerimeterSpacing?: number
  spacing?: number
  spacingTop?: number
  spacingRight?: number
  spacingBottom?: number
  spacingLeft?: number

  /**
   * This style specifies whether the line between the title
   * regio of a swimlane should be visible.
   */
  swimlaneLine?: boolean

  /**
   * This style defines if the direction style should be taken into
   * account when computing the fixed point location for connected edges.
   */
  anchorPointDirection?: boolean

  /**
   * This style specifies if a only the background of a cell
   * should be painted when it is highlighted.
   */
  backgroundOutline?: boolean

  /**
   * This style defines how the three segment orthogonal edge style
   * leaves its terminal vertices. The vertical style leaves the
   * terminal vertices at the top and bottom sides.
   */
  elbow?: 'horizontal' | 'vertical'

  /**
   * This specifies if the aspect ratio of the cell will be
   * maintained when resizing.
   */
  aspect?: boolean

  /**
   * This specifies if a cell should be resized automatically if
   * the value has changed.
   */
  autosize?: boolean

  /**
   * This style specifies if a cell is foldable using a folding icon.
   */
  foldable?: boolean

  /**
   * This style specifies if the value of a cell can be edited
   * using the in-place editor.
   */
  editable?: boolean

  /**
   * This style specifies if the control points of an edge can be moved.
   */
  bendable?: boolean

  /**
   * This style specifies if a cell can be moved.
   */
  movable?: boolean

  /**
   * This style specifies if a cell can be rotated.
   */
  rotatable?: boolean

  /**
   * This style specifies if a cell can be cloned.
   */
  cloneable?: boolean

  /**
   * This style specifies if a cell can be deleted.
   */
  deletable?: boolean

  /**
   * This style specifies if a cell can be resized.
   */
  resizable?: boolean

  /**
   * This style specifies if a cell's width is resized if the parent is
   * resized. If this is `true` then the width will be resized even if
   * the cell's geometry is relative. If this is `false` then the cell's
   * width will not be resized.
   */
  resizeWidth?: boolean

  /**
   * This style specifies if a cell's height if resize if the parent is
   * resized. If this is `true` then the height will be resized even if
   * the cell's geometry is relative. If this is `false` then the cell's
   * height will not be resized.
   */
  resizeHeight?: boolean

  /**
   * Jetty size is the minimum length of the orthogonal segment
   * before it attaches to a shape.
   */
  jettySize?: number | 'auto'
  sourceJettySize?: number | 'auto'
  targetJettySize?: number | 'auto'
  loopStyle?: string,
  orthogonalLoop?: boolean
  routingCenterX?: number
  routingCenterY?: number

  css?: {
    [selector: string]: Partial<CSSStyleDeclaration>,
  }
}
