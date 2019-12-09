import { Polyline } from '../shape'
import { Rectangle, Point } from '../struct'
import { BaseManager } from './base-manager'

export class PageBreakManager extends BaseManager {
  protected verticalPageBreaks: Polyline[]
  protected horizontalPageBreaks: Polyline[]

  updatePageBreaks(visible: boolean, width: number, height: number) {
    const s = this.view.scale
    const t = this.view.translate
    const fmt = this.graph.pageFormat
    const ps = s * this.graph.pageScale
    const bounds = new Rectangle(0, 0, fmt.width * ps, fmt.height * ps)

    const gb = this.graph.getGraphBounds().clone()
    gb.width = Math.max(1, gb.width)
    gb.height = Math.max(1, gb.height)

    bounds.x =
      Math.floor((gb.x - t.x * s) / bounds.width) * bounds.width + t.x * s
    bounds.y =
      Math.floor((gb.y - t.y * s) / bounds.height) * bounds.height + t.y * s

    gb.width =
      Math.ceil((gb.width + (gb.x - bounds.x)) / bounds.width) * bounds.width
    gb.height =
      Math.ceil((gb.height + (gb.y - bounds.y)) / bounds.height) * bounds.height

    // Does not show page breaks if the scale is too small
    // tslint:disable-next-line
    visible =
      visible &&
      Math.min(bounds.width, bounds.height) > this.graph.pageBreakMinDist

    const hCount = visible ? Math.ceil(gb.height / bounds.height) + 1 : 0
    const vCount = visible ? Math.ceil(gb.width / bounds.width) + 1 : 0
    const right = (vCount - 1) * bounds.width
    const bottom = (hCount - 1) * bounds.height

    if (this.horizontalPageBreaks == null && hCount > 0) {
      this.horizontalPageBreaks = []
    }

    if (this.verticalPageBreaks == null && vCount > 0) {
      this.verticalPageBreaks = []
    }

    const drawPageBreaks = (breaks: Polyline[]) => {
      if (breaks != null) {
        const count = breaks === this.horizontalPageBreaks ? hCount : vCount

        for (let i = 0; i <= count; i += 1) {
          const pts =
            breaks === this.horizontalPageBreaks
              ? [
                  new Point(
                    Math.round(bounds.x),
                    Math.round(bounds.y + i * bounds.height),
                  ),
                  new Point(
                    Math.round(bounds.x + right),
                    Math.round(bounds.y + i * bounds.height),
                  ),
                ]
              : [
                  new Point(
                    Math.round(bounds.x + i * bounds.width),
                    Math.round(bounds.y),
                  ),
                  new Point(
                    Math.round(bounds.x + i * bounds.width),
                    Math.round(bounds.y + bottom),
                  ),
                ]

          if (breaks[i] != null) {
            breaks[i].points = pts
            breaks[i].redraw()
          } else {
            const pageBreak = new Polyline(pts, this.graph.pageBreakColor)
            pageBreak.dialect = this.graph.dialect
            pageBreak.dashed = this.graph.pageBreakDashed
            pageBreak.pointerEvents = false
            pageBreak.init(this.view.getBackgroundPane())
            pageBreak.redraw()

            breaks[i] = pageBreak
          }
        }

        for (let i = count; i < breaks.length; i += 1) {
          breaks[i].dispose()
        }

        breaks.splice(count, breaks.length - count)
      }
    }

    drawPageBreaks(this.horizontalPageBreaks)
    drawPageBreaks(this.verticalPageBreaks)

    return this
  }
}
