import { Graph, Model, Cell, CellState } from '../core'
import { View } from '../core/view'
import { MouseHandler } from './handler-mouse'
import { CustomMouseEvent, Dictionary } from '../common'
import { NodeHandler } from './node-handler'

export class SelectionHandler extends MouseHandler {
  /**
   * Defines the maximum number of handlers to paint individually.
   *
   * Default is `100`.
   */
  maxHandlers = 100

  protected handlers: Dictionary<Cell, NodeHandler>

  private refreshHandler: (() => void) | null

  constructor(graph: Graph) {
    super(graph)

    this.handlers = new Dictionary<Cell, NodeHandler>()
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
    // Removes all existing handlers
    const oldHandlers = this.handlers
    this.handlers = new Dictionary<Cell, NodeHandler>()

    // Creates handles for all selection cells
    this.graph.getSelectedCells().forEach((cell) => {
      const state = this.graph.view.getState(cell)
      if (state != null) {
        let handler: NodeHandler | null = oldHandlers.delete(cell) || null
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
          handler = this.graph.handlerManager.createCellHandler(state) as NodeHandler
          this.trigger(SelectionHandler.events.addHandler, { state })
        }

        if (handler != null) {
          this.handlers.set(cell, handler)
        }
      }
    })

    // Destroys all unused handlers
    oldHandlers.each((handler) => {
      this.trigger(SelectionHandler.events.removeHandler, { state: handler.state })
      handler.dispose()
    })
  }

  /**
   * Updates the handler for the given shape if one exists.
   */
  updateHandler(state: CellState) {
    let handler = this.handlers.delete(state.cell)
    if (handler != null) {
      // Transfers the current state to the new handler
      const index = handler.index
      const x = handler.startX
      const y = handler.startY

      handler.dispose()
      handler = this.graph.handlerManager.createCellHandler(state) as NodeHandler

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
  protected isHandlerActive(handler: NodeHandler) {
    return handler.index != null
  }

  protected canHandle(e: CustomMouseEvent) {
    return this.graph.isEnabled() && this.isEnabled()
  }

  getHandler(cell: Cell) {
    return this.handlers.get(cell)
  }

  mouseDown(e: CustomMouseEvent, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseDown(e, sender))
    }
  }

  mouseMove(e: CustomMouseEvent, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseMove(e, sender))
    }
  }

  mouseUp(e: CustomMouseEvent, sender: any) {
    if (this.canHandle(e)) {
      this.handlers.each(h => h.mouseUp(e, sender))
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)

    this.graph.off(null, this.refreshHandler)
    this.graph.view.off(null, this.refreshHandler)
    this.graph.model.off(null, this.refreshHandler)
    this.refreshHandler = null

    super.dispose()
  }
}

export namespace SelectionHandler {
  export const events = {
    addHandler: 'addHandler',
    removeHandler: 'removeHandler',
  }
}
