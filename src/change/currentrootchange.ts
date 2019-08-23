import { IChange } from './change'
import { Cell } from '../core/cell'
import { Point } from '../struct'
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
      let tmp = view.currentRoot
      const model = view.graph.getModel()

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

    const translate = this.view.graph.getTranslateForRoot(this.view.currentRoot)
    if (translate != null) {
      this.view.translate = new Point(-translate.x, -translate.y)
    }

    if (this.isUp) {
      this.view.clear(this.view.currentRoot, true)
      this.view.validate()
    } else {
      this.view.refresh()
    }

    const name = this.isUp ? 'up' : 'down'
    this.view.trigger(name, {
      root: this.view.currentRoot,
      previous: this.previous,
    })
    this.isUp = !this.isUp
  }
}
