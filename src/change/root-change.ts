import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class RootChange implements IChange {
  public readonly model: Model
  public root: Cell | null
  public previous: Cell | null

  constructor(model: Model, root: Cell | null) {
    this.model = model
    this.root = root
    this.previous = root
  }

  execute() {
    this.root = this.previous
    this.previous = this.model.doRootChange(this.previous!)
  }
}
