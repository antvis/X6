import { Cell } from '../core/cell'
import { State } from '../core/state'
import { Image } from '../struct'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class CollapseAccessor extends BaseGraph {
  isCellsFoldable() {
    return this.options.folding.enabled
  }

  enableCellsFolding(refresh: boolean = true) {
    if (!this.isCellsFoldable()) {
      this.options.folding.enabled = true
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  disableCellsFolding(refresh: boolean = true) {
    if (this.isCellsFoldable()) {
      this.options.folding.enabled = false
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  setCellsFoldable(foldable: boolean, refresh: boolean = true) {
    if (foldable) {
      this.enableCellsFolding(refresh)
    } else {
      this.disableCellsFolding(refresh)
    }
  }

  toggleFolding(refresh: boolean = true) {
    if (this.isCellsFoldable()) {
      this.disableCellsFolding(refresh)
    } else {
      this.enableCellsFolding(refresh)
    }
    return this
  }

  get cellsFoldable() {
    return this.isCellsFoldable()
  }

  set cellsFoldable(foldable: boolean) {
    this.setCellsFoldable(foldable)
  }

  getExpandedImage() {
    return this.options.folding.expandedImage
  }

  setExpandedImage(image: Image, refresh: boolean = true) {
    if (this.getExpandedImage() !== image) {
      this.options.folding.expandedImage = image
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get expandedImage() {
    return this.getExpandedImage()
  }

  set expandedImage(image: Image) {
    this.setExpandedImage(image)
  }

  getCollapsedImage() {
    return this.options.folding.collapsedImage
  }

  setCollapsedImage(image: Image, refresh: boolean = true) {
    if (this.getCollapsedImage() !== image) {
      this.options.folding.collapsedImage = image
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get collapsedImage() {
    return this.getCollapsedImage()
  }

  set collapsedImage(image: Image) {
    this.setCollapsedImage(image)
  }

  @hook()
  isCellCollapsed(cell: Cell) {
    return this.model.isCollapsed(cell)
  }

  @hook()
  isCellFoldable(cell: Cell, nextCollapseState: boolean) {
    const style = this.getStyle(cell)
    return this.model.getChildCount(cell) > 0 && style.foldable !== false
  }

  /**
   * Returns the cells which are movable in the given array of cells.
   */
  getFoldableCells(cells: Cell[], collapse: boolean) {
    return this.model.filterCells(cells, cell =>
      this.isCellFoldable(cell, collapse),
    )
  }

  getFoldingImage(state: State) {
    if (
      state != null &&
      this.cellsFoldable &&
      !this.getModel().isEdge(state.cell)
    ) {
      const collapsed = this.isCellCollapsed(state.cell)
      if (this.isCellFoldable(state.cell, !collapsed)) {
        return collapsed ? this.collapsedImage : this.expandedImage
      }
    }

    return null
  }

  foldCells(
    collapse: boolean,
    recurse: boolean = false,
    cells: Cell[] = this.getFoldableCells(this.getSelectedCells(), collapse),
    checkFoldable: boolean = false,
  ) {
    return this.collapseManager.foldCells(
      collapse,
      recurse,
      cells,
      checkFoldable,
    )
  }
}

export interface FoldingOptions {
  /**
   * Specifies if folding (collapse and expand) via an image icon
   * in the graph should be enabled.
   *
   * Default is `true`.
   */
  enabled: boolean
  collapsedImage: Image
  expandedImage: Image
}
