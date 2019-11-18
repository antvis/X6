import * as util from '../util'
import { Shape } from './shape'
import { constants } from '../common'
import { SvgCanvas2D } from '../canvas'
import { Direction, Align, VAlign, LineCap, LineJoin } from '../types'
import { Point, Rectangle, Constraint, NodeType } from '../struct'

export class Stencil extends Shape {
  desc: Element
  constraints: Constraint[]
  aspect: string
  w0: number
  h0: number
  bgNode: Element
  fgNode: Element
  strokeWidth: string

  constructor(desc: Element) {
    super()
    this.desc = desc
    this.parseDescription()
    this.parseConstraints()
  }

  parseDescription() {
    // LATER: Preprocess nodes for faster painting
    this.fgNode = this.desc.getElementsByTagName('foreground')[0] as Element
    this.bgNode = this.desc.getElementsByTagName('background')[0] as Element
    this.w0 = Number(this.desc.getAttribute('w') || 100)
    this.h0 = Number(this.desc.getAttribute('h') || 100)

    // Possible values for aspect are: `variable` and `fixed`
    // - variable means fill the available space
    // - fixed means use w0 and h0 to compute the aspect
    const aspect = this.desc.getAttribute('aspect')
    this.aspect = aspect != null ? aspect : 'variable'

    // Possible values for strokewidth are all numbers and "inherit"
    // where the inherit means take the value from the style (ie. the
    // user-defined stroke-width). Note that the strokewidth is scaled
    // by the minimum scaling that is used to draw the shape (sx, sy).
    const sw = this.desc.getAttribute('strokewidth')
    this.strokeWidth = sw != null ? sw : '1'
  }

  parseConstraints() {
    const conn = this.desc.getElementsByTagName('connections')[0]
    if (conn != null && conn.childNodes && conn.childNodes.length) {
      this.constraints = []
      conn.childNodes.forEach((child: Element) => {
        if (child.nodeType === NodeType.element) {
          this.constraints.push(this.parseConstraint(child))
        }
      })
    }
  }

  parseConstraint(node: Element) {
    const x = Number(node.getAttribute('x'))
    const y = Number(node.getAttribute('y'))
    const name = node.getAttribute('name') || ''
    const perimeter = node.getAttribute('perimeter') === '1'

    return new Constraint({ perimeter, name, point: new Point(x, y) })
  }

  evaluateTextAttribute(node: Element, name: string, shape: Shape) {
    return this.evaluateAttribute(node, name, shape)
  }

  evaluateAttribute(node: Element, name: string, shape: Shape) {
    let result = node.getAttribute(name)
    if (result == null) {
      const text = util.getTextContent(node as HTMLElement)

      if (text != null && Stencil.allowEval) {
        const func = util.evalString(text)
        if (typeof (func) === 'function') {
          result = func(shape)
        }
      }
    }

    return result
  }

  /**
   * Draws this stencil inside the given bounds.
   */
  drawShape(
    canvas: SvgCanvas2D,
    shape: Shape,
    x: number, y: number, w: number, h: number,
  ) {
    // TODO: Internal structure (array of special structs?), relative and absolute
    // coordinates (eg. note shape, process vs star, actor etc.), text rendering
    // and non-proportional scaling, how to implement pluggable edge shapes
    // (start, segment, end blocks), pluggable markers, how to implement
    // swimlanes (title area) with this API, add icon, horizontal/vertical
    // label, indicator for all shapes, rotation
    const direction = shape.style.direction
    const aspect = this.computeAspect(shape, x, y, w, h, direction)
    const minScale = Math.min(aspect.width, aspect.height)
    const sw = this.strokeWidth === 'inherit'
      ? (shape.style.strokeWidth || 1)
      : Number(this.strokeWidth) * minScale

    canvas.setStrokeWidth(sw)

    // Draws a transparent rectangle for catching events
    if (shape.style.pointerEvents) {
      canvas.setStrokeColor('none')
      canvas.rect(x, y, w, h)
      canvas.stroke()
      canvas.setStrokeColor(shape.stroke)
    }

    this.drawChildren(
      canvas, shape, x, y, w, h, this.bgNode, aspect, false, true,
    )
    this.drawChildren(
      canvas, shape, x, y, w, h, this.fgNode, aspect, true,
      (
        !shape.outline ||
        !shape.style.backgroundOutline
      ),
    )
  }

