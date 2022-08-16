import JQuery from 'jquery'
import { Dom, FunctionExt } from '../util'
import { Cell } from '../model'
import { Config } from '../global'
import { View, Markup, CellView } from '../view'
import { Graph } from './graph'

export class GraphView extends View {
  public readonly container: HTMLElement
  public readonly background: HTMLDivElement
  public readonly grid: HTMLDivElement
  public readonly svg: SVGSVGElement
  public readonly defs: SVGDefsElement
  public readonly viewport: SVGGElement
  public readonly primer: SVGGElement
  public readonly stage: SVGGElement
  public readonly decorator: SVGGElement
  public readonly overlay: SVGGElement

  private restore: () => void

  protected get model() {
    return this.graph.model
  }

  protected get options() {
    return this.graph.options
  }

  constructor(protected readonly graph: Graph) {
    super()

    const { selectors, fragment } = Markup.parseJSONMarkup(GraphView.markup)
    this.background = selectors.background as HTMLDivElement
    this.grid = selectors.grid as HTMLDivElement
    this.svg = selectors.svg as SVGSVGElement
    this.defs = selectors.defs as SVGDefsElement
    this.viewport = selectors.viewport as SVGGElement
    this.primer = selectors.primer as SVGGElement
    this.stage = selectors.stage as SVGGElement
    this.decorator = selectors.decorator as SVGGElement
    this.overlay = selectors.overlay as SVGGElement
    this.container = this.options.container
    this.restore = GraphView.snapshoot(this.container)

    this.$(this.container)
      .addClass(this.prefixClassName('graph'))
      .append(fragment)

    this.delegateEvents()
  }

  delegateEvents() {
    const ctor = this.constructor as typeof GraphView
    super.delegateEvents(ctor.events)
    return this
  }

  /**
   * Guard the specified event. If the event is not interesting, it
   * returns `true`, otherwise returns `false`.
   */
  guard(e: JQuery.TriggeredEvent, view?: CellView | null) {
    // handled as `contextmenu` type
    if (e.type === 'mousedown' && e.button === 2) {
      return true
    }

    if (this.options.guard && this.options.guard(e, view)) {
      return true
    }

    if (e.data && e.data.guarded !== undefined) {
      return e.data.guarded
    }

    if (view && view.cell && Cell.isCell(view.cell)) {
      return false
    }

    if (
      this.svg === e.target ||
      this.container === e.target ||
      JQuery.contains(this.svg, e.target)
    ) {
      return false
    }

    return true
  }

  protected findView(elem: Element) {
    return this.graph.renderer.findViewByElem(elem)
  }

  protected onDblClick(evt: JQuery.DoubleClickEvent) {
    if (this.options.preventDefaultDblClick) {
      evt.preventDefault()
    }

    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)

    if (this.guard(e, view)) {
      return
    }

    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onDblClick(e, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:dblclick', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }
  }

