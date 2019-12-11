import { hook } from './decorator'
import { BaseGraph } from './base-graph'
import { DataChange } from '../change'

export class ChangeAccessor extends BaseGraph {
  @hook()
  shouldRedrawOnDataChange(change: DataChange) {
    return false
  }
}
