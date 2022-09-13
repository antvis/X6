import Mousetrap from 'mousetrap'
import { Dom, FunctionExt, Disposable, IDisablable } from '@antv/x6-common'
import { Graph, EventArgs } from '@antv/x6-next'

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
      this.graph.on('cell:mouseup', this.focus, this)
      this.graph.on('blank:mouseup', this.focus, this)
    }

    this.mousetrap = KeyboardImpl.createMousetrap(this)
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

  private focus(e: EventArgs['node:mouseup']) {
    const isInputEvent = this.isInputEvent(e.e)
    if (isInputEvent) {
      return
    }
    const target = this.target as HTMLElement
    target.focus({
      preventScroll: true,
    })
  }

  private getKeys(keys: string | string[]) {
    return (Array.isArray(keys) ? keys : [keys]).map((key) =>
      this.formatkey(key),
    )
  }

  protected formatkey(key: string) {
    const formated = key
      .toLowerCase()
      .replace(/\s/g, '')
      .replace('delete', 'del')
      .replace('cmd', 'command')

    const formatFn = this.options.format
    if (formatFn) {
      return FunctionExt.call(formatFn, this.graph, formated)
    }

    return formated
  }

  protected isGraphEvent(e: KeyboardEvent) {
    const target = (e.srcElement || e.target) as Element
    const currentTarget = e.currentTarget as Element
    if (target) {
      if (
        target === this.target ||
        currentTarget === this.target ||
        target === document.body
      ) {
        return true
      }

      return Dom.contains(this.container, target)
    }

    return false
  }

  isInputEvent(e: KeyboardEvent | JQuery.MouseUpEvent) {
    const target = e.target as Element
    const tagName = target?.tagName?.toLowerCase()
    return ['input', 'textarea'].includes(tagName)
  }

  isEnabledForEvent(e: KeyboardEvent) {
    const allowed = !this.disabled && this.isGraphEvent(e)
    const isInputEvent = this.isInputEvent(e)
    if (allowed) {
      const code = e.keyCode || e.which
      if (isInputEvent && (code === 8 || code === 46)) {
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

export namespace KeyboardImpl {
  export function createMousetrap(keyboard: KeyboardImpl) {
    const mousetrap = new Mousetrap(keyboard.target as Element)
    const stopCallback = mousetrap.stopCallback
    mousetrap.stopCallback = (
      e: KeyboardEvent,
      elem: HTMLElement,
      combo: string,
    ) => {
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
}
