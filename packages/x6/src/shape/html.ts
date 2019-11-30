import * as util from '../util'
import { SvgCanvas2D } from '../canvas'
import { RectangleShape } from './rectangle'
import { Rectangle } from '../struct'

export class HtmlShape extends RectangleShape {
  constructor(
    public markup: HTMLElement | string | null,
    public css: {
      [selector: string]: Partial<CSSStyleDeclaration>
    }
  ) {
    super(new Rectangle())
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.drawBackground(c, x, y, w, h)
    this.renderHtml()
  }

  renderHtml() {
    const bounds = this.bounds

    let transform = `translate(${bounds.x},${bounds.y})`
    const deg = this.getShapeRotation()
    if (deg !== 0) {
      transform += ` rotate(${deg},${bounds.width / 2},${bounds.height / 2})`
    }

    const g = util.createSvgElement('g')
    g.setAttribute('transform', transform)

    const fo = util.createSvgElement('foreignObject')
    util.setAttributes(fo, { width: bounds.width, height: bounds.height })

    const div = util.createElement('div')
    div.style.width = util.toPx(bounds.width)
    div.style.height = util.toPx(bounds.height)
    div.style.overflow = 'hidden'

    g.appendChild(fo)
    fo.appendChild(div)

    let wrap = div
    if (this.scale !== 1) {
      wrap = util.createElement('div')
      wrap.style.overflow = 'hidden'
      wrap.style.width = util.toPx(Math.round(bounds.width / this.scale))
      wrap.style.height = util.toPx(Math.round(bounds.height / this.scale))
      wrap.style.transform = `scale(${this.scale})`
      wrap.style.transformOrigin = '0 0'
      div.appendChild(wrap)
    }

    if (this.markup != null) {
      if (typeof this.markup === 'string') {
        wrap.innerHTML = this.markup
      } else {
        wrap.appendChild(this.markup)
      }
    }

    this.applyCss(wrap)

    if (this.elem) {
      this.elem.appendChild(g)
    }
  }

  applyCss(div: HTMLElement) {
    if (this.css != null) {
      Object.keys(this.css).forEach(selector => {
        const item = this.css[selector]
        div.querySelectorAll(selector).forEach((elem: HTMLElement) => {
          Object.keys(item).forEach(key => {
            (elem.style as any)[key] = (item as any)[key]
          })
        })
      })
    }
  }
}
