import { Cell } from '../core/cell'
import { Graph } from '../graph'
import { CellMarker } from './cell-marker'
import { MouseEventEx } from './mouse-event'
import { IMouseHandler } from './mouse-handler'

export class CellTracker extends CellMarker implements IMouseHandler {
  constructor(
    graph: Graph,
    color: string,
    getCell?: (e: MouseEventEx) => Cell,
  ) {
    super(graph, { validColor: color })

    if (getCell != null) {
      this.getCell = getCell
    }

    this.graph.addHandler(this)
  }

  mouseDown(e: MouseEventEx, sender: any) {}

  mouseMove(e: MouseEventEx, sender: any) {
    if (this.isEnabled()) {
      this.process(e)
    }
  }

  mouseUp(e: MouseEventEx, sender: any) {}

  @CellMarker.dispose()
  dispose() {
    this.graph.removeHandler(this)
  }
}
