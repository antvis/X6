import { Point } from '../geometry'
import { StringExt } from '../util'
import { DomUtil } from '../dom'
import { Shape } from './shape-base'
import { SvgCanvas2D } from '../canvas'
import { NodeType } from '../enum'
import { Anchor } from '../struct'
import { Direction, Align, VAlign, LineCap, LineJoin } from '../types'
import { globals } from '../option'

export class Stencil extends Shape {
  width: number
  height: number
  aspect: string
  strokeWidth: number
  desc: Element
  bgNode: Element
  fgNode: Element
  anchors: Anchor[]

  constructor(desc: Element) {
    super()
    this.desc = desc
    this.parseDescription()
    this.parseAnchors()
  }

  parseDescription() {
    this.fgNode = this.desc.getElementsByTagName('foreground')[0] as Element
    this.bgNode = this.desc.getElementsByTagName('background')[0] as Element
    this.width = this.getAttributeNumber(this.desc, 'w', 100)
    this.height = this.getAttributeNumber(this.desc, 'h', 100)

    // Possible values for aspect are: `variable` and `fixed`
    // - variable means fill the available space
    // - fixed means use w0 and h0 to compute the aspect
    const aspect = this.desc.getAttribute('aspect')
    this.aspect = aspect != null ? aspect : 'variable'

    const sw = this.desc.getAttribute('strokewidth')
    if (sw == null || sw === '' || sw === 'inherit') {
      this.strokeWidth = -1
    } else {
      this.strokeWidth = this.getAttributeNumber(this.desc, 'strokewidth', 1)
    }
  }

  parseAnchors() {
    const elem = this.desc.getElementsByTagName('anchors')[0]
    if (elem != null && elem.childNodes && elem.childNodes.length) {
      this.anchors = []
      elem.childNodes.forEach((child: Element) => {
        if (child.nodeType === NodeType.element) {
          this.anchors.push(this.parseAnchor(child))
        }
      })
    }
  }

  parseAnchor(node: Element) {
    const x = Number(node.getAttribute('x'))
    const y = Number(node.getAttribute('y'))
    const name = node.getAttribute('name') || ''
    const perimeter = node.getAttribute('perimeter') === '1'

    return new Anchor({ x, y, name, perimeter })
  }

