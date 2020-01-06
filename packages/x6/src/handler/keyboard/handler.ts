import { DomUtil, DomEvent } from '../../dom'
import { Graph } from '../../graph'
import { Mousetrap } from './mousetrap'
import { BaseHandler } from '../base-handler'

export class KeyboardHandler extends BaseHandler {
  public readonly target: HTMLElement | Document
  public readonly mousetrap: Mousetrap
  private readonly formatkey: (key: string) => string

  constructor(graph: Graph) {
    super(graph)
    const options = this.graph.options.keyboard
    this.target = options.global ? document : this.graph.container
    this.formatkey = options.formatkey || ((key: string) => key)
    this.mousetrap = new Mousetrap(this.target as Element, this)
    this.setEnadled(options.enabled)
  }

  enable() {
    this.graph.options.keyboard.enabled = true
    super.enable()
  }

  disable() {
    this.graph.options.keyboard.enabled = false
    super.disable()
  }

  bind(
    keys: string | string[],
    callback: KeyboardHandler.Handler,
    action?: KeyboardHandler.Action,
  ) {
    this.mousetrap.bind(this.getKeys(keys), callback, action)
  }

  unbind(keys: string | string[], action?: KeyboardHandler.Action) {
    this.mousetrap.unbind(this.getKeys(keys), action)
  }

  escape(e: KeyboardEvent) {
    if (this.graph.isEscapeEnabled()) {
      this.graph.eventloopManager.escape(e)
    }
  }

  private getKeys(keys: string | string[]) {
    return (Array.isArray(keys) ? keys : [keys])
      .map(key =>
        key
          .toLowerCase()
          .replace(/\s/g, '')
          .replace('delete', 'del')
          .replace('cmd', 'command'),
      )
      .map(this.formatkey)
  }

  protected isGraphEvent(e: KeyboardEvent) {
    const source = DomEvent.getSource(e)
    if (source === this.target || source.parentNode === this.target) {
      return true
    }

    // Accepts events from in-place editing inside graph
    if (
      this.graph.cellEditor != null &&
      this.graph.cellEditor.isEventSource(e)
    ) {
      return true
    }

    // Accepts events from inside the container
    return DomUtil.isAncestor(this.graph.container, source)
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

  @BaseHandler.dispose()
  dispose() {
    this.mousetrap.reset()
  }
}

export namespace KeyboardHandler {
  export type Action = 'keypress' | 'keydown' | 'keyup'
  export type Handler = (e: KeyboardEvent) => void
}
