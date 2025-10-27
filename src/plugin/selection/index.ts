import {
  Basecoat,
  CssLoader,
  type Dom,
  disposable,
  isModifierKeyMatch,
  type ModifierKey,
} from '../../common'
import type { EventArgs, Graph } from '../../graph'
import type { Cell } from '../../model'
import {
  SelectionImpl,
  type SelectionImplAddOptions,
  type SelectionImplCommonOptions,
  type SelectionImplContent,
  type SelectionImplEventArgs,
  type SelectionImplFilter,
  type SelectionImplOptions,
  type SelectionImplRemoveOptions,
  type SelectionImplSetOptions,
} from './selection'
import { content } from './style/raw'
import './api'

export interface SelectionOptions extends SelectionImplCommonOptions {
  enabled?: boolean
}

export type SelectionFilter = SelectionImplFilter
export type SelectionContent = SelectionImplContent

export type SelectionSetOptions = SelectionImplSetOptions
export type SelectionAddOptions = SelectionImplAddOptions
export type SelectionRemoveOptions = SelectionImplRemoveOptions

export const DefaultOptions: Partial<SelectionImplOptions> = {
  rubberband: false,
  rubberNode: true,
  rubberEdge: false, // next version will set to true
  pointerEvents: 'auto',
  multiple: true,
  multipleSelectionModifiers: ['ctrl', 'meta'],
  movable: true,
  strict: false,
  selectCellOnMoved: false,
  selectNodeOnMoved: false,
  selectEdgeOnMoved: false,
  following: true,
  content: null,
  eventTypes: ['leftMouseDown', 'mouseWheelDown'],
}
export class Selection
  extends Basecoat<SelectionImplEventArgs>
  implements Graph.Plugin
{
  public name = 'selection'

  private graph: Graph
  private selectionImpl: SelectionImpl
  private readonly options: SelectionOptions
  private movedMap = new WeakMap<Cell, boolean>()
  private unselectMap = new WeakMap<Cell, boolean>()

  get rubberbandDisabled() {
    return this.options.enabled !== true || this.options.rubberband !== true
  }

  get disabled() {
    return this.options.enabled !== true
  }

  get length() {
    return this.selectionImpl.length
  }

  get cells() {
    return this.selectionImpl.cells
  }

  constructor(options: SelectionOptions = {}) {
    super()
    this.options = {
      enabled: true,
      ...DefaultOptions,
      ...options,
    }

    CssLoader.ensure(this.name, content)
  }

  public init(graph: Graph) {
    this.graph = graph
    this.selectionImpl = new SelectionImpl({
      ...this.options,
      graph,
    })
    this.setup()
    this.startListening()
  }

  // #region api

  isEnabled() {
    return !this.disabled
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
  }

  toggleEnabled(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isEnabled()) {
        if (enabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    } else if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }

    return this
  }

  isMultipleSelection() {
    return this.isMultiple()
  }

  enableMultipleSelection() {
    this.enableMultiple()
    return this
  }

  disableMultipleSelection() {
    this.disableMultiple()
    return this
  }

  toggleMultipleSelection(multiple?: boolean) {
    if (multiple != null) {
      if (multiple !== this.isMultipleSelection()) {
        if (multiple) {
          this.enableMultipleSelection()
        } else {
          this.disableMultipleSelection()
        }
      }
    } else if (this.isMultipleSelection()) {
      this.disableMultipleSelection()
    } else {
      this.enableMultipleSelection()
    }

    return this
  }

  isSelectionMovable() {
    return this.options.movable !== false
  }

  enableSelectionMovable() {
    this.selectionImpl.options.movable = true
    return this
  }

  disableSelectionMovable() {
    this.selectionImpl.options.movable = false
    return this
  }

  toggleSelectionMovable(movable?: boolean) {
    if (movable != null) {
      if (movable !== this.isSelectionMovable()) {
        if (movable) {
          this.enableSelectionMovable()
        } else {
          this.disableSelectionMovable()
        }
      }
    } else if (this.isSelectionMovable()) {
      this.disableSelectionMovable()
    } else {
      this.enableSelectionMovable()
    }

    return this
  }

  isRubberbandEnabled() {
    return !this.rubberbandDisabled
  }

  enableRubberband() {
    if (this.rubberbandDisabled) {
      this.options.rubberband = true
    }
    return this
  }

  disableRubberband() {
    if (!this.rubberbandDisabled) {
      this.options.rubberband = false
    }
    return this
  }

  toggleRubberband(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isRubberbandEnabled()) {
        if (enabled) {
          this.enableRubberband()
        } else {
          this.disableRubberband()
        }
      }
    } else if (this.isRubberbandEnabled()) {
      this.disableRubberband()
    } else {
      this.enableRubberband()
    }

    return this
  }

  isStrictRubberband() {
    return this.selectionImpl.options.strict === true
  }

  enableStrictRubberband() {
    this.selectionImpl.options.strict = true
    return this
  }

  disableStrictRubberband() {
    this.selectionImpl.options.strict = false
    return this
  }

  toggleStrictRubberband(strict?: boolean) {
    if (strict != null) {
      if (strict !== this.isStrictRubberband()) {
        if (strict) {
          this.enableStrictRubberband()
        } else {
          this.disableStrictRubberband()
        }
      }
    } else if (this.isStrictRubberband()) {
      this.disableStrictRubberband()
    } else {
      this.enableStrictRubberband()
    }

    return this
  }

  setRubberbandModifiers(modifiers?: string | ModifierKey[] | null) {
    this.setModifiers(modifiers)
  }

  setSelectionFilter(filter?: SelectionFilter) {
    this.setFilter(filter)
    return this
  }

  setSelectionDisplayContent(content?: SelectionContent) {
    this.setContent(content)
    return this
  }

  isEmpty() {
    return this.length <= 0
  }

  clean(options: SelectionSetOptions = {}) {
    this.selectionImpl.clean(options)
    return this
  }

  reset(
    cells?: Cell | string | (Cell | string)[],
    options: SelectionSetOptions = {},
  ) {
    this.selectionImpl.reset(cells ? this.getCells(cells) : [], options)
    return this
  }

  getSelectedCells() {
    return this.cells
  }

  getSelectedCellCount() {
    return this.length
  }

  isSelected(cell: Cell | string) {
    return this.selectionImpl.isSelected(cell)
  }

  select(
    cells: Cell | string | (Cell | string)[],
    options: SelectionAddOptions = {},
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
    options: SelectionRemoveOptions = {},
  ) {
    this.selectionImpl.unselect(this.getCells(cells), options)
    return this
  }

  // #endregion

  protected setup() {
    this.selectionImpl.on('*', (name, args) => {
      this.trigger(name, args)
      this.graph.trigger(name, args)
    })
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
    if (!this.allowBlankMouseDown(e)) {
      return
    }

    const allowGraphPanning = this.graph.panning.allowPanning(e, true)
    const scroller = this.graph.getPlugin<any>('scroller')
    const allowScrollerPanning = scroller && scroller.allowPanning(e, true)
    if (
      this.allowRubberband(e, true) ||
      (this.allowRubberband(e) && !allowScrollerPanning && !allowGraphPanning)
    ) {
      this.startRubberband(e)
    }
  }

  protected allowBlankMouseDown(e: Dom.MouseDownEvent) {
    const eventTypes = this.options.eventTypes
    return (
      (eventTypes?.includes('leftMouseDown') && e.button === 0) ||
      (eventTypes?.includes('mouseWheelDown') && e.button === 1)
    )
  }

  protected onBlankClick() {
    this.clean()
  }

  protected allowRubberband(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      !this.rubberbandDisabled &&
      isModifierKeyMatch(e, this.options.modifiers, strict)
    )
  }

  protected allowMultipleSelection(e: Dom.MouseDownEvent | Dom.MouseUpEvent) {
    return (
      this.isMultiple() &&
      isModifierKeyMatch(e, this.options.multipleSelectionModifiers)
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
  }: SelectionImplEventArgs['box:mousedown']) {
    if (!this.disabled) {
      if (this.allowMultipleSelection(e)) {
        this.unselect(cell)
        this.unselectMap.set(cell, true)
      }
    }
  }

  protected getCells(cells: Cell | string | (Cell | string)[]) {
    return (Array.isArray(cells) ? cells : [cells])
      .map((cell) =>
        typeof cell === 'string' ? this.graph.getCellById(cell) : cell,
      )
      .filter((cell) => cell != null)
  }

  protected startRubberband(e: Dom.MouseDownEvent) {
    if (!this.rubberbandDisabled) {
      this.selectionImpl.startSelecting(e)
    }
    return this
  }

  protected isMultiple() {
    return this.options.multiple !== false
  }

  protected enableMultiple() {
    this.options.multiple = true
    return this
  }

  protected disableMultiple() {
    this.options.multiple = false
    return this
  }

  protected setModifiers(modifiers?: string | ModifierKey[] | null) {
    this.options.modifiers = modifiers
    return this
  }

  protected setContent(content?: SelectionContent) {
    this.selectionImpl.setContent(content)
    return this
  }

  protected setFilter(filter?: SelectionFilter) {
    this.selectionImpl.setFilter(filter)
    return this
  }

  @disposable()
  dispose() {
    this.stopListening()
    this.off()
    this.selectionImpl.dispose()
    CssLoader.clean(this.name)
  }
}
