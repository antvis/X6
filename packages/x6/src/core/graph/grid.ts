import { GraphBase } from './base'

export type GridType = 'line' | 'dot'

export interface GridOptions {
  /**
   * If the grid is enabled.
   *
   * Default is `true`.
   */
  enabled: boolean

  /**
   * If the grid is visible.
   *
   * Default is `true`.
   */
  visible: boolean

  /**
   * The grid size.
   *
   * Default is `10`.
   */
  size: number

  /**
   * The grid min-size.
   *
   * Default is `4`.
   */
  minSize: number

  /**
   * If the grid should be scaled.
   */
  scaled: boolean

  /**
   * The shade of grey. Only work with `line` grid.
   *
   * Default is `4`.
   */
  step: number

  /**
   * The grid type.
   *
   * Default is `line`.
   */
  type: GridType

  /**
   * The grid color.
   *
   * Default is `#e0e0e0`.
   */
  color: string
}

export class GraphGrid extends GraphBase {
  enableGrid() {
    this.options.grid.enabled = true
    this.view.validate()
    return this
  }

  disableGrid() {
    this.options.grid.enabled = false
    this.view.validate()
    return this
  }

  toggleGrid() {
    if (this.isGridEnabled()) {
      this.disableGrid()
    } else {
      this.enableGrid()
    }
    return this
  }

  setGridEnabled(enabled: boolean) {
    if (enabled) {
      this.enableGrid()
    } else {
      this.disableGrid()
    }
  }

  isGridEnabled() {
    return this.options.grid.enabled
  }

  get gridEnabled() {
    return this.isGridEnabled()
  }

  set gridEnabled(enabled: boolean) {
    this.setGridEnabled(enabled)
  }

  showGrid() {
    this.options.grid.visible = true
    this.view.validateBackgroundStyle()
    return this
  }

  hideGrid() {
    this.options.grid.visible = false
    this.view.validateBackgroundStyle()
    return this
  }

  toggleGridVisible() {
    if (this.isGridVisible()) {
      this.hideGrid()
    } else {
      this.showGrid()
    }
    return this
  }

  isGridVisible() {
    return this.options.grid.visible
  }

  setGridVisible(visible: boolean) {
    if (visible) {
      this.showGrid()
    } else {
      this.hideGrid()
    }
  }

  get gridVisible() {
    return this.isGridVisible()
  }

  set gridVisible(visible: boolean) {
    this.setGridVisible(visible)
  }

  getGridSize() {
    return this.options.grid.size
  }

  setGridSize(size: number) {
    this.options.grid.size = size
    this.view.validate()
    return this
  }

  get gridSize() {
    return this.getGridSize()
  }

  set gridSize(size: number) {
    this.setGridSize(size)
  }

  getGridMinSize() {
    return this.options.grid.minSize
  }

  setGridMinSize(size: number) {
    this.options.grid.minSize = size
    this.view.validate()
    return this
  }

  get gridMinSize() {
    return this.getGridMinSize()
  }

  set gridMinSize(size: number) {
    this.setGridMinSize(size)
  }

  getGridStep() {
    return this.options.grid.step
  }

  setGridStep(step: number) {
    this.options.grid.step = step
    this.view.validateBackgroundStyle()
    return this
  }

  get gridStep() {
    return this.getGridStep()
  }

  set gridStep(step: number) {
    this.setGridStep(step)
  }

  getGridType() {
    return this.options.grid.type
  }

  setGridType(type: GridType) {
    this.options.grid.type = type
    this.view.validateBackgroundStyle()
    return this
  }

  get gridType() {
    return this.getGridType()
  }

  set gridType(type: GridType) {
    this.setGridType(type)
  }

  getGridColor() {
    return this.options.grid.color
  }

  setGridColor(color: string) {
    this.options.grid.color = color
    this.view.validateBackgroundStyle()
    return this
  }

  get gridColor() {
    return this.getGridColor()
  }

  set gridColor(color: string) {
    this.setGridColor(color)
  }

  getBackgroundColor() {
    return this.options.backgroundColor
  }

  setBackgroundColor(color: string | null) {
    this.options.backgroundColor = color
    this.view.validateBackgroundStyle()
    return this
  }

  get backgroundColor() {
    return this.getBackgroundColor()
  }

  set backgroundColor(color: string | null) {
    this.setBackgroundColor(color)
  }
}
