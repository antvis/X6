import { View } from '../../core/view'

export class Handle<EventArgs = any> {
  protected handles: Handle.Options[]
  protected $handleContainer: JQuery<HTMLElement>

  protected get handleClassName() {
    return View.prototype.prefixClassName('widget-handle')
  }

  hasHandle(name: string) {
    return this.getHandleIdx(name) >= 0
  }

  getHandleIdx(name: string) {
    return this.handles.findIndex(item => item.name === name)
  }

  getHandle(name: string) {
    return this.handles.find(item => item.name === name)
  }

  renderHandle(this: Handle & View, handle: Handle.Options) {
    const cls = this.handleClassName
    const $handle = this.$('<div/>')
      .addClass(`${cls} ${cls}-${handle.name} ${cls}-pos-${handle.position}`)
      .attr('data-action', handle.name)

    this.updateHandleIcon($handle, handle.icon)

    if (handle.content) {
      if (typeof handle.content === 'string') {
        $handle.html(handle.content)
      } else {
        $handle.append(handle.content)
      }
    }

    this.applyAttrs($handle, handle.attrs)

    return $handle
  }

  addHandle(this: Handle & View, handle: Handle.Options) {
    this.handles.push(handle)
    this.$handleContainer.append(this.renderHandle(handle))
    const events = handle.events
    if (events) {
      Object.keys(events).forEach(action => {
        const callback = events[action]
        const name = `action:${handle.name}:${action}` as any
        if (typeof callback === 'string') {
          this.on(name, (this as any)[callback], this)
        } else {
          this.on(name, callback)
        }
      })
    }

    return this
  }

  addHandles(this: Handle & View, handles: Handle.Options[]) {
    handles.forEach(handle => this.addHandle(handle))
    return this
  }

  removeHandles(this: Handle & View) {
    while (this.handles.length) {
      this.removeHandle(this.handles[0].name)
    }
    return this
  }

  removeHandle(this: Handle & View, name: string) {
    const index = this.getHandleIdx(name)
    const handle = this.handles[index]
    if (handle) {
      if (handle.events) {
        Object.keys(handle.events).forEach(event => {
          this.off(`action:${name}:${event}` as any)
        })
      }
      this.getHandleElem(name).remove()
      this.handles.splice(index, 1)
    }
    return this
  }

  changeHandle(
    this: Handle & View,
    name: string,
    newHandle: Partial<Handle.Options>,
  ) {
    const handle = this.getHandle(name)
    if (handle) {
      this.removeHandle(name)
      this.addHandle({
        name,
        ...handle,
        ...newHandle,
      })
    }
    return this
  }

  toggleHandle(name: string, selected?: boolean) {
    const handle = this.getHandle(name)
    if (handle) {
      const $handle = this.getHandleElem(name)
      const className = `${this.handleClassName}-selected`
      if (selected === undefined) {
        // tslint:disable-next-line
        selected = !$handle.hasClass(className)
      }
      $handle.toggleClass(className, selected)
      const icon = selected ? handle.iconSelected : handle.icon
      if (icon) {
        this.updateHandleIcon($handle, icon)
      }
    }
    return this
  }

  selectHandle(name: string) {
    return this.toggleHandle(name, true)
  }

  deselectHandle(name: string) {
    return this.toggleHandle(name, false)
  }

  deselectAllHandles() {
    this.handles.forEach(handle => this.deselectHandle(handle.name))
    return this
  }

  protected getHandleElem(name: string) {
    return this.$handleContainer.find<HTMLElement>(
      `.${this.handleClassName}-${name}`,
    )
  }

  protected updateHandleIcon(
    $handle: JQuery<HTMLElement>,
    icon?: string | null,
  ) {
    $handle.css('background-image', icon ? `url(${icon})` : '')
  }

  protected applyAttrs(
    elem: HTMLElement | JQuery,
    attrs?: { [selector: string]: JQuery.PlainObject },
  ) {
    if (attrs) {
      const $elem = View.$(elem)
      Object.keys(attrs).forEach(selector => {
        const $element = $elem
          .find(selector)
          .addBack()
          .filter(selector)
        const { class: cls, ...attr } = attrs[selector]
        if (cls) {
          $element.addClass(cls)
        }
        $element.attr(attr)
      })
    }
  }
}

export namespace Handle {
  export type OrthPosition = 'e' | 'w' | 's' | 'n'
  export type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw'

  export interface Options {
    /**
     * The name of the custom tool. This name will be also set as a
     * CSS class to the handle DOM element making it easy to select
     * it your CSS stylesheet.
     */
    name: string
    position: Position
    /**
     * The icon url used to render the tool. This icons is set as a
     * background image on the tool handle DOM element.
     */
    icon?: string | null
    iconSelected?: string | null
    content?: string | Element
    events?: { [event: string]: string }
    attrs?: { [selector: string]: JQuery.PlainObject }
  }

  export interface EventArgs {
    e: JQuery.TriggeredEvent
    x: number
    y: number
    dx: number
    dy: number
  }
}
