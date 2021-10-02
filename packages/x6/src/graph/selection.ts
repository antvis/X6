import { ModifierKey } from '../types'
import { Selection } from '../addon/selection'
import { Cell } from '../model/cell'
import { EventArgs } from './events'
import { Base } from './base'

export class SelectionManager extends Base {
  public widget: Selection
  private movedMap = new WeakMap<Cell, boolean>()
  private unselectMap = new WeakMap<Cell, boolean>()

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
    this.startListening()
  }

  protected startListening() {
    this.graph.on('blank:mousedown', this.onBlankMouseDown, this)
    this.graph.on('blank:click', this.onBlankClick, this)
    this.graph.on('cell:mousemove', this.onCellMouseMove, this)
    this.graph.on('cell:mouseup', this.onCellMouseUp, this)
    this.widget.on('box:mousedown', this.onBoxMouseDown, this)
  }

  protected stopListening() {
    this.graph.off('blank:mousedown', this.onBlankMouseDown, this)
    this.graph.off('blank:click', this.onBlankClick, this)
    this.graph.off('cell:mousemove', this.onCellMouseMove, this)
    this.graph.off('cell:mouseup', this.onCellMouseUp, this)
    this.widget.off('box:mousedown', this.onBoxMouseDown, this)
  }

  protected onBlankMouseDown({ e }: EventArgs['blank:mousedown']) {
    if (
      this.allowRubberband(e, true) ||
      (this.allowRubberband(e) &&
        !this.graph.scroller.allowPanning(e, true) &&
        !this.graph.panning.allowPanning(e, true))
    ) {
      this.startRubberband(e)
    }
  }

  protected onBlankClick() {
    this.clean()
  }

  allowRubberband(e: JQuery.MouseDownEvent, strict?: boolean) {
    return (
      !this.rubberbandDisabled &&
      ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict) &&
      this.graph.hook.allowRubberband(e)
    )
  }

  protected onCellMouseMove({ cell }: EventArgs['cell:mousemove']) {
    this.movedMap.set(cell, true)
  }

  protected onCellMouseUp({ e, cell }: EventArgs['cell:mouseup']) {
    const options = this.widgetOptions
    let disabled = this.disabled
    if (!disabled && this.movedMap.has(cell)) {
      disabled = options.selectCellOnMoved === false

      if (!disabled) {
        disabled = options.selectNodeOnMoved === false && cell.isNode()
      }

      if (!disabled) {
        disabled = options.selectEdgeOnMoved === false && cell.isEdge()
      }
    }

    if (!disabled) {
      if (options.multiple === false || (!e.ctrlKey && !e.metaKey)) {
        this.reset(cell)
      } else if (this.unselectMap.has(cell)) {
        this.unselectMap.delete(cell)
      } else if (this.isSelected(cell)) {
        this.unselect(cell)
      } else {
        this.select(cell)
      }
    }

    this.movedMap.delete(cell)
  }

  protected onBoxMouseDown({ e, cell }: Selection.EventArgs['box:mousedown']) {
    if (!this.disabled) {
      if (this.widgetOptions.multiple !== false && (e.ctrlKey || e.metaKey)) {
        this.unselect(cell)
        this.unselectMap.set(cell, true)
      }
    }
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
    options: Selection.AddOptions = {},
  ) {
    const selected = this.getCells(cells)
    if (selected.length) {
      if (this.isMultiple()) {
        this.widget.select(selected, options)
      } else {
        this.reset(selected.slice(0, 1), options)
      }
    }
    return this
  }

  unselect(
    cells: Cell | string | (Cell | string)[],
    options: Selection.RemoveOptions = {},
  ) {
    this.widget.unselect(this.getCells(cells), options)
    return this
  }

  reset(
    cells?: Cell | string | (Cell | string)[],
    options: Selection.SetOptions = {},
  ) {
    this.widget.reset(cells ? this.getCells(cells) : [], options)
    return this
  }

  clean(options: Selection.SetOptions = {}) {
    this.widget.clean(options)
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
      // if (
      //   ModifierKey.equals(
      //     this.graph.options.scroller.modifiers,
      //     this.graph.options.selecting.modifiers,
      //   )
      // ) {
      //   this.graph.scroller.disablePanning()
      // }
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

  @Base.dispose()
  dispose() {
    this.stopListening()
    this.widget.dispose()
  }
}

export namespace SelectionManager {
  export interface Options extends Selection.CommonOptions {
    enabled?: boolean
    rubberband?: boolean
    modifiers?: string | ModifierKey[] | null
    multiple?: boolean
    selectCellOnMoved?: boolean
    selectNodeOnMoved?: boolean
    selectEdgeOnMoved?: boolean
  }

  export type Filter = Selection.Filter
  export type Content = Selection.Content

  export type SetOptions = Selection.SetOptions
  export type AddOptions = Selection.AddOptions
  export type RemoveOptions = Selection.RemoveOptions
}
