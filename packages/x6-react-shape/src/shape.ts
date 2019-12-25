import ReactDOM from 'react-dom'
import { util, Shape, Rectangle, SvgCanvas2D } from '@antv/x6'
import { Component } from './hack'

export class ReactShape extends Shape.Rectangle {
  container: HTMLElement | null

  constructor(public component?: Component | null) {
    super(new Rectangle())
  }

  protected clean() {
    this.unmount()
    super.clean()
  }

  protected unmount() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container)
      this.container = null
    }
  }

  drawBackground(c: SvgCanvas2D, x: number, y: number, w: number, h: number) {
    super.drawBackground(c, x, y, w, h)
    if (!this.outline) {
      this.renderReactComponent()
    }
  }

  renderReactComponent() {
    const bounds = this.bounds.clone()
    bounds.width += 1
    bounds.height += 1
    bounds.x -= 1
    bounds.y -= 1

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

    const container = util.createElement('div')
    container.style.overflow = 'hidden'
    container.style.width = util.toPx(Math.round(bounds.width / this.scale))
    container.style.height = util.toPx(Math.round(bounds.height / this.scale))
    container.style.transform = `scale(${this.scale})`
    container.style.transformOrigin = '0 0'
    div.appendChild(container)

    if (this.component != null) {
      this.container = container
      ReactDOM.render(this.component, container)
    } else {
      this.container = null
    }

    if (this.elem) {
      this.elem.appendChild(g)
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.unmount()
    super.dispose()
  }
}
