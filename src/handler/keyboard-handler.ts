import * as util from '../util'
import Mousetrap from 'mousetrap'
import { Graph } from '../core'
import { DomEvent, Disposable } from '../common'
import { BaseHandler } from '../handler'
import { KeyboardOptions } from '../option'

export class KeyboardHandler extends BaseHandler {
  public readonly target: HTMLElement | Document
  public readonly mousetrap: MousetrapInstance

  constructor(graph: Graph) {
    super(graph)
    const options = this.graph.options.keyboard as KeyboardOptions
    if (options.enabled) {
      this.enable()
    } else {
      this.disable()
    }

    this.target = options.global ? document : this.graph.container

    const handler = this // tslint:disable-line
    class MousetrapEx extends Mousetrap {
      stopCallback(
        e: KeyboardEvent,
        elem: HTMLElement,
        combo: string,
      ) {
        if (handler.isEnabledForEvent(e)) {
          if (e.keyCode === 27 || !handler.isEventIgnored(e)) {
            handler.escape(e)
            return super.stopCallback(e, elem, combo)
          }

          if (!handler.isEventIgnored(e)) {
            return super.stopCallback(e, elem, combo)
          }
        }

        return false
      }
    }
    this.mousetrap = new MousetrapEx(this.target as Element)
  }

  bind(
    keys: string | string[],
    callback: KeyboardHandler.Handler,
    action?: KeyboardHandler.Action,
  ) {
    this.mousetrap.bind(keys, callback, action)
  }

  unbind(keys: string | string[], action?: KeyboardHandler.Action) {
    this.mousetrap.unbind(keys, action)
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

  protected escape(e: KeyboardEvent) {
    if (this.graph.isEscapeEnabled()) {
      this.graph.eventloop.escape(e)
    }
  }

  @Disposable.aop()
  dispose() {
    this.mousetrap.reset()
  }
}

export namespace KeyboardHandler {
  export type Action = 'keypress' | 'keydown' | 'keyup'
  export type Handler = (e: KeyboardEvent) => void
}
