import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class ChildChange implements IChange {
  public readonly model: Model
  public parent: Cell | null
  public child: Cell
  public previous: Cell | null
  public index?: number
  public previousIndex?: number

  constructor(model: Model, parent: Cell | null, child: Cell, index?: number) {
    this.model = model
    this.parent = parent
    this.previous = parent
    this.child = child
    this.index = index
    this.previousIndex = index
  }

  execute() {
    if (this.child != null) {
      let tmp = this.model.getParent(this.child)
      const tmp2 = tmp != null ? tmp.getChildIndex(this.child) : 0

      if (this.previous == null) {
        this.connect(this.child, false)
      }

      tmp = this.model.doChildChange(
        this.child,
        this.previous,
        this.previousIndex,
      )

      if (this.previous != null) {
        this.connect(this.child, true)
      }

      this.parent = this.previous
      this.previous = tmp
      this.index = this.previousIndex
      this.previousIndex = tmp2
    }
  }

  private connect(edge: Cell, isConnect: boolean = true) {
    if (edge.isEdge()) {
      const sourceNode = edge.getTerminal(true)
      const targetNode = edge.getTerminal(false)
      if (sourceNode != null) {
        if (isConnect) {
          this.model.doTerminalChange(edge, sourceNode, true)
        } else {
          this.model.doTerminalChange(edge, null, true)
        }
      }

      if (targetNode != null) {
        if (isConnect) {
          this.model.doTerminalChange(edge, targetNode, false)
        } else {
          this.model.doTerminalChange(edge, null, false)
        }
      }

      edge.setTerminal(sourceNode, true)
      edge.setTerminal(targetNode, false)
    }

    edge.eachChild((child) => this.connect(child, isConnect))
  }
}