  protected onClick(evt: JQuery.ClickEvent) {
    if (this.getMouseMovedCount(evt) <= this.options.clickThreshold) {
      const e = this.normalizeEvent(evt)
      const view = this.findView(e.target)
      if (this.guard(e, view)) {
        return
      }

      const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)
      if (view) {
        view.onClick(e, localPoint.x, localPoint.y)
      } else {
        this.graph.trigger('blank:click', {
          e,
          x: localPoint.x,
          y: localPoint.y,
        })
      }
    }
  }

  protected isPreventDefaultContextMenu(
    evt: JQuery.ContextMenuEvent,
    view: CellView | null,
  ) {
    let preventDefaultContextMenu = this.options.preventDefaultContextMenu
    if (typeof preventDefaultContextMenu === 'function') {
      preventDefaultContextMenu = FunctionExt.call(
        preventDefaultContextMenu,
        this.graph,
        { view },
      )
    }

    return preventDefaultContextMenu
  }

  protected onContextMenu(evt: JQuery.ContextMenuEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)

    if (this.isPreventDefaultContextMenu(e, view)) {
      evt.preventDefault()
    }

    if (this.guard(e, view)) {
      return
    }

    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onContextMenu(e, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:contextmenu', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }
  }

  delegateDragEvents(e: JQuery.MouseDownEvent, view: CellView | null) {
    if (e.data == null) {
      e.data = {}
    }
    this.setEventData<EventData.Moving>(e, {
      currentView: view || null,
      mouseMovedCount: 0,
      startPosition: {
        x: e.clientX,
        y: e.clientY,
      },
    })
    const ctor = this.constructor as typeof GraphView
    this.delegateDocumentEvents(ctor.documentEvents, e.data)
    this.undelegateEvents()
  }

  getMouseMovedCount(e: JQuery.TriggeredEvent) {
    const data = this.getEventData<EventData.Moving>(e)
    return data.mouseMovedCount || 0
  }

  protected onMouseDown(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    if (this.options.preventDefaultMouseDown) {
      e.preventDefault()
    }

    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    if (view) {
      view.onMouseDown(e, localPoint.x, localPoint.y)
    } else {
      if (
        this.options.preventDefaultBlankAction &&
        ['touchstart'].includes(e.type)
      ) {
        e.preventDefault()
      }

      this.graph.trigger('blank:mousedown', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    this.delegateDragEvents(e, view)
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const data = this.getEventData<EventData.Moving>(evt)

    const startPosition = data.startPosition
    if (
      startPosition &&
      startPosition.x === evt.clientX &&
      startPosition.y === evt.clientY
    ) {
      return
    }

    if (data.mouseMovedCount == null) {
      data.mouseMovedCount = 0
    }
    data.mouseMovedCount += 1
    const mouseMovedCount = data.mouseMovedCount
    if (mouseMovedCount <= this.options.moveThreshold) {
      return
    }

    const e = this.normalizeEvent(evt)
    const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)

    const view = data.currentView
    if (view) {
      view.onMouseMove(e, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:mousemove', {
        e,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    this.setEventData(e, data)
  }

  protected onMouseUp(e: JQuery.MouseUpEvent) {
    this.undelegateDocumentEvents()

    const normalized = this.normalizeEvent(e)
    const localPoint = this.graph.snapToGrid(
      normalized.clientX,
      normalized.clientY,
    )
    const data = this.getEventData<EventData.Moving>(e)
    const view = data.currentView
    if (view) {
      view.onMouseUp(normalized, localPoint.x, localPoint.y)
    } else {
      this.graph.trigger('blank:mouseup', {
        e: normalized,
        x: localPoint.x,
        y: localPoint.y,
      })
    }

    if (!e.isPropagationStopped()) {
      this.onClick(
        JQuery.Event(e as any, {
          type: 'click',
          data: e.data,
        }) as JQuery.ClickEvent,
      )
    }

    e.stopImmediatePropagation()

    this.delegateEvents()
  }

  protected onMouseOver(evt: JQuery.MouseOverEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    if (view) {
      view.onMouseOver(e)
    } else {
      // prevent border of paper from triggering this
      if (this.container === e.target) {
        return
      }
      this.graph.trigger('blank:mouseover', { e })
    }
  }

  protected onMouseOut(evt: JQuery.MouseOutEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)

    if (this.guard(e, view)) {
      return
    }

    if (view) {
      view.onMouseOut(e)
    } else {
      if (this.container === e.target) {
        return
      }
      this.graph.trigger('blank:mouseout', { e })
    }
  }

  protected onMouseEnter(evt: JQuery.MouseEnterEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const relatedView = this.graph.renderer.findViewByElem(
      e.relatedTarget as Element,
    )
    if (view) {
      if (relatedView === view) {
        // mouse moved from tool to view
        return
      }
      view.onMouseEnter(e)
    } else {
      if (relatedView) {
        return
      }
      this.graph.trigger('graph:mouseenter', { e })
    }
  }

  protected onMouseLeave(evt: JQuery.MouseLeaveEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const relatedView = this.graph.renderer.findViewByElem(
      e.relatedTarget as Element,
    )

    if (view) {
      if (relatedView === view) {
        // mouse moved from view to tool
        return
      }
      view.onMouseLeave(e)
    } else {
      if (relatedView) {
        return
      }
      this.graph.trigger('graph:mouseleave', { e })
    }
  }

  protected onMouseWheel(evt: JQuery.TriggeredEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)
    if (this.guard(e, view)) {
      return
    }

    const originalEvent = e.originalEvent as WheelEvent
    const localPoint = this.graph.snapToGrid(
      originalEvent.clientX,
      originalEvent.clientY,
    )
    const delta = Math.max(
      -1,
      Math.min(1, (originalEvent as any).wheelDelta || -originalEvent.detail),
    )

    if (view) {
      view.onMouseWheel(e, localPoint.x, localPoint.y, delta)
    } else {
      this.graph.trigger('blank:mousewheel', {
        e,
        delta,
        x: localPoint.x,
        y: localPoint.y,
      })
    }
  }

  protected onCustomEvent(evt: JQuery.MouseDownEvent) {
    const elem = evt.currentTarget
    const event = elem.getAttribute('event') || elem.getAttribute('data-event')
    if (event) {
      const view = this.findView(elem)
      if (view) {
        const e = this.normalizeEvent(evt)
        if (this.guard(e, view)) {
          return
        }

        const localPoint = this.graph.snapToGrid(
          e.clientX as number,
          e.clientY as number,
        )
        view.onCustomEvent(e, event, localPoint.x, localPoint.y)
      }
    }
  }

  protected handleMagnetEvent<T extends JQuery.TriggeredEvent>(
    evt: T,
    handler: (
      this: Graph,
      view: CellView,
      e: T,
      magnet: Element,
      x: number,
      y: number,
    ) => void,
  ) {
    const magnetElem = evt.currentTarget
    const magnetValue = magnetElem.getAttribute('magnet') as string
    if (magnetValue && magnetValue.toLowerCase() !== 'false') {
      const view = this.findView(magnetElem)
      if (view) {
        const e = this.normalizeEvent(evt)
        if (this.guard(e, view)) {
          return
        }
        const localPoint = this.graph.snapToGrid(
          e.clientX as number,
          e.clientY as number,
        )
        FunctionExt.call(
          handler,
          this.graph,
          view,
          e,
          magnetElem,
          localPoint.x,
          localPoint.y,
        )
      }
    }
  }

  protected onMagnetMouseDown(e: JQuery.MouseDownEvent) {
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetMouseDown(e, magnet, x, y)
    })
  }

  protected onMagnetDblClick(e: JQuery.DoubleClickEvent) {
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetDblClick(e, magnet, x, y)
    })
  }

  protected onMagnetContextMenu(evt: JQuery.ContextMenuEvent) {
    const e = this.normalizeEvent(evt)
    const view = this.findView(e.target)

    if (this.isPreventDefaultContextMenu(e, view)) {
      e.preventDefault()
    }
    this.handleMagnetEvent(e, (view, e, magnet, x, y) => {
      view.onMagnetContextMenu(e, magnet, x, y)
    })
  }

  protected onLabelMouseDown(evt: JQuery.MouseDownEvent) {
    const labelNode = evt.currentTarget
    const view = this.findView(labelNode)
    if (view) {
      const e = this.normalizeEvent(evt)
      if (this.guard(e, view)) {
        return
      }

      const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)
      view.onLabelMouseDown(e, localPoint.x, localPoint.y)
    }
  }

  protected onImageDragStart() {
    // This is the only way to prevent image dragging in Firefox that works.
    // Setting -moz-user-select: none, draggable="false" attribute or
    // user-drag: none didn't help.
    return false
  }

  @View.dispose()
  dispose() {
    this.undelegateEvents()
    this.undelegateDocumentEvents()
    this.restore()
    this.restore = () => {}
  }
}

