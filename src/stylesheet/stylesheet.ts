import * as util from '../util'
import { constants } from '../common'
import { Perimeter } from './perimeter'
import { Point, Direction, FontStyle } from '../struct'

export class Stylesheet {
  styles: { [name: string]: Stylesheet.Styles }

  constructor() {
    this.styles = {}
    this.setDefaultNodeStyle(this.createDefaultNodeStyle())
    this.setDefaultEdgeStyle(this.createDefaultEdgeStyle())
  }

  createDefaultNodeStyle(): Stylesheet.Styles {
    const style: Stylesheet.Styles = {
      shape: constants.SHAPE_RECTANGLE,
      perimeter: Perimeter.rectangle,
      align: 'center',
      verticalAlign: 'middle',
      fill: '#C3D9FF',
      stroke: '#6482B9',
      fontColor: '#774400',
    }

    return style
  }

  createDefaultEdgeStyle(): Stylesheet.Styles {
    const style: Stylesheet.Styles = {
      shape: constants.SHAPE_CONNECTOR,
      endArrow: constants.ARROW_CLASSIC,
      align: 'center',
      verticalAlign: 'middle',
      stroke: '#6482B9',
      fontColor: '#446299',
    }
    return style
  }

  setDefaultNodeStyle(style: Stylesheet.Styles) {
    this.setCellStyle('defaultNode', style)
  }

  setDefaultEdgeStyle(style: Stylesheet.Styles) {
    this.setCellStyle('defaultEdge', style)
  }

  getDefaultNodeStyle() {
    return this.styles['defaultNode'] as Stylesheet.Styles
  }

  getDefaultEdgeStyle() {
    return this.styles['defaultEdge'] as Stylesheet.Styles
  }

  setCellStyle(name: string, style: Stylesheet.Styles) {
    this.styles[name] = style
  }

  /**
   * Returns the cell style for the specified stylename or the given
   * defaultStyle if no style can be found for the given stylename.
   */
  getCellStyle(styleStr: string, defaultStyle: Stylesheet.Styles) {
    let style = defaultStyle
    if (styleStr != null && styleStr.length > 0) {
      const pairs = styleStr.split(';')
      if (style != null && styleStr.charAt(0) !== ';') {
        style = { ...style } as Stylesheet.Styles
      } else {
        style = {}
      }

      for (let i = 0, ii = pairs.length; i < ii; i += 1) {
        const tmp = pairs[i].trim()
        const pos = tmp.indexOf('=')

        if (pos >= 0) {
          const key = tmp.substring(0, pos).trim()
          const value = tmp.substring(pos + 1).trim()

          if (value === 'none') {
            delete style[key]
          } else if (util.isNumeric(value)) {
            style[key] = +value
          } else {
            style[key] = value
          }
        } else {
          // Merges the entries from a named style
          const stl = this.styles[tmp]
          if (stl != null) {
            Object.keys(stl).forEach(k => (style[k] = stl[k]))
          }
        }
      }
    }

    return style
  }
}

export namespace Stylesheet {
  export interface Styles {
    perimeter?: string | ((...args: any[]) => Point)
    sourcePort?: string
    targetPort?: string
    portConstraint?: string
    sourcePortConstraint?: string
    targetPortConstraint?: string
    portConstraintRotation?: number

    /**
     * Defines if the connection points on either end of the edge should be
     * computed so that the edge is vertical or horizontal if possible and
     * if the point is not at a fixed location.
     */
    orthogonal?: boolean

    /**
     * Defines the key for the horizontal relative coordinate connection
     * point of an edge with its source terminal.
     */
    exitX?: string

    /**
     * Defines the key for the vertical relative coordinate connection
     * point of an edge with its source terminal.
     */
    exitY?: string

    /**
     * Defines the key for the horizontal offset of the connection point
     * of an edge with its source terminal.
     */
    exitDx?: string

    /**
     * Defines the key for the vertical offset of the connection point
     * of an edge with its source terminal.
     */
    exitDy?: string

    /**
     * Defines the key for the horizontal relative coordinate connection
     * point of an edge with its target terminal.
     */
    entryX?: string

    /**
     * Defines the key for the vertical relative coordinate connection
     * point of an edge with its target terminal.
     */
    entryY?: string

    /**
     * Defines the key for the horizontal offset of the connection point
     * of an edge with its target terminal.
     */
    entryDx?: string

    /**
     * Defines the key for the vertical offset of the connection point
     * of an edge with its target terminal.
     */
    entryDy?: string

    /**
     * Defines if the perimeter should be used to find the exact entry point
     * along the perimeter of the source. Possible values are `false` and
     * `true`.
     *
     * Default is `true`.
     */
    exitPerimeter?: boolean

    /**
     * Defines if the perimeter should be used to find the exact entry point
     * along the perimeter of the target. Possible values are `false` and
     * `true`.
     *
     * Default is `true`.
     */
    entryPerimeter?: boolean

    cursor?: string
    pointerEvents?: string
    rotation?: number
    opacity?: number

    fill?: string
    fillOpacity?: number

    stroke?: string
    strokeWidth?: number
    strokeOpacity?: number

    dashed?: boolean
    fixDash?: boolean
    dashPattern?: string

    fontColor?: string
    fontFamily?: string
    fontSize?: number
    fontStyle?: FontStyle
    overflow?: string
    whiteSpace?: 'nowrap' | 'wrap'
    align?: 'left' | 'center' | 'right'
    verticalAlign?: 'top' | 'middle' | 'bottom'
    labelWidth?: number
    textOpacity?: number

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
    labelPosition?: 'left' | 'center' | 'right'

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
    labelVerticalPosition?: 'top' | 'middle' | 'bottom'
    labelBackgroundColor?: string
    labelBorderColor?: string
    labelPadding?: number
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
    imageAlign?: 'left' | 'center' | 'right'
    imageVerticalAlign?: 'top' | 'middle' | 'bottom'
    /**
     * Specify whether keep image aspect or not.
     */
    imageAspect?: boolean

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
    endFill?: string
    startFill?: string

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

    shape?: string
    edgeStyle?: string

    /**
     * Jetty size is the minimum length of the orthogonal segment
     * before it attaches to a shape.
     */
    jettySize?: number
    sourceJettySize?: number
    targetJettySize?: number
    loopStyle?: string,
    orthogonalLoop?: boolean
    routingCenterX?: number
    routingCenterY?: number

    [name: string]: any
  }
}