  evaluateAttribute(node: Element, name: string, shape: Shape) {
    let result = node.getAttribute(name)
    if (result == null) {
      const text = DomUtil.getTextContent(node as HTMLElement)
      if (text != null && Stencil.allowEval) {
        const func = StringExt.eval(text)
        if (typeof func === 'function') {
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
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const direction = shape.style.direction
    const aspect = this.computeAspect(shape, x, y, w, h, direction)
    const minScale = Math.min(aspect.sx, aspect.sy)
    const sw =
      this.strokeWidth === -1
        ? shape.style.strokeWidth || 1
        : this.strokeWidth * minScale

    canvas.setStrokeWidth(sw)

    // Draws a transparent rectangle for catching events
    if (shape.style.pointerEvents) {
      canvas.setStrokeColor('none')
      canvas.rect(x, y, w, h)
      canvas.stroke()
      canvas.setStrokeColor(shape.strokeColor)
    }

    this.drawChildren(
      canvas,
      shape,
      x,
      y,
      w,
      h,
      this.bgNode,
      aspect,
      false,
      true,
    )

    this.drawChildren(
      canvas,
      shape,
      x,
      y,
      w,
      h,
      this.fgNode,
      aspect,
      true,
      !shape.outline || !shape.style.backgroundOutline,
    )
  }

  drawChildren(
    canvas: SvgCanvas2D,
    shape: Shape,
    x: number,
    y: number,
    w: number,
    h: number,
    node: Element,
    aspect: { x: number; y: number; sx: number; sy: number },
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

  drawNode(
    canvas: SvgCanvas2D,
    shape: Shape,
    node: Element,
    aspect: { x: number; y: number; sx: number; sy: number },
    disableShadow: boolean,
    paint: boolean,
  ) {
    const x0 = aspect.x
    const y0 = aspect.y
    const sx = aspect.sx
    const sy = aspect.sy
    const minScale = Math.min(sx, sy)
    const name = DomUtil.getNodeName(node)

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
          const segs: Point[][] = []
          const arcSize = this.getAttributeNumber(node, 'arcSize')

          // Renders the elements inside the given path
          let childNode = node.firstChild as Element
          while (childNode != null) {
            if (childNode.nodeType === NodeType.element) {
              const childName = DomUtil.getNodeName(childNode)
              if (childName === 'move' || childName === 'line') {
                if (childName === 'move' || segs.length === 0) {
                  segs.push([])
                }

                segs[segs.length - 1].push(
                  new Point(
                    x0 + this.getAttributeNumber(node, 'x') * sx,
                    y0 + this.getAttributeNumber(node, 'y') * sy,
                  ),
                )
                pointCount += 1
              } else {
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

              this.drawPoints(canvas, segs[i], true, arcSize, close)
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
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
        )
      } else if (name === 'line') {
        canvas.lineTo(
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
        )
      } else if (name === 'quad') {
        canvas.quadTo(
          x0 + this.getAttributeNumber(node, 'x1') * sx,
          y0 + this.getAttributeNumber(node, 'y1') * sy,
          x0 + this.getAttributeNumber(node, 'x2') * sx,
          y0 + this.getAttributeNumber(node, 'y2') * sy,
        )
      } else if (name === 'curve') {
        canvas.curveTo(
          x0 + this.getAttributeNumber(node, 'x1') * sx,
          y0 + this.getAttributeNumber(node, 'y1') * sy,
          x0 + this.getAttributeNumber(node, 'x2') * sx,
          y0 + this.getAttributeNumber(node, 'y2') * sy,
          x0 + this.getAttributeNumber(node, 'x3') * sx,
          y0 + this.getAttributeNumber(node, 'y3') * sy,
        )
      } else if (name === 'arc') {
        canvas.arcTo(
          this.getAttributeNumber(node, 'rx') * sx,
          this.getAttributeNumber(node, 'ry') * sy,
          this.getAttributeNumber(node, 'x-axis-rotation'),
          this.getAttributeNumber(node, 'large-arc-flag'),
          this.getAttributeNumber(node, 'sweep-flag'),
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
        )
      } else if (name === 'rect') {
        canvas.rect(
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
          this.getAttributeNumber(node, 'w') * sx,
          this.getAttributeNumber(node, 'h') * sy,
        )
      } else if (name === 'roundrect') {
        const arcsize =
          this.getAttributeNumber(node, 'arcsize') ||
          globals.rectangleRoundFactor * 100
        const w = this.getAttributeNumber(node, 'w') * sx
        const h = this.getAttributeNumber(node, 'h') * sy
        const f = arcsize / 100
        const r = Math.min(w * f, h * f)

        canvas.roundRect(
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
          w,
          h,
          r,
          r,
        )
      } else if (name === 'ellipse') {
        canvas.ellipse(
          x0 + this.getAttributeNumber(node, 'x') * sx,
          y0 + this.getAttributeNumber(node, 'y') * sy,
          this.getAttributeNumber(node, 'w') * sx,
          this.getAttributeNumber(node, 'h') * sy,
        )
      } else if (name === 'image') {
        if (!shape.outline) {
          const src = this.evaluateAttribute(node, 'src', shape)
          canvas.image(
            x0 + this.getAttributeNumber(node, 'x') * sx,
            y0 + this.getAttributeNumber(node, 'y') * sy,
            this.getAttributeNumber(node, 'w') * sx,
            this.getAttributeNumber(node, 'h') * sy,
            src!,
            false,
            node.getAttribute('flipH') === '1',
            node.getAttribute('flipV') === '1',
          )
        }
      } else if (name === 'text') {
        if (!shape.outline) {
          const str = this.evaluateAttribute(node, 'str', shape)!
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

          rotation -= this.getAttributeNumber(node, 'rotation')

          canvas.drawText(
            x0 + this.getAttributeNumber(node, 'x') * sx,
            y0 + this.getAttributeNumber(node, 'y') * sy,
            0,
            0,
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
          const x = x0 + this.getAttributeNumber(node, 'x') * sx
          const y = y0 + this.getAttributeNumber(node, 'x') * sy
          const w = this.getAttributeNumber(node, 'w') * sx
          const h = this.getAttributeNumber(node, 'h') * sy
          stencil.drawShape(canvas, shape, x, y, w, h)
        }
      } else if (name === 'fillstroke') {
        canvas.fillAndStroke()
      } else if (name === 'fill') {
        canvas.fill()
      } else if (name === 'stroke') {
        canvas.stroke()
      } else if (name === 'strokewidth') {
        const s = node.getAttribute('fixed') === '1' ? 1 : minScale
        canvas.setStrokeWidth(this.getAttributeNumber(node, 'width') * s)
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
      } else if (name === 'opacity') {
        canvas.setOpacity(this.getAttributeNumber(node, 'opacity'))
      } else if (name === 'fillopacity') {
        canvas.setOpacity(this.getAttributeNumber(node, 'opacity'))
      } else if (name === 'strokeopacity') {
        canvas.setOpacity(this.getAttributeNumber(node, 'opacity'))
      } else if (name === 'fontcolor') {
        canvas.setFontColor(node.getAttribute('color')!)
      } else if (name === 'fontstyle') {
        canvas.setFontStyle(Number(node.getAttribute('style')))
      } else if (name === 'fontfamily') {
        canvas.setFontFamily(node.getAttribute('family')!)
      } else if (name === 'fontsize') {
        canvas.setFontSize(this.getAttributeNumber(node, 'size') * minScale)
      }

      if (
        disableShadow &&
        (name === 'fillstroke' || name === 'fill' || name === 'stroke')
      ) {
        // no used in the following code,
        // disableShadow = false
        canvas.setShadow(false)
      }
    }
  }

  /**
   * Returns a object that contains the offset in `x` and `y` and
   * the horizontal and vertical scale in `sx` and `sy`.
   */
  computeAspect(
    shape: Shape,
    x: number,
    y: number,
    w: number,
    h: number,
    direction?: Direction,
  ) {
    let x0 = x
    let y0 = y
    let sx = w / this.width
    let sy = h / this.height

    const inverse = direction === 'north' || direction === 'south'
    if (inverse) {
      sy = w / this.height
      sx = h / this.width

      const delta = (w - h) / 2

      x0 += delta
      y0 -= delta
    }

    if (this.aspect === 'fixed') {
      sy = Math.min(sx, sy)
      sx = sy

      // Centers the shape inside the available space
      if (inverse) {
        x0 += (h - this.width * sx) / 2
        y0 += (w - this.height * sy) / 2
      } else {
        x0 += (w - this.width * sx) / 2
        y0 += (h - this.height * sy) / 2
      }
    }

    return { sx, sy, x: x0, y: y0 }
  }

  protected getAttributeNumber(
    node: Element,
    attrName: string,
    defaultValue: number = 0,
  ) {
    const raw = node.getAttribute(attrName)
    if (raw == null || raw === '') {
      return defaultValue
    }

    const num = parseFloat(raw)
    if (isNaN(num) || !isFinite(num)) {
      return defaultValue
    }

    return num
  }
}

export namespace Stencil {
  /**
   * Static global variable that specifies the default value for
   * the localized attribute of the text element.
   *
   * Default is `false`.
   */
  export let defaultLocalized = false

  /**
   * Static global switch that specifies if the use of eval is
   * allowed for evaluating text content and images.
   *
   * Default is `false`.
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