export namespace GraphView {
  export type SortType = 'none' | 'approx' | 'exact'
}

export namespace GraphView {
  const prefixCls = `${Config.prefixCls}-graph`

  export const markup: Markup.JSONMarkup[] = [
    {
      ns: Dom.ns.xhtml,
      tagName: 'div',
      selector: 'background',
      className: `${prefixCls}-background`,
    },
    {
      ns: Dom.ns.xhtml,
      tagName: 'div',
      selector: 'grid',
      className: `${prefixCls}-grid`,
    },
    {
      ns: Dom.ns.svg,
      tagName: 'svg',
      selector: 'svg',
      className: `${prefixCls}-svg`,
      attrs: {
        width: '100%',
        height: '100%',
        'xmlns:xlink': Dom.ns.xlink,
      },
      children: [
        {
          tagName: 'defs',
          selector: 'defs',
        },
        {
          tagName: 'g',
          selector: 'viewport',
          className: `${prefixCls}-svg-viewport`,
          children: [
            {
              tagName: 'g',
              selector: 'primer',
              className: `${prefixCls}-svg-primer`,
            },
            {
              tagName: 'g',
              selector: 'stage',
              className: `${prefixCls}-svg-stage`,
            },
            {
              tagName: 'g',
              selector: 'decorator',
              className: `${prefixCls}-svg-decorator`,
            },
            {
              tagName: 'g',
              selector: 'overlay',
              className: `${prefixCls}-svg-overlay`,
            },
          ],
        },
      ],
    },
  ]

