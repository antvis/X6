import * as util from '../util'
import { Graph } from '../core'
import { DomEvent } from '../common'
import { BaseHandler } from './handler-base'

export class KeyboardHandler extends BaseHandler {
  /**
   * The target DOM where the key event listeners are installed.
   */
  protected target: HTMLElement | null = null

  /**
   * Maps from keycodes to functions for non-pressed control keys.
   */
  protected normalKeys: { [code: number]: KeyHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed shift keys.
   */
  protected shiftKeys: { [code: number]: KeyHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed control keys.
   */
  protected controlKeys: { [code: number]: KeyHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed control and shift keys.
   */
  protected controlShiftKeys: { [code: number]: KeyHandler.KeydownHandler }

  protected keydownHandler: KeyHandler.KeydownHandler

  constructor(graph: Graph, target?: HTMLElement) {
    super(graph)
    this.target = target || document.documentElement

    // Creates the arrays to map from keycodes to functions
    this.normalKeys = {}
    this.shiftKeys = {}
    this.controlKeys = {}
    this.controlShiftKeys = {}

    this.keydownHandler = (e: KeyboardEvent) => {
      this.keyDown(e)
    }

    DomEvent.addListener(this.target, 'keydown', this.keydownHandler)
  }

  bindKey(code: number, fn: KeyHandler.KeydownHandler) {
    this.normalKeys[code] = fn
  }

  bindShiftKey(code: number, fn: KeyHandler.KeydownHandler) {
    this.shiftKeys[code] = fn
  }

  bindControlKey(code: number, fn: KeyHandler.KeydownHandler) {
    this.controlKeys[code] = fn
  }

  bindControlShiftKey(code: number, fn: KeyHandler.KeydownHandler) {
    this.controlShiftKeys[code] = fn
  }

  isControlDown(e: KeyboardEvent) {
    return DomEvent.isControlDown(e)
  }

  isShiftDown(e: KeyboardEvent) {
    return DomEvent.isShiftDown(e)
  }

  /**
   * Returns the function associated with the given key event or null if no
   * function is associated with the given event.
   */
  getFunction(e: KeyboardEvent) {
    if (e != null && !DomEvent.isAltDown(e)) {
      if (this.isControlDown(e)) {
        if (this.isShiftDown(e)) {
          return this.controlShiftKeys[e.keyCode]
        }

        return this.controlKeys[e.keyCode]
      }

      if (this.isShiftDown(e)) {
        return this.shiftKeys[e.keyCode]
      }

      return this.normalKeys[e.keyCode]
    }

    return null
  }

  isGraphEvent(e: KeyboardEvent) {
    const source = DomEvent.getSource(e)
    // Accepts events from the target object or
    // in-place editing inside graph
    if (
      (source === this.target || source.parentNode === this.target) ||
      (this.graph.cellEditor != null && this.graph.cellEditor.isEventSource(e))
    ) {
      return true
    }

    // Accepts events from inside the container
    return util.isAncestorNode(this.graph.container, source)
  }

  isEnabledForEvent(e: KeyboardEvent) {
    return (
      this.isEnabled() &&
      this.graph.isEnabled() &&
      this.isGraphEvent(e) &&
      !DomEvent.isConsumed(e)
    )
  }

  isEventIgnored(e: KeyboardEvent) {
    return this.graph.isEditing()
  }

  keyDown(e: KeyboardEvent) {
    if (this.isEnabledForEvent(e)) {
      if (e.keyCode === 27) {
        this.escape(e)
      } else if (!this.isEventIgnored(e)) {
        const fn = this.getFunction(e)
        if (fn != null) {
          fn(e)
          DomEvent.consume(e)
        }
      }
    }
  }

  escape(e: KeyboardEvent) {
    if (this.graph.isEscapeEnabled()) {
      this.graph.eventManager.escape(e)
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    if (this.target != null && this.keydownHandler != null) {
      DomEvent.removeListener(this.target, 'keydown', this.keydownHandler)
    }
    this.target = null

    super.dispose()
  }
}

export namespace KeyHandler {
  export type KeydownHandler = (e: KeyboardEvent) => void
}
