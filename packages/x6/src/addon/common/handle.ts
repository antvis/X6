import { Dom, Vector } from '../../util'
import { View } from '../../view/view'
import { Graph } from '../../graph/graph'
import { Point, Angle } from '../../geometry'

export class Handle {
  public readonly graph: Graph
  protected readonly handleOptions: Handle.Options
  protected handles: Handle.Metadata[]
  protected $handleContainer: JQuery<HTMLElement>
  protected $pieToggles: { [name: string]: JQuery<HTMLElement> }

  protected get handleClassName() {
    return ClassNames.handle
  }

  protected get pie() {
    return {
      ...Handle.defaultPieOptions,
      ...this.handleOptions.pie,
    }
  }

  protected initHandles(this: Handle & View) {
    this.handles = []

    if (this.handleOptions.handles) {
      this.handleOptions.handles.forEach((handle) => this.addHandle(handle))
    }

    if (this.handleOptions.type === 'pie') {
      if (this.pie.toggles) {
        const className = ClassNames.pieToggle
        this.$pieToggles = {}
        this.pie.toggles.forEach((item) => {
          const $elem = this.$('<div/>')
          this.applyAttrs($elem, item.attrs)
          $elem
            .addClass(className)
            .addClass(`${className}-pos-${item.position || 'e'}`)
            .attr('data-name', item.name)
            .appendTo(this.container)
          this.$pieToggles[item.name] = $elem
        })
      }

      this.setPieIcons()
    }

    if (this.$handleContainer) {
      const type = this.handleOptions.type || 'surround'
      this.$handleContainer
        .addClass(ClassNames.wrap)
        .addClass(ClassNames.animate)
        .addClass(`${ClassNames.handle}-${type}`)
    }

    this.delegateEvents({
      [`mousedown .${ClassNames.handle}`]: 'onHandleMouseDown',
      [`touchstart .${ClassNames.handle}`]: 'onHandleMouseDown',
      [`mousedown .${ClassNames.pieToggle}`]: 'onPieToggleMouseDown',
      [`touchstart .${ClassNames.pieToggle}`]: 'onPieToggleMouseDown',
    })
  }

  protected onHandleMouseDown(this: Handle & View, evt: JQuery.MouseDownEvent) {
    const action = this.$(evt.currentTarget)
      .closest(`.${ClassNames.handle}`)
      .attr('data-action')

    if (action) {
      evt.preventDefault()
      evt.stopPropagation()
      this.setEventData<Handle.EventData>(evt, {
        action,
        clientX: evt.clientX,
        clientY: evt.clientY,
        startX: evt.clientX,
        startY: evt.clientY,
      })

      if (evt.type === 'mousedown' && evt.button === 2) {
        this.triggerHandleAction(action, 'contextmenu', evt)
      } else {
        this.triggerHandleAction(action, 'mousedown', evt)
        this.delegateDocumentEvents(
          {
            mousemove: 'onHandleMouseMove',
            touchmove: 'onHandleMouseMove',
            mouseup: 'onHandleMouseUp',
            touchend: 'onHandleMouseUp',
            touchcancel: 'onHandleMouseUp',
          },
          evt.data,
        )
      }
    }
  }

  protected onHandleMouseMove(this: Handle & View, evt: JQuery.MouseMoveEvent) {
    const data = this.getEventData<Handle.EventData>(evt)
    const action = data.action
    if (action) {
      this.triggerHandleAction(action, 'mousemove', evt)
    }
  }

  protected onHandleMouseUp(this: Handle & View, evt: JQuery.MouseUpEvent) {
    const data = this.getEventData<Handle.EventData>(evt)
    const action = data.action
    if (action) {
      this.triggerHandleAction(action, 'mouseup', evt)
      this.undelegateDocumentEvents()
    }
  }

  protected triggerHandleAction(
    this: Handle & View,
    action: string,
    eventName: string,
    evt: JQuery.TriggeredEvent,
    args?: any,
  ) {
    evt.preventDefault()
    evt.stopPropagation()

    const e = this.normalizeEvent(evt)
    const data = this.getEventData<Handle.EventData>(e)
    const local = this.graph.snapToGrid(e.clientX!, e.clientY!)
    const origin = this.graph.snapToGrid(data.clientX, data.clientY)
    const dx = local.x - origin.x
    const dy = local.y - origin.y

    this.trigger(`action:${action}:${eventName}`, {
      e,
      dx,
      dy,
      x: local.x,
      y: local.y,
      offsetX: evt.clientX! - data.startX,
      offsetY: evt.clientY! - data.startY,
      ...args,
    })

    data.clientX = evt.clientX!
    data.clientY = evt.clientY!
  }

  protected onPieToggleMouseDown(
    this: Handle & View,
    evt: JQuery.MouseDownEvent,
  ) {
    evt.stopPropagation()
    const name = this.$(evt.target)
      .closest(`.${ClassNames.pieToggle}`)
      .attr('data-name')
    if (!this.isOpen(name)) {
      if (this.isOpen()) {
        this.toggleState()
      }
    }
    this.toggleState(name)
  }

