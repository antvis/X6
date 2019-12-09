import { Cell } from '../core/cell'
import { Image } from '../struct'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class CollapseAccessor extends BaseGraph {
  isCellsCollapsable() {
    return this.options.folding.enabled
  }

  enableCellsCollapse(refresh: boolean = true) {
    if (!this.isCellsCollapsable()) {
      this.options.folding.enabled = true
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  disableCellsCollapse(refresh: boolean = true) {
    if (this.isCellsCollapsable()) {
      this.options.folding.enabled = false
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  setCellsCollapsable(foldable: boolean, refresh: boolean = true) {
    if (foldable) {
      this.enableCellsCollapse(refresh)
    } else {
      this.disableCellsCollapse(refresh)
    }
  }

  toggleCellsCollapsable(refresh: boolean = true) {
    if (this.isCellsCollapsable()) {
      this.disableCellsCollapse(refresh)
    } else {
      this.enableCellsCollapse(refresh)
    }
    return this
  }

  get cellsCollapsable() {
    return this.isCellsCollapsable()
  }

  set cellsCollapsable(foldable: boolean) {
    this.setCellsCollapsable(foldable)
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
  isCellCollapsable(cell: Cell, nextCollapseState: boolean) {
    const style = this.getStyle(cell)
    return this.model.getChildCount(cell) > 0 && style.foldable !== false
  }

  /**
   * Returns the cells which are movable in the given array of cells.
   */
  getCollapsableCells(cells: Cell[], collapse: boolean) {
    return this.model.filterCells(cells, cell =>
      this.isCellCollapsable(cell, collapse),
    )
  }

  toggleCollapse(
    collapsed: boolean,
    recurse: boolean = false,
    cells: Cell[] = this.getCollapsableCells(
      this.getSelectedCells(),
      collapsed,
    ),
    checkCollapsable: boolean = false,
  ) {
    return this.collapseManager.toggleCollapse(
      collapsed,
      recurse,
      cells,
      checkCollapsable,
    )
  }
}

export interface CollapseOptions {
  /**
   * Specifies if folding (collapse and expand) via an image icon
   * in the graph should be enabled.
   *
   * Default is `true`.
   */
  enabled: boolean
  expandedImage: Image
  collapsedImage: Image
}
