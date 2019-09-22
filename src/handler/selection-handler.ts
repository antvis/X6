import { Graph, Model, Cell, State } from '../core'
import { View } from '../core/view'
import { MouseHandler } from './handler-mouse'
import { NodeHandler } from './node-handler'
import { EdgeHandler } from './edge-handler'
import { MouseEventEx, Dictionary, Disposable } from '../common'

export class SelectionHandler extends MouseHandler {
  protected handlers: Dictionary<Cell, NodeHandler | EdgeHandler>
  private refreshHandler: (() => void) | null

  constructor(graph: Graph) {
    super(graph)

    this.handlers = new Dictionary<Cell, NodeHandler | EdgeHandler>()
    this.graph.addMouseListener(this)

    this.refreshHandler = () => {
      if (this.isEnabled()) {
        this.refresh()
      }
    }

    this.graph.on(Graph.events.selectionChanged, this.refreshHandler)
    this.graph.view.on(View.events.scale, this.refreshHandler)
    this.graph.view.on(View.events.translate, this.refreshHandler)
    this.graph.view.on(View.events.scaleAndTranslate, this.refreshHandler)
    this.graph.view.on(View.events.down, this.refreshHandler)
    this.graph.view.on(View.events.up, this.refreshHandler)
    this.graph.model.on(Model.events.change, this.refreshHandler)
  }

  /**
   * Reloads or updates all handlers.
   */
  refresh() {
    const oldHandlers = this.handlers
    this.handlers = new Dictionary<Cell, NodeHandler>()

    // Creates handles for all selection cells
    this.graph.getSelectedCells().forEach((cell) => {
      const state = this.graph.view.getState(cell)
      if (state != null) {
        let handler = oldHandlers.delete(cell) || null
        if (handler != null) {
          if (handler.state !== state) {
            handler.dispose()
            handler = null
          } else if (!this.isHandlerActive(handler)) {
            if ((handler as any).refresh != null) {
              (handler as any).refresh()
            }
            handler.redraw()
          }
        }

        if (handler == null) {
          handler = this.graph.createCellHandler(state)
          this.trigger(SelectionHandler.events.addHandler, { state })
        }

        if (handler != null) {
          this.handlers.set(cell, handler)
        }
      }
      this.refreshClassName(state, true)
    })

    // Destroys all unused handlers
    oldHandlers.each((handler) => {
      this.refreshClassName(handler.state, false)
      this.trigger(SelectionHandler.events.removeHandler, {
        state: handler.state,
      })
      handler.dispose()
    })
  }

  refreshClassName(state: State | null, selected: boolean) {
    if (state) {
      const className = `${this.graph.prefixCls}-cell-selected`
      if (selected) {
        state.shape && state.shape.addClass(className)
        state.text && state.text.addClass(className)
      } else {
        state.shape && state.shape.removeClass(className)
        state.text && state.text.removeClass(className)
      }
    }
  }

  /**
   * Updates the handler for the given shape if one exists.
   */
  updateHandler(state: State) {
    let handler = this.handlers.delete(state.cell)
    if (handler != null) {
      // Transfers the current state to the new handler
      const index = handler.index
      const x = handler.startX
      const y = handler.startY

      handler.dispose()
      handler = this.graph.createCellHandler(state)!

      if (handler != null) {
        this.handlers.set(state.cell, handler)
        if (index != null && x != null && y != null) {
          handler.start(x, y, index)
        }
      }
    }
  }

  protected reset() {
    this.handlers.each(h => h.reset())
  }

  /**
   * Returns true if the given handler is active and should not be redrawn.
   */
  protected isHandlerActive(handler: NodeHandler | EdgeHandler) {
    return handler.index != null
  }

  protected canHandle(e: MouseEventEx) {
    return this.graph.isEnabled() && this.isEnabled()
  }

  getHandler(cell: Cell) {
    return this.handlers.get(cell)
  }

  mouseDown(e: MouseEventEx, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseDown(e, sender))
    }
  }

  mouseMove(e: MouseEventEx, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseMove(e, sender))
    }
  }

  mouseUp(e: MouseEventEx, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseUp(e, sender))
    }
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)

    this.graph.off(null, this.refreshHandler)
    this.graph.view.off(null, this.refreshHandler)
    this.graph.model.off(null, this.refreshHandler)
    this.refreshHandler = null
  }
}

export namespace SelectionHandler {
  export const events = {
    addHandler: 'addHandler',
    removeHandler: 'removeHandler',
  }
}