  /**
   * Draws this stencil inside the given bounds.
   */
  drawChildren(
    canvas: SvgCanvas2D,
    shape: Shape,
    x: number, y: number, w: number, h: number,
    node: Element,
    aspect: Rectangle,
    disableShadow: boolean,
    paint: boolean,
  ) {
    if (node != null && w > 0 && h > 0) {
      let child = node.firstChild as Element
      while (child != null) {
        if (child.nodeType === NodeType.element) {
          this.drawNode(canvas, shape, child, aspect, disableShadow, paint)
        }
        child = child.nextSibling as Element
      }
    }
  }

  /**
   * Returns a rectangle that contains the offset in x and y and the horizontal
   * and vertical scale in width and height used to draw this shape inside the
   * given `Rect`.
   */
  computeAspect(
    shape: Shape,
    x: number, y: number, w: number, h: number,
    direction?: Direction,
  ) {
    let x0 = x
    let y0 = y
    let sx = w / this.w0
    let sy = h / this.h0

    const inverse = (
      direction === 'north' ||
      direction === 'south'
    )

    if (inverse) {
      sy = w / this.h0
      sx = h / this.w0

      const delta = (w - h) / 2

      x0 += delta
      y0 -= delta
    }

    if (this.aspect === 'fixed') {
      sy = Math.min(sx, sy)
      sx = sy

      // Centers the shape inside the available space
      if (inverse) {
        x0 += (h - this.w0 * sx) / 2
        y0 += (w - this.h0 * sy) / 2
      } else {
        x0 += (w - this.w0 * sx) / 2
        y0 += (h - this.h0 * sy) / 2
      }
    }

    return new Rectangle(x0, y0, sx, sy)
  }

