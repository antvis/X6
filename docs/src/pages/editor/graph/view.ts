import { View, Rectangle, NodeType, util } from '../../../../../src'
import { RectangleShape } from '../../../../../src/shape'
import { EditorGraph } from './graph'

export class GraphView extends View {
  graph: EditorGraph
  x0: number
  y0: number

  validate() {
    if (this.graph.container && util.hasScrollbars(this.graph.container)) {
      const size = this.graph.getPageSize()
      const padding = this.graph.getPagePadding()

      this.translate.x = padding[0] - (this.x0 || 0) * size.width
      this.translate.y = padding[1] - (this.y0 || 0) * size.height
    }

    super.validate()
  }

  validateBackgroundPage() {
    const graph = this.graph
    if (graph.container) {
      if (graph.pageVisible) {
        const bounds = this.getBackgroundPageBounds()

        bounds.x += 1
        bounds.y += 1

        if (this.backgroundPageShape == null) {
          let firstChild = graph.container.firstChild as HTMLElement
          while (firstChild && firstChild.nodeType != NodeType.element) {
            firstChild = firstChild.nextSibling as HTMLElement
          }

          if (firstChild != null) {
            this.backgroundPageShape = new RectangleShape(bounds, '#ffffff', '#ffffff')
            this.backgroundPageShape.scale = 1
            this.backgroundPageShape.shadow = true
            this.backgroundPageShape.dialect = 'html'
            this.backgroundPageShape.className = 'x6-editor-background'
            this.backgroundPageShape.init(graph.container)
            firstChild.style.position = 'absolute'
            graph.container.insertBefore(this.backgroundPageShape.elem!, firstChild)
            this.backgroundPageShape.redraw()
            this.setupBackgroundPage()
          }
        } else {
          this.backgroundPageShape.scale = 1
          this.backgroundPageShape.bounds = bounds
          this.backgroundPageShape.redraw()
        }
      } else if (this.backgroundPageShape != null) {
        this.backgroundPageShape.dispose()
        this.backgroundPageShape = null
      }

      this.validateBackgroundStyles()
    }
  }

  gridSteps: number = 4
  minGridSize: number = 4
  gridColor: string = '#e0e0e0'

  validateBackgroundStyles() {
    const graph = this.graph
    if (graph.isGridEnabled() && this.backgroundPageShape != null) {
      const s = this.scale
      const t = this.translate
      const b = this.getBackgroundPageBounds()
      const x = 1 + b.x
      const y = 1 + b.y

      const phase = graph.gridSize * this.scale * this.gridSteps
      const ox = -Math.round(phase - util.mod(t.x * s - x, phase))
      const oy = -Math.round(phase - util.mod(t.y * s - y, phase))
      const position = util.toPx(ox) + ' ' + util.toPx(oy)

      const style = this.backgroundPageShape.elem!.style
      style.backgroundColor = '#ffffff'
      style.backgroundImage = this.createGridBackgroundImage()
      style.backgroundPosition = position
    }
  }

  createGridBackgroundImage(color: string = this.gridColor) {
    let tmp = this.graph.gridSize * this.scale
    while (tmp < this.minGridSize) { tmp *= 2 }
    const tmp2 = this.gridSteps * tmp
    const d = []
    for (let i = 1, ii = this.gridSteps; i < ii; i += 1) {
      const tmp3 = i * tmp
      d.push(`M 0 ${tmp3} L ${tmp2} ${tmp3} M ${tmp3} 0 L ${tmp3} ${tmp2}`)
    }

    const size = tmp2
    const svg =
      `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      '  <defs>' +
      `    <pattern id="grid" width="${tmp2}" height="${tmp2}" patternUnits="userSpaceOnUse">` +
      `      <path d="${d.join(' ')}" fill="none" stroke="${color}" opacity="0.2" stroke-width="1"/>` +
      `      <path d="M ${tmp2} 0 L 0 0 0 ${tmp2}" fill="none" stroke="${color}" stroke-width="1"/>` +
      '    </pattern>' +
      '  </defs>' +
      '  <rect width="100%" height="100%" fill="url(#grid)"/>' +
      '</svg>'

    const image = unescape(encodeURIComponent(svg))
    const base64 = `url(data:image/svg+xml;base64,${window.btoa(image)})`
    return base64
  }

  getBackgroundPageBounds() {
    const s = this.scale
    const t = this.translate
    const gb = this.getGraphBounds()

    // Computes unscaled, untranslated graph bounds
    const x = gb.width > 0 ? gb.x / s - t.x : 0
    const y = gb.height > 0 ? gb.y / s - t.y : 0
    const w = gb.width / s
    const h = gb.height / s

    const ps = this.graph.pageScale
    const fmt = this.graph.pageFormat

    const pw = fmt.width * ps
    const ph = fmt.height * ps

    const x0 = Math.floor(Math.min(0, x) / pw)
    const y0 = Math.floor(Math.min(0, y) / ph)
    const xe = Math.ceil(Math.max(1, x + w) / pw)
    const ye = Math.ceil(Math.max(1, y + h) / ph)

    const rows = xe - x0
    const cols = ye - y0

    return new Rectangle(
      s * (t.x + x0 * pw),
      s * (t.y + y0 * ph),
      s * rows * pw,
      s * cols * ph,
    )
  }
}
