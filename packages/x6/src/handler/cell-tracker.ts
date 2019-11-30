import { CellMarker } from './cell-marker'
import { IMouseHandler } from './handler-mouse'
import { Graph, Cell } from '../core'
import { MouseEventEx, Disposable } from '../common'

export class CellTracker extends CellMarker implements IMouseHandler {
  constructor(
    graph: Graph,
    color: string,
    getCell?: (e: MouseEventEx) => Cell
  ) {
    super(graph, { validColor: color })

    if (getCell != null) {
      this.getCell = getCell
    }

    this.graph.addMouseListener(this)
  }

  mouseDown(e: MouseEventEx, sender: any) {}

  mouseMove(e: MouseEventEx, sender: any) {
    if (this.isEnabled()) {
      this.process(e)
    }
  }

  mouseUp(e: MouseEventEx, sender: any) {}

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
  }
}
