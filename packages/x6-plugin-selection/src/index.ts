import {
  Disposable,
  ModifierKey,
  CssLoader,
  Dom,
  ObjectExt,
} from '@antv/x6-common'
import { Cell, EventArgs, Graph } from '@antv/x6'
import { SelectionImpl } from './selection'
import { content } from './style/raw'

export class Selection extends Disposable {
  public name = 'selection'
  private graph: Graph
  public selectionImpl: SelectionImpl
  public readonly options: Selection.Options
  private movedMap = new WeakMap<Cell, boolean>()
  private unselectMap = new WeakMap<Cell, boolean>()

  get rubberbandDisabled() {
    return this.options.enabled !== true || this.options.rubberband !== true
  }

  public get disabled() {
    return this.options.enabled !== true
  }

  public get length() {
    return this.selectionImpl.length
  }

  public get cells() {
    return this.selectionImpl.cells
  }

  constructor(options: Selection.Options) {
    super()
    this.options = ObjectExt.merge({}, Selection.defaultOptions, options)
  }

  public init(graph: Graph) {
    this.graph = graph
    CssLoader.ensure('scroller', content)
    this.selectionImpl = new SelectionImpl({
      ...this.options,
      graph,
    })
    this.startListening()
  }

  protected startListening() {
    this.graph.on('blank:mousedown', this.onBlankMouseDown, this)
    this.graph.on('blank:click', this.onBlankClick, this)
    this.graph.on('cell:mousemove', this.onCellMouseMove, this)
    this.graph.on('cell:mouseup', this.onCellMouseUp, this)
    this.selectionImpl.on('box:mousedown', this.onBoxMouseDown, this)
  }

  protected stopListening() {
    this.graph.off('blank:mousedown', this.onBlankMouseDown, this)
    this.graph.off('blank:click', this.onBlankClick, this)
    this.graph.off('cell:mousemove', this.onCellMouseMove, this)
    this.graph.off('cell:mouseup', this.onCellMouseUp, this)
    this.selectionImpl.off('box:mousedown', this.onBoxMouseDown, this)
  }

  protected onBlankMouseDown({ e }: EventArgs['blank:mousedown']) {
    const allowGraphPanning = this.graph.panning.allowPanning(e, true)
    const scroller = this.graph.getPlugin('scroller') as any
    const allowScrollerPanning = scroller && scroller.allowPanning(e, true)
    if (
      this.allowRubberband(e, true) ||
      (this.allowRubberband(e) && !allowScrollerPanning && !allowGraphPanning)
    ) {
      this.startRubberband(e)
    }
  }

  protected onBlankClick() {
    this.clean()
  }

  allowRubberband(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      !this.rubberbandDisabled &&
      ModifierKey.isMatch(e, this.options.modifiers, strict)
    )
  }

  allowMultipleSelection(e: Dom.MouseDownEvent | Dom.MouseUpEvent) {
    return (
      this.isMultiple() &&
      ModifierKey.isMatch(e, this.options.multipleSelectionModifiers)
    )
  }

  protected onCellMouseMove({ cell }: EventArgs['cell:mousemove']) {
    this.movedMap.set(cell, true)
  }

  protected onCellMouseUp({ e, cell }: EventArgs['cell:mouseup']) {
    const options = this.options
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
      if (!this.allowMultipleSelection(e)) {
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

  protected onBoxMouseDown({
    e,
    cell,
  }: SelectionImpl.EventArgs['box:mousedown']) {
    if (!this.disabled) {
      if (this.allowMultipleSelection(e)) {
        this.unselect(cell)
        this.unselectMap.set(cell, true)
      }
    }
  }

  isEmpty() {
    return this.length <= 0
  }

  isSelected(cell: Cell | string) {
    return this.selectionImpl.isSelected(cell)
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
        this.selectionImpl.select(selected, options)
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
    this.selectionImpl.unselect(this.getCells(cells), options)
    return this
  }

  reset(
    cells?: Cell | string | (Cell | string)[],
    options: Selection.SetOptions = {},
  ) {
    this.selectionImpl.reset(cells ? this.getCells(cells) : [], options)
    return this
  }

  clean(options: Selection.SetOptions = {}) {
    this.selectionImpl.clean(options)
    return this
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
    }
    return this
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
    return this
  }

  startRubberband(e: Dom.MouseDownEvent) {
    if (!this.rubberbandDisabled) {
      this.selectionImpl.startSelecting(e)
    }
    return this
  }

  enableRubberband() {
    if (this.rubberbandDisabled) {
      this.options.rubberband = true
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
      this.options.rubberband = false
    }
    return this
  }

  isMultiple() {
    return this.options.multiple !== false
  }

  enableMultiple() {
    this.options.multiple = true
    return this
  }

  disableMultiple() {
    this.options.multiple = false
    return this
  }

  setModifiers(modifiers?: string | ModifierKey[] | null) {
    this.options.modifiers = modifiers
    return this
  }

  setContent(content?: Selection.Content) {
    this.selectionImpl.setContent(content)
    return this
  }

  setFilter(filter?: Selection.Filter) {
    this.selectionImpl.setFilter(filter)
    return this
  }

  @Disposable.dispose()
  dispose() {
    this.stopListening()
    this.selectionImpl.dispose()
  }
}

export namespace Selection {
  export interface Options extends SelectionImpl.CommonOptions {
    enabled?: boolean
  }

  export type Filter = SelectionImpl.Filter
  export type Content = SelectionImpl.Content

  export type SetOptions = SelectionImpl.SetOptions
  export type AddOptions = SelectionImpl.AddOptions
  export type RemoveOptions = SelectionImpl.RemoveOptions

  export const defaultOptions: Partial<SelectionImpl.Options> = {
    rubberband: false,
    rubberNode: true,
    rubberEdge: false, // next version will set to true
    pointerEvents: 'auto',
    multiple: true,
    multipleSelectionModifiers: ['ctrl', 'meta'],
    movable: true,
    strict: false,
    useCellGeometry: false,
    selectCellOnMoved: false,
    selectNodeOnMoved: false,
    selectEdgeOnMoved: false,
    following: true,
    content: null,
  }
}
