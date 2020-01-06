import { DomUtil } from '../dom'
import { Rectangle } from '../geometry'
import { SvgCanvas2D } from '../canvas'
import { RectangleShape } from './rectangle'

export class HtmlShape extends RectangleShape {
  constructor(
    public markup: HTMLElement | string | null,
    public css: {
      [selector: string]: Partial<CSSStyleDeclaration>
    },
  ) {
    super(new Rectangle())
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.drawBackground(c, x, y, w, h)
    // HTML 节点踩了一个坑：之前忘记下面这行判断，导致连线时连不到 Group 中的节点。
    // 因为连线时首先触发了 Group 的连线判断，发现这个 Group 可以被连线，然后就自动
    // 创建一个 CellHighlight 组件来高亮了该 Group，就是因为忘记下面这行代码，导致
    // 所有的鼠标交互都被这个 CellHighlight 中的 foreignObject 捕获了。
    if (!this.outline && !this.facade) {
      this.renderHtml()
    }
  }

  renderHtml() {
    const bounds = this.bounds.clone()

    // fix: anchors not align with the center of html border
    // see: https://stackoverflow.com/a/7273346
    // bounds.width += 1
    // bounds.height += 1
    // bounds.x -= 1
    // bounds.y -= 1

    let transform = `translate(${bounds.x},${bounds.y})`
    const deg = this.getShapeRotation()
    if (deg !== 0) {
      transform += ` rotate(${deg},${bounds.width / 2},${bounds.height / 2})`
    }

    const g = DomUtil.createSvgElement('g')
    g.setAttribute('transform', transform)

    const fo = DomUtil.createSvgElement('foreignObject')
    DomUtil.setAttributes(fo, { width: bounds.width, height: bounds.height })

    const div = DomUtil.createElement('div')
    div.style.width = DomUtil.toPx(bounds.width)
    div.style.height = DomUtil.toPx(bounds.height)
    div.style.overflow = 'hidden'

    g.appendChild(fo)
    fo.appendChild(div)

    let wrap = div
    if (this.scale !== 1) {
      wrap = DomUtil.createElement('div')
      wrap.style.overflow = 'hidden'
      wrap.style.width = DomUtil.toPx(Math.round(bounds.width / this.scale))
      wrap.style.height = DomUtil.toPx(Math.round(bounds.height / this.scale))
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
            const style = elem.style as any
            style[key] = (item as any)[key]
          })
        })
      })
    }
  }
}