  export function snapshoot(elem: Element) {
    const cloned = elem.cloneNode() as Element
    elem.childNodes.forEach((child) => cloned.appendChild(child))

    return () => {
      // remove all children
      Dom.empty(elem)

      // remove all attributes
      while (elem.attributes.length > 0) {
        elem.removeAttribute(elem.attributes[0].name)
      }

      // restore attributes
      for (let i = 0, l = cloned.attributes.length; i < l; i += 1) {
        const attr = cloned.attributes[i]
        elem.setAttribute(attr.name, attr.value)
      }

      // restore children
      cloned.childNodes.forEach((child) => elem.appendChild(child))
    }
  }
}

export namespace GraphView {
  const prefixCls = Config.prefixCls

  export const events = {
    dblclick: 'onDblClick',
    contextmenu: 'onContextMenu',
    touchstart: 'onMouseDown',
    mousedown: 'onMouseDown',
    mouseover: 'onMouseOver',
    mouseout: 'onMouseOut',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
    mousewheel: 'onMouseWheel',
    DOMMouseScroll: 'onMouseWheel',
    [`mouseenter  .${prefixCls}-cell`]: 'onMouseEnter',
    [`mouseleave  .${prefixCls}-cell`]: 'onMouseLeave',
    [`mouseenter  .${prefixCls}-cell-tools`]: 'onMouseEnter',
    [`mouseleave  .${prefixCls}-cell-tools`]: 'onMouseLeave',
    [`mousedown   .${prefixCls}-cell [event]`]: 'onCustomEvent',
    [`touchstart  .${prefixCls}-cell [event]`]: 'onCustomEvent',
    [`mousedown   .${prefixCls}-cell [data-event]`]: 'onCustomEvent',
    [`touchstart  .${prefixCls}-cell [data-event]`]: 'onCustomEvent',
    [`dblclick    .${prefixCls}-cell [magnet]`]: 'onMagnetDblClick',
    [`contextmenu .${prefixCls}-cell [magnet]`]: 'onMagnetContextMenu',
    [`mousedown   .${prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`touchstart  .${prefixCls}-cell [magnet]`]: 'onMagnetMouseDown',
    [`dblclick    .${prefixCls}-cell [data-magnet]`]: 'onMagnetDblClick',
    [`contextmenu .${prefixCls}-cell [data-magnet]`]: 'onMagnetContextMenu',
    [`mousedown   .${prefixCls}-cell [data-magnet]`]: 'onMagnetMouseDown',
    [`touchstart  .${prefixCls}-cell [data-magnet]`]: 'onMagnetMouseDown',
    [`dragstart   .${prefixCls}-cell image`]: 'onImageDragStart',
    [`mousedown   .${prefixCls}-edge .${prefixCls}-edge-label`]:
      'onLabelMouseDown',
    [`touchstart  .${prefixCls}-edge .${prefixCls}-edge-label`]:
      'onLabelMouseDown',
  }

  export const documentEvents = {
    mousemove: 'onMouseMove',
    touchmove: 'onMouseMove',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
    touchcancel: 'onMouseUp',
  }
}

namespace EventData {
  export interface Moving {
    mouseMovedCount?: number
    startPosition?: { x: number; y: number }
    currentView?: CellView | null
  }
}
