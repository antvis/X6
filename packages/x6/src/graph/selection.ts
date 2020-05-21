import { ModifierKey } from '../types'
import { Selection } from '../addon/selection'
import { Collection } from '../model/collection'
import { Cell } from '../model/cell'
import { Base } from './base'

export class SelectionManager extends Base {
  public widget: Selection

  protected get widgetOptions() {
    return this.options.selecting
  }

  protected get rubberbandDisabled() {
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

    this.graph.on('cell:mouseup', ({ e, cell }) => {
      if (!this.disabled) {
        if (
          this.widgetOptions.multiple === false ||
          (!e.ctrlKey && !e.metaKey)
        ) {
          this.clean()
        }
        this.select(cell)
      }
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

  select(cells: Cell | Cell[], options: Collection.AddOptions = {}) {
    this.widget.select(cells, options)
    return this
  }

  unselect(cells: Cell | Cell[], options: Collection.RemoveOptions = {}) {
    this.widget.unselect(Array.isArray(cells) ? cells : [cells], options)
    return this
  }

  clean() {
    this.widget.clean()
  }

  enable() {
    if (this.disabled) {
      this.widgetOptions.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.widgetOptions.enabled = false
    }
  }

  startRubberband(e: JQuery.MouseDownEvent) {
    if (!this.rubberbandDisabled) {
      this.widget.startSelecting(e)
    }
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
  }

  disableRubberband() {
    if (!this.rubberbandDisabled) {
      this.widgetOptions.rubberband = false
    }
  }
}

export namespace SelectionManager {
  export interface Options extends Selection.CommonOptions {
    enabled?: boolean
    rubberband?: boolean
    modifiers?: string | ModifierKey[] | null
    multiple?: boolean
  }
}

export namespace SelectionManager {}
