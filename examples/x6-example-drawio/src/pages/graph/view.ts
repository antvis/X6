import { View, Rectangle, util } from '@antv/x6'
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