  /**
   * Draws this stencil inside the given bounds.
   */
  drawNode(
    canvas: SvgCanvas2D,
    shape: Shape,
    node: Element,
    aspect: Rectangle,
    disableShadow: boolean,
    paint: boolean,
  ) {
    const name = node.nodeName
    const x0 = aspect.x
    const y0 = aspect.y
    const sx = aspect.width
    const sy = aspect.height
    const minScale = Math.min(sx, sy)

    if (name === 'save') {
      canvas.save()
    } else if (name === 'restore') {
      canvas.restore()
    } else if (paint) {
      if (name === 'path') {
        canvas.begin()
        let parseRegularly = true
        if (node.getAttribute('rounded') === '1') {
          parseRegularly = false

          let pointCount = 0
          const segs: (Point[])[] = []
          const arcSize = Number(node.getAttribute('arcSize'))

          // Renders the elements inside the given path
          let childNode = node.firstChild as Element
          while (childNode != null) {
            if (childNode.nodeType === NodeType.element) {
              const childName = childNode.nodeName
              if (childName === 'move' || childName === 'line') {
                if (childName === 'move' || segs.length === 0) {
                  segs.push([])
                }

                segs[segs.length - 1].push(new Point(
                  x0 + Number(childNode.getAttribute('x')) * sx,
                  y0 + Number(childNode.getAttribute('y')) * sy,
                ))
                pointCount += 1
              } else {
                // We only support move and line for rounded corners
                parseRegularly = true
                break
              }
            }
            childNode = childNode.nextSibling as Element
          }

          if (!parseRegularly && pointCount > 0) {
            for (let i = 0, ii = segs.length; i < ii; i += 1) {
              let close = false
              const ps = segs[i][0]
              const pe = segs[i][segs[i].length - 1]

              if (ps.x === pe.x && ps.y === pe.y) {
                segs[i].pop()
                close = true
              }

              this.paintPoints(canvas, segs[i], true, arcSize, close)
            }
          } else {
            parseRegularly = true
          }
        }
        if (parseRegularly) {
          // Renders the elements inside the given path
          let childNode = node.firstChild
          while (childNode != null) {
            if (childNode.nodeType === NodeType.element) {
              this.drawNode(
                canvas,
                shape,
                childNode as Element,
                aspect,
                disableShadow,
                paint,
              )
            }
            childNode = childNode.nextSibling
          }
        }
      } else if (name === 'close') {
        canvas.close()
      } else if (name === 'move') {
        canvas.moveTo(
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
        )
      } else if (name === 'line') {
        canvas.lineTo(
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
        )
      } else if (name === 'quad') {
        canvas.quadTo(
          x0 + Number(node.getAttribute('x1')) * sx,
          y0 + Number(node.getAttribute('y1')) * sy,
          x0 + Number(node.getAttribute('x2')) * sx,
          y0 + Number(node.getAttribute('y2')) * sy,
        )
      } else if (name === 'curve') {
        canvas.curveTo(
          x0 + Number(node.getAttribute('x1')) * sx,
          y0 + Number(node.getAttribute('y1')) * sy,
          x0 + Number(node.getAttribute('x2')) * sx,
          y0 + Number(node.getAttribute('y2')) * sy,
          x0 + Number(node.getAttribute('x3')) * sx,
          y0 + Number(node.getAttribute('y3')) * sy,
        )
      } else if (name === 'arc') {
        canvas.arcTo(
          Number(node.getAttribute('rx')) * sx,
          Number(node.getAttribute('ry')) * sy,
          Number(node.getAttribute('x-axis-rotation')),
          Number(node.getAttribute('large-arc-flag')),
          Number(node.getAttribute('sweep-flag')),
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
        )
      } else if (name === 'rect') {
        canvas.rect(
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
          Number(node.getAttribute('w')) * sx,
          Number(node.getAttribute('h')) * sy,
        )
      } else if (name === 'roundrect') {
        let arcsize = Number(node.getAttribute('arcsize'))
        if (arcsize === 0) {
          arcsize = constants.RECTANGLE_ROUNDING_FACTOR * 100
        }
        const w = Number(node.getAttribute('w')) * sx
        const h = Number(node.getAttribute('h')) * sy
        const factor = Number(arcsize) / 100
        const r = Math.min(w * factor, h * factor)

        canvas.roundRect(
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
          w, h, r, r,
        )
      } else if (name === 'ellipse') {
        canvas.ellipse(
          x0 + Number(node.getAttribute('x')) * sx,
          y0 + Number(node.getAttribute('y')) * sy,
          Number(node.getAttribute('w')) * sx,
          Number(node.getAttribute('h')) * sy,
        )
      } else if (name === 'image') {
        if (!shape.outline) {
          const src = this.evaluateAttribute(node, 'src', shape)
          canvas.image(
            x0 + Number(node.getAttribute('x')) * sx,
            y0 + Number(node.getAttribute('y')) * sy,
            Number(node.getAttribute('w')) * sx,
            Number(node.getAttribute('h')) * sy,
            src!,
            false,
            node.getAttribute('flipH') === '1',
            node.getAttribute('flipV') === '1',
          )
        }
      } else if (name === 'text') {
        if (!shape.outline) {
          const str = this.evaluateTextAttribute(node, 'str', shape)!
          let rotation = node.getAttribute('vertical') === '1' ? -90 : 0

          if (node.getAttribute('align-shape') === '0') {
            const dr = shape.rotation

            // Depends on flipping
            const flipH = shape.style.flipH === true
            const flipV = shape.style.flipV === true

            if (flipH && flipV) {
              rotation -= dr
            } else if (flipH || flipV) {
              rotation += dr
            } else {
              rotation -= dr
            }
          }

          rotation -= Number(node.getAttribute('rotation') || 0)

          canvas.text(
            x0 + Number(node.getAttribute('x')) * sx,
            y0 + Number(node.getAttribute('y')) * sy,
            0, 0,
            str,
            (node.getAttribute('align') || 'left') as Align,
            (node.getAttribute('valign') || 'top') as VAlign,
            false,
            '',
            '',
            false,
            rotation,
          )
        }
      } else if (name === 'include-shape') {
        const stencil = Stencil.getStencil(node.getAttribute('name')!)
        if (stencil != null) {
          const x = x0 + Number(node.getAttribute('x')) * sx
          const y = y0 + Number(node.getAttribute('y')) * sy
          const w = Number(node.getAttribute('w')) * sx
          const h = Number(node.getAttribute('h')) * sy
          stencil.drawShape(canvas, shape, x, y, w, h)
        }
      } else if (name === 'fillstroke') {
        canvas.fillAndStroke()
      } else if (name === 'fill') {
        canvas.fill()
      } else if (name === 'stroke') {
        canvas.stroke()
      } else if (name === 'strokewidth') {
        const s = (node.getAttribute('fixed') === '1') ? 1 : minScale
        canvas.setStrokeWidth(Number(node.getAttribute('width')) * s)
      } else if (name === 'dashed') {
        canvas.setDashed(node.getAttribute('dashed') === '1')
      } else if (name === 'dashpattern') {
        let value = node.getAttribute('pattern')

        if (value != null) {
          const tmp = value.split(' ')
          const pat = []

          for (let i = 0, ii = tmp.length; i < ii; i += 1) {
            if (tmp[i].length > 0) {
              pat.push(Number(tmp[i]) * minScale)
            }
          }

          value = pat.join(' ')
          canvas.setDashPattern(value)
        }
      } else if (name === 'strokecolor') {
        canvas.setStrokeColor(node.getAttribute('color'))
      } else if (name === 'linecap') {
        canvas.setLineCap(node.getAttribute('cap') as LineCap)
      } else if (name === 'linejoin') {
        canvas.setLineJoin(node.getAttribute('join') as LineJoin)
      } else if (name === 'miterlimit') {
        canvas.setMiterLimit(Number(node.getAttribute('limit')))
      } else if (name === 'fillcolor') {
        canvas.setFillColor(node.getAttribute('color')!)
      } else if (name === 'alpha') {
        canvas.setOpacity(Number(node.getAttribute('alpha')))
      } else if (name === 'fillalpha') {
        canvas.setOpacity(Number(node.getAttribute('alpha')))
      } else if (name === 'strokealpha') {
        canvas.setOpacity(Number(node.getAttribute('alpha')))
      } else if (name === 'fontcolor') {
        canvas.setFontColor(node.getAttribute('color')!)
      } else if (name === 'fontstyle') {
        canvas.setFontStyle(Number(node.getAttribute('style')))
      } else if (name === 'fontfamily') {
        canvas.setFontFamily(node.getAttribute('family')!)
      } else if (name === 'fontsize') {
        canvas.setFontSize(Number(node.getAttribute('size')) * minScale)
      }

      if (
        disableShadow &&
        (name === 'fillstroke' || name === 'fill' || name === 'stroke')
      ) {
        // tslint:disable-next-line
        disableShadow = false
        canvas.setShadow(false)
      }
    }
  }
}

export namespace Stencil {
  /**
   * Static global variable that specifies the default value for the
   * localized attribute of the text element. Default is `false`.
   */
  export let defaultLocalized = false

  /**
   * Static global switch that specifies if the use of eval is allowed
   * for evaluating text content and images. Default is `false`. Set
   * this to `true` if stencils can not contain user input.
   */
  export let allowEval = false

  export const stencils: { [name: string]: Stencil } = {}

  export function addStencil(name: string, stencil: Stencil) {
    stencils[name] = stencil
  }

  export function getStencil(name?: string) {
    return name != null ? stencils[name] : null
  }
}
