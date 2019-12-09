import { hook } from './decorator'
import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class ValidationAccessor extends BaseGraph {
  @hook()
  isValidSource(cell: Cell | null) {
    return (
      (cell == null && this.allowDanglingEdges) ||
      (cell != null &&
        (!this.model.isEdge(cell) || this.edgesConnectable) &&
        this.isCellConnectable(cell))
    )
  }

  @hook()
  isValidTarget(cell: Cell | null) {
    return this.isValidSource(cell)
  }

  @hook()
  isValidConnection(source: Cell | null, target: Cell | null) {
    return this.isValidSource(source) && this.isValidTarget(target)
  }

  @hook()
  validateEdge(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return null
  }

  @hook()
  validateCell(cell: Cell, context: any) {
    return null
  }

  isEdgeValid(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return this.validationManager.isEdgeValid(edge, source, target)
  }

  /**
   * Validates the graph by validating each descendant of the given cell or
   * the root of the model.
   */
  validateGraph(
    cell: Cell = this.model.getRoot(),
    context: any = {},
  ): string | null {
    return this.validationManager.validateGraph(cell, context)
  }
}
