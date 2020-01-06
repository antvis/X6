import { DomUtil } from '../dom'
import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'

export class ValidationManager extends BaseManager {
  validateGraph(cell: Cell, context: any): string | null {
    let isValid = true

    this.model.eachChild(cell, child => {
      let ctx = context
      if (this.graph.isValidRoot(child)) {
        ctx = new Object()
      }

      const warn: string | null = this.validateGraph(child, ctx)
      if (warn != null) {
        this.graph.addWarningOverlay(child, warn.replace(/\n/g, '<br>'))
      } else {
        this.graph.addWarningOverlay(child, null)
      }

      isValid = isValid && warn == null
    })

    let warning = ''

    // Adds error for invalid children if collapsed (children invisible)
    if (this.graph.isCellCollapsed(cell) && !isValid) {
      warning += 'Validation Errors. '
    }

    // Checks edges and cells using the defined multiplicities
    if (this.model.isEdge(cell)) {
      warning +=
        this.getEdgeValidationError(
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

    return warning.length > 0 || !isValid ? (warning as string) : null
  }

  isEdgeValid(edge: Cell | null, source: Cell | null, target: Cell | null) {
    return this.getEdgeValidationError(edge, source, target) == null
  }

  /**
   * Returns the validation error message to be displayed when inserting or
   * changing an edges' connectivity.
   *
   * A return value of null means the edge is valid.
   * A return value of '' means it's invalid, but do not have an error message.
   * Any other (non-empty) string returned from this method is displayed as
   * an error message.
   */
  getEdgeValidationError(
    edge: Cell | null,
    source: Cell | null,
    target: Cell | null,
  ) {
    // dangling edge
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
      if (!this.graph.multigraphSupported) {
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
        this.graph.multiplicities.forEach(m => {
          const err = m.check(
            this.graph,
            edge,
            source,
            target,
            sourceOut,
            targetIn,
          )
          if (err != null) {
            error += err
          }
        })
      }

      // Validates the source and target terminals independently
      const err = this.graph.validateEdge(edge, source, target)

      if (err != null) {
        error += err
      }

      return error.length > 0 ? error : null
    }

    return this.graph.allowDanglingEdges ? null : ''
  }

  getCellValidationError(cell: Cell) {
    const data = this.model.getData(cell)
    const outCount = this.model.getDirectedEdgeCount(cell, true)
    const inCount = this.model.getDirectedEdgeCount(cell, false)

    let error = ''

    if (this.graph.multiplicities != null) {
      this.graph.multiplicities.forEach(rule => {
        if (
          rule.isSource &&
          DomUtil.isHtmlElement(
            data,
            rule.nodeName,
            rule.attrName,
            rule.attrValue,
          ) &&
          ((rule.max > 0 && outCount > rule.max) || outCount < rule.min)
        ) {
          error += `${rule.countError}\n`
        } else if (
          !rule.isSource &&
          DomUtil.isHtmlElement(
            data,
            rule.nodeName,
            rule.attrName,
            rule.attrValue,
          ) &&
          ((rule.max > 0 && inCount > rule.max) || inCount < rule.min)
        ) {
          error += `${rule.countError}\n`
        }
      })
    }

    return error.length > 0 ? error : null
  }

  warning(message: string) {
    console.warn(message)
  }
}
