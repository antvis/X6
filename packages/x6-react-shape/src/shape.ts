import ReactDOM from 'react-dom'
import { DomUtil, Shape, Rectangle, SvgCanvas2D } from '@antv/x6'
import { Component } from './extend'

export class ReactShape extends Shape.Rectangle {
  container: HTMLElement | null

  constructor(public component?: Component | null) {
    super(new Rectangle())
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.drawBackground(c, x, y, w, h)
    if (!this.outline && !this.facade) {
      this.renderReactComponent()
    }
  }

  renderReactComponent() {
    const bounds = this.bounds.clone()
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

    if (this.container == null) {
      this.container = DomUtil.createElement('div')
      if (this.component != null) {
        ReactDOM.render(this.component, this.container)
      }
    }

    const container = this.container
    container.style.overflow = 'hidden'
    container.style.width = DomUtil.toPx(Math.round(bounds.width / this.scale))
    container.style.height = DomUtil.toPx(
      Math.round(bounds.height / this.scale),
    )
    container.style.transform = `scale(${this.scale})`
    container.style.transformOrigin = '0 0'

    div.appendChild(this.container)

    if (this.elem) {
      this.elem.appendChild(g)
    }
  }

  @Shape.Rectangle.dispose()
  dispose() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container)
      this.container = null
    }
  }
}