  protected setPieIcons(this: Handle & View) {
    if (this.handleOptions.type === 'pie') {
      this.$handleContainer.find(`.${ClassNames.handle}`).each((_, elem) => {
        const $elem = this.$(elem)
        const action = $elem.attr('data-action')!
        const className = ClassNames.pieSlice
        const handle = this.getHandle(action)

        if (!handle || !handle.icon) {
          const contect = window
            .getComputedStyle(elem, ':before')
            .getPropertyValue('content')
          if (contect && contect !== 'none') {
            const $icons = $elem.find<any>(`.${className}-txt`)
            if ($icons.length) {
              Vector.create($icons[0]).text(contect.replace(/['"]/g, ''))
            }
          }

          const bgImg = $elem.css('background-image')
          if (bgImg) {
            const matches = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/)
            if (matches) {
              const href = matches[1]
              const $imgs = $elem.find<any>(`.${className}-img`)
              if ($imgs.length > 0) {
                Vector.create($imgs[0]).attr('xlink:href', href)
              }
            }
          }
        }
      })
    }
  }

  getHandleIdx(name: string) {
    return this.handles.findIndex((item) => item.name === name)
  }

  hasHandle(name: string) {
    return this.getHandleIdx(name) >= 0
  }

  getHandle(name: string) {
    return this.handles.find((item) => item.name === name)
  }

  renderHandle(this: Handle & View, handle: Handle.Metadata) {
    const $handle = this.$('<div/>')
      .addClass(`${ClassNames.handle} ${ClassNames.handle}-${handle.name}`)
      .attr('data-action', handle.name)
      .prop('draggable', false)

    if (this.handleOptions.type === 'pie') {
      const index = this.getHandleIdx(handle.name)
      const pie = this.pie
      const outerRadius = pie.outerRadius
      const innerRadius = pie.innerRadius
      const offset = (outerRadius + innerRadius) / 2
      const ratio = new Point(outerRadius, outerRadius)
      const delta = Angle.toRad(pie.sliceAngle)
      const curRad = index * delta + Angle.toRad(pie.startAngle)
      const nextRad = curRad + delta
      const pathData = Dom.createSlicePathData(
        innerRadius,
        outerRadius,
        curRad,
        nextRad,
      )

      const vSvg = Vector.create('svg').addClass(`${ClassNames.pieSlice}-svg`)
      const vPath = Vector.create('path')
        .addClass(ClassNames.pieSlice)
        .attr('d', pathData)
        .translate(outerRadius, outerRadius)
      const pos = Point.fromPolar(offset, -curRad - delta / 2, ratio).toJSON()
      const iconSize = pie.iconSize
      const vImg = Vector.create('image')
        .attr(pos)
        .addClass(`${ClassNames.pieSlice}-img`)
      pos.y = pos.y + iconSize - 2
      const vText = Vector.create('text', { 'font-size': iconSize })
        .attr(pos)
        .addClass(`${ClassNames.pieSlice}-txt`)

      vImg.attr({
        width: iconSize,
        height: iconSize,
      })
      vImg.translate(-iconSize / 2, -iconSize / 2)
      vText.translate(-iconSize / 2, -iconSize / 2)
      vSvg.append([vPath, vImg, vText])
      $handle.append(vSvg.node)
    } else {
      $handle.addClass(`${ClassNames.handle}-pos-${handle.position}`)
      if (handle.content) {
        if (typeof handle.content === 'string') {
          $handle.html(handle.content)
        } else {
          $handle.append(handle.content)
        }
      }
    }

    this.updateHandleIcon($handle, handle.icon)
    this.applyAttrs($handle, handle.attrs)

    return $handle
  }

  addHandle(this: Handle & View, handle: Handle.Metadata) {
    if (!this.hasHandle(handle.name)) {
      this.handles.push(handle)

      const events = handle.events
      if (events) {
        Object.keys(events).forEach((action) => {
          const callback = events[action]
          const name = `action:${handle.name}:${action}` as any
          if (typeof callback === 'string') {
            this.on(name, (this as any)[callback], this)
          } else {
            this.on(name, callback)
          }
        })
      }

      if (this.$handleContainer) {
        this.$handleContainer.append(this.renderHandle(handle))
      }
    }

    return this
  }

  addHandles(this: Handle & View, handles: Handle.Metadata[]) {
    handles.forEach((handle) => this.addHandle(handle))
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
        Object.keys(handle.events).forEach((event) => {
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
    newHandle: Partial<Handle.Metadata>,
  ) {
    const handle = this.getHandle(name)
    if (handle) {
      this.removeHandle(name)
      this.addHandle({
        ...handle,
        ...newHandle,
      })
    }
    return this
  }

  toggleHandle(this: Handle & View, name: string, selected?: boolean) {
    const handle = this.getHandle(name)
    if (handle) {
      const $handle = this.getHandleElem(name)
      const className = `${ClassNames.handle}-selected`
      if (selected === undefined) {
        selected = !$handle.hasClass(className) // eslint-disable-line
      }

      $handle.toggleClass(className, selected)
      const icon = selected ? handle.iconSelected : handle.icon
      if (icon) {
        this.updateHandleIcon($handle, icon)
      }
    }
    return this
  }

  selectHandle(this: Handle & View, name: string) {
    return this.toggleHandle(name, true)
  }

  deselectHandle(this: Handle & View, name: string) {
    return this.toggleHandle(name, false)
  }

  deselectAllHandles(this: Handle & View) {
    this.handles.forEach((handle) => this.deselectHandle(handle.name))
    return this
  }

  protected getHandleElem(name: string) {
    return this.$handleContainer.find<HTMLElement>(
      `.${ClassNames.handle}-${name}`,
    )
  }

  protected updateHandleIcon(
    this: Handle & View,
    $handle: JQuery<HTMLElement>,
    icon?: string | null,
  ) {
    if (this.handleOptions.type === 'pie') {
      const $icons = $handle.find(`.${ClassNames.pieSliceImg}`)
      this.$($icons[0]).attr('xlink:href', icon || '')
    } else {
      $handle.css('background-image', icon ? `url(${icon})` : '')
    }
  }

  protected isRendered() {
    return this.$handleContainer != null
  }

  protected isOpen(name?: string) {
    if (this.isRendered()) {
      return name
        ? this.$pieToggles[name].hasClass(ClassNames.pieToggleOpened)
        : this.$handleContainer.hasClass(`${ClassNames.pieOpended}`)
    }
    return false
  }

  protected toggleState(this: Handle & View, name?: string) {
    if (this.isRendered()) {
      const $handleContainer = this.$handleContainer

      Object.keys(this.$pieToggles).forEach((key) => {
        const $toggle = this.$pieToggles[key]
        $toggle.removeClass(ClassNames.pieToggleOpened)
      })

      if (this.isOpen()) {
        this.trigger('pie:close', { name })
        $handleContainer.removeClass(ClassNames.pieOpended)
      } else {
        this.trigger('pie:open', { name })
        if (name) {
          const toggles = this.pie.toggles
          const toggle = toggles && toggles.find((i) => i.name === name)
          if (toggle) {
            $handleContainer.attr({
              'data-pie-toggle-name': toggle.name,
              'data-pie-toggle-position': toggle.position,
            })
          }
          this.$pieToggles[name].addClass(ClassNames.pieToggleOpened)
        }
        $handleContainer.addClass(ClassNames.pieOpended)
      }
    }
  }

  protected applyAttrs(
    elem: HTMLElement | JQuery,
    attrs?: { [selector: string]: JQuery.PlainObject },
  ) {
    if (attrs) {
      const $elem = View.$(elem)
      Object.keys(attrs).forEach((selector) => {
        const $element = $elem.find(selector).addBack().filter(selector)
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
  export type Type = 'surround' | 'pie' | 'toolbar'
  export type OrthPosition = 'e' | 'w' | 's' | 'n'
  export type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw'

  export interface Metadata {
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
    events?: { [event: string]: string | ((args: EventArgs) => void) }
    attrs?: { [selector: string]: JQuery.PlainObject }
  }

  export interface Pie {
    innerRadius: number
    outerRadius: number
    sliceAngle: number
    startAngle: number
    iconSize: number
    toggles: {
      name: string
      position: OrthPosition
      attrs?: { [selector: string]: JQuery.PlainObject }
    }[]
  }

  export interface Options {
    type?: Type
    pie?: Partial<Pie>
    handles?: Metadata[] | null
    tinyThreshold?: number
    smallThreshold?: number
  }

  export const defaultPieOptions: Pie = {
    innerRadius: 20,
    outerRadius: 50,
    sliceAngle: 45,
    startAngle: 0,
    iconSize: 14,
    toggles: [
      {
        name: 'default',
        position: 'e',
      },
    ],
  }

  export interface EventArgs {
    e: JQuery.TriggeredEvent
    x: number
    y: number
    dx: number
    dy: number
    offsetX: number
    offsetY: number
  }

  export interface EventData {
    action: string
    clientX: number
    clientY: number
    startX: number
    startY: number
  }
}

namespace ClassNames {
  export const handle = View.prototype.prefixClassName('widget-handle')
  export const wrap = `${handle}-wrap`
  export const animate = `${handle}-animate`
  export const pieOpended = `${handle}-pie-opened`
  export const pieToggle = `${handle}-pie-toggle`
  export const pieToggleOpened = `${handle}-pie-toggle-opened`
  export const pieSlice = `${handle}-pie-slice`
  export const pieSliceImg = `${handle}-pie-slice-img`
}
