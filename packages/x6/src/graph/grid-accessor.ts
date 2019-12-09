import { BaseGraph } from './base-graph'

export class GridAccessor extends BaseGraph {
  isGridEnabled() {
    return this.options.grid.enabled
  }

  setGridEnabled(enabled: boolean, refresh: boolean = true) {
    if (this.isGridEnabled() !== enabled) {
      this.options.grid.enabled = enabled
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  toggleGrid(refresh: boolean = true) {
    if (this.isGridEnabled()) {
      this.disableGrid(refresh)
    } else {
      this.enableGrid(refresh)
    }
    return this
  }

  enableGrid(refresh: boolean = true) {
    return this.setGridEnabled(true, refresh)
  }

  disableGrid(refresh: boolean = true) {
    return this.setGridEnabled(true, false)
  }

  get gridEnabled() {
    return this.isGridEnabled()
  }

  set gridEnabled(enabled: boolean) {
    this.setGridEnabled(enabled)
  }

  isGridVisible() {
    return this.options.grid.visible
  }

  setGridVisible(visible: boolean, refresh: boolean = true) {
    if (this.isGridVisible() !== visible) {
      this.options.grid.visible = visible
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
    return this
  }

  toggleGridVisible(refresh: boolean = true) {
    if (this.isGridVisible()) {
      this.hideGrid(refresh)
    } else {
      this.showGrid(refresh)
    }
    return this
  }

  showGrid(refresh: boolean = true) {
    return this.setGridVisible(true, refresh)
  }

  hideGrid(refresh: boolean = true) {
    return this.setGridVisible(false, refresh)
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

  setGridSize(size: number, refresh: boolean = true) {
    if (size !== this.getGridSize()) {
      this.options.grid.size = size
      if (refresh) {
        this.view.validate()
      }
    }
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

  setGridMinSize(size: number, refresh: boolean = true) {
    if (size !== this.getGridMinSize()) {
      this.options.grid.minSize = size
      if (refresh) {
        this.view.validate()
      }
    }
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

  setGridStep(step: number, refresh: boolean = true) {
    if (this.getGridStep() !== step) {
      this.options.grid.step = step
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
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

  setGridType(type: GridType, refresh: boolean = true) {
    if (type !== this.getGridType()) {
      this.options.grid.type = type
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
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

  setGridColor(color: string, refresh: boolean = true) {
    if (this.getGridColor() !== color) {
      this.options.grid.color = color
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
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

  setBackgroundColor(color: string | null, refresh: boolean = true) {
    if (this.getBackgroundColor() !== color) {
      this.options.backgroundColor = color
      if (refresh) {
        this.view.validateBackgroundStyle()
      }
    }
    return this
  }

  get backgroundColor() {
    return this.getBackgroundColor()
  }

  set backgroundColor(color: string | null) {
    this.setBackgroundColor(color)
  }

  /**
   * Snaps the given numeric value to the grid.
   */
  snap(value: number) {
    if (this.isGridEnabled()) {
      const gridSize = this.getGridSize()
      return Math.round(value / gridSize) * gridSize
    }
    return value
  }
}

export type GridType = 'line' | 'dot'

export interface GridOptions {
  /**
   * Specifies if the grid is enabled.
   *
   * Default is `true`.
   */
  enabled: boolean

  /**
   * Specifies if the grid is visible.
   *
   * Default is `true`.
   */
  visible: boolean

  /**
   * Specifies the grid size.
   *
   * Default is `10`.
   */
  size: number

  /**
   * Specifies the grid min-size.
   *
   * Default is `4`.
   */
  minSize: number

  /**
   * Specifies if the grid should be scaled.
   */
  scaled: boolean

  /**
   * Specifies the shade of grey. Only work with `line` grid.
   *
   * Default is `4`.
   */
  step: number

  /**
   * Specifies the grid type.
   *
   * Default is `line`.
   */
  type: GridType

  /**
   * Specifies the grid color.
   *
   * Default is `#e0e0e0`.
   */
  color: string
}
