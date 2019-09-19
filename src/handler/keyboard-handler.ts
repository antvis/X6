import * as util from '../util'
import { Graph } from '../core'
import { DomEvent, Disposable } from '../common'
import { BaseHandler } from '../handler'

export class KeyboardHandler extends BaseHandler {
  /**
   * The target DOM where the key event listeners are installed.
   */
  protected readonly target: HTMLElement

  /**
   * Maps from keycodes to functions for non-pressed control keys.
   */
  protected normalKeys: { [code: number]: KeyboardHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed shift keys.
   */
  protected shiftKeys: { [code: number]: KeyboardHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed control keys.
   */
  protected controlKeys: { [code: number]: KeyboardHandler.KeydownHandler }

  /**
   * Maps from keycodes to functions for pressed control and shift keys.
   */
  protected controlShiftKeys: { [code: number]: KeyboardHandler.KeydownHandler }

  protected onKeyDown: KeyboardHandler.KeydownHandler

  constructor(graph: Graph, target?: HTMLElement) {
    super(graph)
    this.target = target || document.documentElement

    // Creates the arrays to map from keycodes to functions
    this.normalKeys = {}
    this.shiftKeys = {}
    this.controlKeys = {}
    this.controlShiftKeys = {}

    this.onKeyDown = (e: KeyboardEvent) => {
      this.keyDown(e)
    }

    DomEvent.addListener(this.target, 'keydown', this.onKeyDown)
  }

  bindKey(code: number, fn: KeyboardHandler.KeydownHandler) {
    this.normalKeys[code] = fn
  }

  bindShiftKey(code: number, fn: KeyboardHandler.KeydownHandler) {
    this.shiftKeys[code] = fn
  }

  bindControlKey(code: number, fn: KeyboardHandler.KeydownHandler) {
    this.controlKeys[code] = fn
  }

  bindControlShiftKey(code: number, fn: KeyboardHandler.KeydownHandler) {
    this.controlShiftKeys[code] = fn
  }

  protected isControlDown(e: KeyboardEvent) {
    return DomEvent.isControlDown(e)
  }

  protected isShiftDown(e: KeyboardEvent) {
    return DomEvent.isShiftDown(e)
  }

  /**
   * Returns the function associated with the given key event or null if no
   * function is associated with the given event.
   */
  protected getFunction(e: KeyboardEvent) {
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

  protected isGraphEvent(e: KeyboardEvent) {
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

  protected isEnabledForEvent(e: KeyboardEvent) {
    return (
      this.isEnabled() &&
      this.graph.isEnabled() &&
      this.isGraphEvent(e) &&
      !DomEvent.isConsumed(e)
    )
  }

  protected isEventIgnored(e: KeyboardEvent) {
    return this.graph.isEditing()
  }

  protected keyDown(e: KeyboardEvent) {
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

  protected escape(e: KeyboardEvent) {
    if (this.graph.isEscapeEnabled()) {
      this.graph.eventloop.escape(e)
    }
  }

  @Disposable.aop()
  dispose() {
    DomEvent.removeListener(this.target, 'keydown', this.onKeyDown)
  }
}

export namespace KeyboardHandler {
  export type KeydownHandler = (e: KeyboardEvent) => void
}
