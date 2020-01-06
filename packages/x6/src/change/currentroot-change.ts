import { Point } from '../geometry'
import { IChange } from './change'
import { Cell } from '../core/cell'
import { View } from '../core/view'

export class CurrentRootChange implements IChange {
  public view: View
  public root: Cell | null
  public previous: Cell | null
  private isUp: boolean

  constructor(view: View, root: Cell | null) {
    this.view = view
    this.root = root
    this.previous = root
    this.isUp = root == null

    if (!this.isUp) {
      const model = view.graph.getModel()

      let tmp = view.currentRoot
      while (tmp != null) {
        if (tmp === root) {
          this.isUp = true
          break
        }
        tmp = model.getParent(tmp)!
      }
    }
  }

  execute() {
    const tmp = this.view.currentRoot
    this.view.currentRoot = this.previous
    this.previous = tmp

    const t = this.view.graph.getTranslateForCurrentRoot(this.view.currentRoot)
    if (t != null) {
      this.view.translate = new Point(-t.x, -t.y)
    }

    if (this.isUp) {
      this.view.clear(this.view.currentRoot, true)
      this.view.validate()
    } else {
      this.view.refresh()
    }

    this.view.trigger(this.isUp ? 'up' : 'down', {
      previous: this.previous,
      currentRoot: this.view.currentRoot,
    })

    this.isUp = !this.isUp
  }
}
