import { isHTMLNode } from '../util'
import { Graph, Cell } from '../core'
import { BaseManager } from './manager-base'

export class ValidationManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
  }

  validateGraph(
    cell: Cell = this.model.getRoot(),
    context: any = {},
  ): string | null {

    let isValid = true
    const childCount = this.model.getChildCount(cell)

    for (let i = 0; i < childCount; i += 1) {
      const tmp = this.model.getChildAt(cell, i)!
      let ctx = context

      if (this.graph.isValidRoot(tmp)) {
        ctx = new Object()
      }

      const warn: string | null = this.validateGraph(tmp, ctx)
      if (warn != null) {
        this.graph.addWarningOverlay(tmp, warn.replace(/\n/g, '<br>'))
      } else {
        this.graph.addWarningOverlay(tmp, null)
      }

      isValid = isValid && warn == null
    }

    let warning = ''

    // Adds error for invalid children if collapsed (children invisible)
    if (this.graph.isCellCollapsed(cell) && !isValid) {
      warning += 'ValidationErrors'
    }

    // Checks edges and cells using the defined multiplicities
    if (this.model.isEdge(cell)) {
      warning += this.getEdgeValidationError(
        cell,
        this.model.getTerminal(cell, true),
        this.model.getTerminal(cell, false),
      ) || ''
    } else {
      warning += this.getCellValidationError(cell) || ''
    }

    // Checks custom validation rules
    const err = this.graph.validateCell(cell, context)

    if (err != null) {
      warning += err
    }

    // Updates the display with the warning icons
    // before any potential alerts are displayed.
    // LATER: Move this into addCellOverlay. Redraw
    // should check if overlay was added or removed.
    if (this.model.getParent(cell) == null) {
      this.view.validate()
    }

    return (warning.length > 0 || !isValid) ? warning as string : null
  }

  /**
   * Returns the validation error message to be displayed when inserting or
   * changing an edges' connectivity. A return value of null means the edge
   * is valid, a return value of '' means it's not valid, but do not display
   * an error message. Any other (non-empty) string returned from this method
   * is displayed as an error message when trying to connect an edge to a
   * source and target.
   */
  getEdgeValidationError(
    edge: Cell | null,
    source: Cell | null,
    target: Cell | null,
  ) {
    if (
      edge != null &&
      !this.graph.allowDanglingEdges &&
      (source == null || target == null)
    ) {
      return ''
    }

    if (
      edge != null &&
      this.model.getTerminal(edge, true) == null &&
      this.model.getTerminal(edge, false) == null
    ) {
      return null
    }

    // Checks if we're dealing with a loop
    if (!this.graph.allowLoops && source === target && source != null) {
      return ''
    }

    // Checks if the connection is generally allowed
    if (!this.graph.isValidConnection(source, target)) {
      return ''
    }

    if (source != null && target != null) {
      let error = ''

      // Checks if the cells are already connected
      // and adds an error message if required
      if (!this.graph.multigraph) {
        const tmp = this.model.getEdgesBetween(source, target, true)

        // Checks if the source and target are not connected by another edge
        if (tmp.length > 1 || (tmp.length === 1 && tmp[0] !== edge)) {
          error += 'Nodes are already connected.'
        }
      }

      // Gets the number of outgoing edges from the source
      // and the number of incoming edges from the target
      // without counting the edge being currently changed.
      const sourceOut = this.model.getDirectedEdgeCount(source, true, edge)
      const targetIn = this.model.getDirectedEdgeCount(target, false, edge)

      // Checks the change against each multiplicity rule
      if (this.graph.multiplicities != null) {
        for (let i = 0, ii = this.graph.multiplicities.length; i < ii; i += 1) {
          const err = this.graph.multiplicities[i].check(
            this.graph, edge, source, target, sourceOut, targetIn,
          )

          if (err != null) {
            error += err
          }
        }
      }

      // Validates the source and target terminals independently
      const err = this.graph.validateEdge(edge, source, target)

      if (err != null) {
        error += err
      }

      return (error.length > 0) ? error : null
    }

    return this.graph.allowDanglingEdges ? null : ''
  }

  getCellValidationError(cell: Cell) {
    const outCount = this.model.getDirectedEdgeCount(cell, true)
    const inCount = this.model.getDirectedEdgeCount(cell, false)
    const value = this.model.getData(cell)
    let error = ''

    if (this.graph.multiplicities != null) {
      for (let i = 0; i < this.graph.multiplicities.length; i += 1) {
        const rule = this.graph.multiplicities[i]

        if (
          rule.isSource &&
          isHTMLNode(value, rule.nodeName, rule.attrName, rule.attrValue) &&
          ((rule.max > 0 && outCount > rule.max) || outCount < rule.min)
        ) {
          error += `${rule.countError}\n`
        } else if (
          !rule.isSource &&
          isHTMLNode(value, rule.nodeName, rule.attrName, rule.attrValue) &&
          ((rule.max > 0 && inCount > rule.max) || inCount < rule.min)
        ) {
          error += `${rule.countError}\n`
        }
      }
    }

    return (error.length > 0) ? error : null
  }
}
