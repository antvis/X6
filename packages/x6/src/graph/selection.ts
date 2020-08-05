import { ModifierKey } from '../types'
import { Selection } from '../addon/selection'
import { Collection } from '../model/collection'
import { Cell } from '../model/cell'
import { Base } from './base'
import { Dictionary } from '../common'

export class SelectionManager extends Base {
  public widget: Selection

  protected get widgetOptions() {
    return this.options.selecting
  }

  get rubberbandDisabled() {
    return (
      this.widgetOptions.enabled !== true ||
      this.widgetOptions.rubberband !== true
    )
  }

  public get disabled() {
    return this.widgetOptions.enabled !== true
  }

  public get length() {
    return this.widget.length
  }

  public get cells() {
    return this.widget.cells
  }

  protected init() {
    this.widget = this.graph.hook.createSelection()

    this.graph.on('blank:mousedown', ({ e }) => {
      if (
        !this.rubberbandDisabled &&
        ModifierKey.test(e, this.widgetOptions.modifiers) &&
        this.graph.hook.allowRubberband(e)
      ) {
        this.startRubberband(e)
      } else {
        this.clean()
      }
    })

    const movedDic = new Dictionary<Cell, boolean>()

    this.graph.on('cell:mousemove', ({ cell }) => {
      movedDic.set(cell, true)
    })

    this.graph.on('cell:mouseup', ({ e, cell }) => {
      const options = this.widgetOptions
      let disabled = this.disabled
      if (!disabled && movedDic.has(cell)) {
        disabled = options.selectOnCellMoved === false

        if (!disabled) {
          disabled = options.selectOnNodeMoved === false && cell.isNode()
        }

        if (!disabled) {
          disabled = options.selectOnEdgeMoved === false && cell.isEdge()
        }
      }

      if (!disabled) {
        if (options.multiple === false || (!e.ctrlKey && !e.metaKey)) {
          this.clean()
        }
        this.select(cell)
      }

      movedDic.delete(cell)
    })

    this.widget.on('box:mousedown', ({ cell, e }) => {
      if (!this.disabled) {
        if (this.widgetOptions.multiple !== false && (e.ctrlKey || e.metaKey)) {
          this.unselect(cell)
        }
      }
    })
  }

  isEmpty() {
    return this.length <= 0
  }

  isSelected(cell: Cell | string) {
    return this.widget.isSelected(cell)
  }

  protected getCells(cells: Cell | string | (Cell | string)[]) {
    return (Array.isArray(cells) ? cells : [cells])
      .map((cell) =>
        typeof cell === 'string' ? this.graph.getCellById(cell) : cell,
      )
      .filter((cell) => cell != null)
  }

  select(
    cells: Cell | string | (Cell | string)[],
    options: Collection.AddOptions = {},
  ) {
    this.widget.select(this.getCells(cells), options)
    return this
  }

  unselect(
    cells: Cell | string | (Cell | string)[],
    options: Collection.RemoveOptions = {},
  ) {
    this.widget.unselect(this.getCells(cells), options)
    return this
  }

  clean() {
    this.widget.clean()
    return this
  }

  enable() {
    if (this.disabled) {
      this.widgetOptions.enabled = true
    }
    return this
  }

  disable() {
    if (!this.disabled) {
      this.widgetOptions.enabled = false
    }
    return this
  }

  startRubberband(e: JQuery.MouseDownEvent) {
    if (!this.rubberbandDisabled) {
      this.widget.startSelecting(e)
    }
    return this
  }

  enableRubberband() {
    if (this.rubberbandDisabled) {
      this.widgetOptions.rubberband = true
      if (
        ModifierKey.equals(
          this.graph.options.scroller.modifiers,
          this.graph.options.selecting.modifiers,
        )
      ) {
        this.graph.scroller.disablePanning()
      }
    }
    return this
  }

  disableRubberband() {
    if (!this.rubberbandDisabled) {
      this.widgetOptions.rubberband = false
    }
    return this
  }

  isMultiple() {
    return this.widgetOptions.multiple !== false
  }

  enableMultiple() {
    this.widgetOptions.multiple = true
    return this
  }

  disableMultiple() {
    this.widgetOptions.multiple = false
    return this
  }

  setModifiers(modifiers?: string | ModifierKey[] | null) {
    this.widgetOptions.modifiers = modifiers
    return this
  }

  setContent(content?: Selection.Content) {
    this.widget.setContent(content)
    return this
  }

  setFilter(filter?: Selection.Filter) {
    this.widget.setFilter(filter)
    return this
  }
}

export namespace SelectionManager {
  export interface Options extends Selection.CommonOptions {
    enabled?: boolean
    rubberband?: boolean
    modifiers?: string | ModifierKey[] | null
    multiple?: boolean
    selectOnCellMoved?: boolean
    selectOnNodeMoved?: boolean
    selectOnEdgeMoved?: boolean
  }

  export type Filter = Selection.Filter
  export type Content = Selection.Content
}
