import Mousetrap from 'mousetrap'
import { Disposable, FunctionExt, IDisablable } from '../../common'
import { EventArgs, Graph } from '../../graph'
import { formatKey, isGraphEvent, isInputEvent } from './util'

/**
 * Create a Mousetrap instance for the keyboard.
 */
export function createMousetrap(keyboard: KeyboardImpl) {
  const mousetrap = new Mousetrap(keyboard.target as Element)
  const stopCallback = mousetrap.stopCallback
  mousetrap.stopCallback = (e, elem, combo) => {
    if (keyboard.isEnabledForEvent(e)) {
      if (stopCallback) {
        return stopCallback.call(mousetrap, e, elem, combo)
      }
      return false
    }
    return true
  }

  return mousetrap
}

export class KeyboardImpl extends Disposable implements IDisablable {
  public readonly target: HTMLElement | Document
  private readonly container: HTMLElement
  private readonly mousetrap: Mousetrap.MousetrapInstance

  private get graph() {
    return this.options.graph
  }

  constructor(
    private readonly options: KeyboardImpl.Options & { graph: Graph },
  ) {
    super()
    const scroller = this.graph.getPlugin('scroller') as any
    this.container = scroller ? scroller.container : this.graph.container

    if (options.global) {
      this.target = document
    } else {
      this.target = this.container
      if (!this.disabled) {
        // ensure the container focusable
        this.target.setAttribute('tabindex', '-1')
      }

      // change to mouseup event，prevent page stalling caused by focus
      this.graph.on('cell:mouseup', this.focus.bind, this)
      this.graph.on('blank:mouseup', this.focus.bind, this)
    }

    this.mousetrap = createMousetrap(this)
  }

  get disabled() {
    return this.options.enabled !== true
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
      if (this.target instanceof HTMLElement) {
        this.target.setAttribute('tabindex', '-1')
      }
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
      if (this.target instanceof HTMLElement) {
        this.target.removeAttribute('tabindex')
      }
    }
  }

  on(
    keys: string | string[],
    callback: KeyboardImpl.Handler,
    action?: KeyboardImpl.Action,
  ) {
    this.mousetrap.bind(this.getKeys(keys), callback, action)
  }

  off(keys: string | string[], action?: KeyboardImpl.Action) {
    this.mousetrap.unbind(this.getKeys(keys), action)
  }

  clear() {
    this.mousetrap.reset()
  }

  trigger(key: string, action?: KeyboardImpl.Action) {
    this.mousetrap.trigger(
      formatKey(key, this.options.format, this.graph),
      action,
    )
  }

  private focus(e: EventArgs['node:mouseup']) {
    const isInput = isInputEvent(e.e)
    if (isInput) {
      return
    }
    const target = this.target as HTMLElement
    target.focus({
      preventScroll: true,
    })
  }

  private getKeys(keys: string | string[]) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) =>
      formatKey(key, this.options.format, this.graph),
    )
  }

  isEnabledForEvent(e: KeyboardEvent) {
    const allowed =
      !this.disabled && isGraphEvent(e, this.target as Element, this.container)
    const isInput = isInputEvent(e)
    if (allowed) {
      if (isInput && (e.key === 'Backspace' || e.key === 'Delete')) {
        return false
      }
      if (this.options.guard) {
        return FunctionExt.call(this.options.guard, this.graph, e)
      }
    }
    return allowed
  }

  @Disposable.dispose()
  dispose() {
    this.mousetrap.reset()
  }
}

export namespace KeyboardImpl {
  export type Action = 'keypress' | 'keydown' | 'keyup'
  export type Handler = (e: KeyboardEvent) => void

  export interface Options {
    enabled?: boolean

    /**
     * Specifies if keyboard event should bind on docuemnt or on container.
     *
     * Default is `false` that will bind keyboard event on the container.
     */
    global?: boolean

    format?: (this: Graph, key: string) => string
    guard?: (this: Graph, e: KeyboardEvent) => boolean
  }
}
