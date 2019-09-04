import { CellMarker } from './cell-marker'
import { IMouseHandler } from './handler-mouse'
import { Graph, Cell } from '../core'
import { CustomMouseEvent } from '../common'

export class CellTracker extends CellMarker implements IMouseHandler {
  constructor(
    graph: Graph,
    color: string,
    getCell?: (e: CustomMouseEvent) => Cell,
  ) {
    super(graph, { validColor: color })

    if (getCell != null) {
      this.getCell = getCell
    }

    this.graph.addMouseListener(this)
  }

  mouseDown(e: CustomMouseEvent, sender: any) { }

  mouseMove(e: CustomMouseEvent, sender: any) {
    if (this.isEnabled()) {
      this.process(e)
    }
  }

  mouseUp(e: CustomMouseEvent, sender: any) { }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)

    super.dispose()
  }
}
