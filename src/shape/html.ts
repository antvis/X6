import * as util from '../util'
import { Shape } from './shape'

export class HtmlShape extends Shape {
  constructor(
    public markup: HTMLElement | string | null,
    public css: {
      [selector: string]: Partial<CSSStyleDeclaration>,
    },
  ) {
    super()
  }

  renderHtml() {
    const bounds = this.bounds

    const g = util.createSvgElement('g')
    let transform = `translate(${bounds.x},${bounds.y})`
    const deg = this.getShapeRotation()
    if (deg !== 0) {
      transform += ` rotate(${deg},${bounds.width / 2},${bounds.height / 2})`
    }

    g.setAttribute('transform', transform)

    const fo = util.createSvgElement('foreignObject')
    util.setAttributes(fo, { width: bounds.width, height: bounds.height })

    const div = util.createElement('div')
    this.updateHtmlBounds(div)
    this.updateHtmlFilters(div)
    this.updateHtmlColors(div)
    div.style.left = ''
    div.style.top = ''

    g.appendChild(fo)
    fo.appendChild(div)

    let wrap = div
    if (this.scale !== 1) {
      wrap = util.createElement('div')
      wrap.style.overflow = 'hidden'
      const width = Math.round(parseInt(div.style.width!, 10) / this.scale)
      const height = Math.round(parseInt(div.style.height!, 10) / this.scale)
      wrap.style.width = `${width || 0}px`
      wrap.style.height = `${height || 0}px`
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
      Object.keys(this.css).forEach((selector) => {
        const item = this.css[selector]
        div.querySelectorAll(selector).forEach((elem: HTMLElement) => {
          Object.keys(item).forEach((key) => {
            (elem.style as any)[key] = (item as any)[key]
          })
        })
      })
    }
  }

  redrawSvgShape() {
    this.renderHtml()
  }

  redrawHtmlShape() {
    this.renderHtml()
  }
}
