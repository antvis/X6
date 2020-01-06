import { Point, Rectangle } from '../geometry'
import { Polyline } from '../shape'
import { BaseManager } from './base-manager'

export class PageBreakManager extends BaseManager {
  protected verticalPageBreaks: Polyline[]
  protected horizontalPageBreaks: Polyline[]

  updatePageBreaks(visible: boolean, width: number, height: number) {
    if (this.graph.infinite) {
      this.updatePageBreaksInfinite(visible, width, height)
    } else {
      this.updatePageBreaksNormal(visible, width, height)
    }
  }

  updatePageBreaksNormal(visible: boolean, width: number, height: number) {
    const s = this.view.scale
    const t = this.view.translate
    const ps = s * this.graph.pageScale
    const fmt = this.graph.pageFormat
    const pb = new Rectangle(0, 0, fmt.width * ps, fmt.height * ps)
    const gb = this.graph.getGraphBounds().clone()

    pb.x = Math.floor((gb.x - t.x * s) / pb.width) * pb.width + t.x * s
    pb.y = Math.floor((gb.y - t.y * s) / pb.height) * pb.height + t.y * s

    gb.width = Math.max(1, gb.width)
    gb.height = Math.max(1, gb.height)
    gb.width = Math.ceil((gb.width + (gb.x - pb.x)) / pb.width) * pb.width
    gb.height = Math.ceil((gb.height + (gb.y - pb.y)) / pb.height) * pb.height

    if (visible) {
      // tslint:disable-next-line
      visible = Math.min(pb.width, pb.height) > this.graph.pageBreakMinDist
    }

    const hCount = visible ? Math.ceil(gb.height / pb.height) + 1 : 0
    const vCount = visible ? Math.ceil(gb.width / pb.width) + 1 : 0
    const right = (vCount - 1) * pb.width
    const bottom = (hCount - 1) * pb.height

    this.drawPageBreaks(true, hCount, pb, right, bottom, false)
    this.drawPageBreaks(false, vCount, pb, right, bottom, false)
  }

  updatePageBreaksInfinite(visible: boolean, width: number, height: number) {
    const ps = this.view.scale * this.graph.pageScale
    const fmt = this.graph.pageFormat
    const gb = this.view.getBackgroundPageBounds()
    const pb = new Rectangle(gb.x, gb.y, fmt.width * ps, fmt.height * ps)

    if (visible) {
      // tslint:disable-next-line
      visible = Math.min(pb.width, pb.height) > this.graph.pageBreakMinDist
    }

    const right = gb.x + gb.width
    const bottom = gb.y + gb.height
    const hCount = visible ? Math.ceil(gb.height / pb.height) - 1 : 0
    const vCount = visible ? Math.ceil(gb.width / pb.width) - 1 : 0

    this.drawPageBreaks(true, hCount, pb, right, bottom, true)
    this.drawPageBreaks(false, vCount, pb, right, bottom, true)
  }

  protected drawPageBreaks(
    horizontal: boolean,
    count: number,
    bounds: Rectangle,
    right: number,
    bottom: number,
    infinite: boolean,
  ) {
    if (horizontal) {
      if (this.horizontalPageBreaks == null) {
        this.horizontalPageBreaks = []
      }
    } else {
      if (this.verticalPageBreaks == null) {
        this.verticalPageBreaks = []
      }
    }

    const breaks = horizontal
      ? this.horizontalPageBreaks
      : this.verticalPageBreaks

    for (let i = 0; i <= count; i += 1) {
      const points: Point[] = []
      if (infinite) {
        if (horizontal) {
          const y = Math.round(bounds.y + (i + 1) * bounds.height)
          points.push(
            new Point(Math.round(bounds.x), y),
            new Point(Math.round(right), y),
          )
        } else {
          const x = Math.round(bounds.x + (i + 1) * bounds.width)
          points.push(
            new Point(x, Math.round(bounds.y)),
            new Point(x, Math.round(bottom)),
          )
        }
      } else {
        if (horizontal) {
          const y = Math.round(bounds.y + i * bounds.height)
          points.push(
            new Point(Math.round(bounds.x), y),
            new Point(Math.round(bounds.x + right), y),
          )
        } else {
          const x = Math.round(bounds.x + i * bounds.width)
          points.push(
            new Point(x, Math.round(bounds.y)),
            new Point(x, Math.round(bounds.y + bottom)),
          )
        }
      }

      if (breaks[i] != null) {
        breaks[i].points = points
        breaks[i].redraw()
      } else {
        const line = new Polyline(points, this.graph.pageBreakColor)
        line.dialect = this.graph.dialect
        line.dashed = this.graph.pageBreakDashed
        line.pointerEvents = false
        line.init(this.view.getBackgroundPane())
        line.redraw()
        breaks[i] = line
      }
    }

    // clean
    for (let i = count; i < breaks.length; i += 1) {
      breaks[i].dispose()
    }

    breaks.splice(count, breaks.length - count)
  }
}
