import { Assign } from 'utility-types'
import { Point, Rectangle } from '../../geometry'
import { Platform, ObjectExt } from '../../util'
import { DomUtil, DomEvent } from '../../dom'
import { Disablable } from '../../entity'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Guide } from '../../handler/guide/guide'
import { createGuide } from '../../handler/guide/option'
import { CellHighlight, MouseEventEx } from '../../handler'

export class Dnd<T> extends Disablable<Dnd.EventArgMap<T>> {
  currentGraph: Graph | null = null
  currentPoint: Point | null
  currentDropTarget: Cell | null = null
  dragElement: HTMLElement | null
  previewElement: HTMLElement | null
  data?: T

  private rateX: number = 0
  private rateY: number = 0

  private eventSource: HTMLElement | null
  private currentGuide: Guide | null
  private currentHighlight: CellHighlight | null
  private mouseMoveHandler: ((e: MouseEvent) => void) | null
  private mouseUpHandler: ((e: MouseEvent) => void) | null

  private eventConsumer = (args: any) => {
    const eventName = args.eventName as string
    if (eventName !== 'mouseDown') {
      const e = args.e as MouseEventEx
      e.consume()
    }
  }

  constructor(public element: HTMLElement, public options: Dnd.Options<T>) {
    super()

    this.data = this.options.data
    DomEvent.addMouseListeners(this.element, e =>
      this.onMouseDown(e as MouseEvent),
    )

    // Prevent native drag and drop
    DomEvent.addListener(this.element, 'dragstart', e => DomEvent.consume(e))
  }

  isActive() {
    return this.mouseMoveHandler != null
  }

  reset() {
    if (this.currentGraph != null) {
      this.onDragLeave(this.currentGraph, null)
      this.currentGraph = null
    }

    this.removeDragElement()
    this.removeListeners()
    this.stopDrag(null)
  }

  @Disablable.dispose()
  dispose() {
    this.reset()
  }

  protected getTargetCell(
    graph: Graph,
    graphX: number,
    graphY: number,
    e: MouseEvent,
  ): Cell | null {
    if (this.options.getTargetCell != null) {
      return this.options.getTargetCell.call(this, {
        graph,
        graphX,
        graphY,
        ...this.getCommonEventData(e),
      })
    }
    return graph.getCellAt(graphX, graphY)
  }

  protected createDragElement(e: MouseEvent): HTMLElement {
    let ret
    if (this.options.createDragElement) {
      ret = this.options.createDragElement.call(this, {
        e,
        data: this.data,
        element: this.element,
      })
    }

    if (ret == null) {
      ret = this.element.cloneNode(true)
    }

    return ret
  }

  protected createPreviewElement(graph: Graph): HTMLElement {
    return this.options.createPreviewElement.call(this, {
      graph,
      data: this.data,
      element: this.element,
      dragElement: this.dragElement!,
    })
  }

  protected removeDragElement() {
    DomUtil.remove(this.dragElement)
    this.dragElement = null
  }

  protected removePreviewElement() {
    DomUtil.remove(this.previewElement)
    this.previewElement = null
  }

  protected getEventSource(e: MouseEvent) {
    if (DomEvent.isTouchEvent(e) || DomEvent.isPenEvent(e)) {
      const clientX = DomEvent.getClientX(e)
      const clientY = DomEvent.getClientX(e)
      return document.elementFromPoint(clientX, clientY)
    }

    return DomEvent.getSource(e)
  }

  protected isEventInGraph(graph: Graph, e: MouseEvent) {
    const x = DomEvent.getClientX(e)
    const y = DomEvent.getClientY(e)
    const offset = DomUtil.getOffset(graph.container)
    const origin = DomUtil.getScrollOrigin(null)

    let elem = this.getEventSource(e)
    while (elem != null && elem !== graph.container) {
      elem = elem.parentNode as Element
    }

    return (
      elem != null &&
      x >= offset.x - origin.x &&
      y >= offset.y - origin.y &&
      x <= offset.x - origin.x + graph.container.offsetWidth &&
      y <= offset.y - origin.y + graph.container.offsetHeight
    )
  }

  protected getCommonEventData(e: MouseEvent): Dnd.CommonData<T> {
    return {
      e,
      data: this.data,
      element: this.element,
      dragElement: this.dragElement!,
    }
  }

  protected addListeners(e: MouseEvent) {
    this.mouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e)
    this.mouseUpHandler = (e: MouseEvent) => this.onMouseUp(e)
    DomEvent.addMouseListeners(
      document,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler,
    )

    if (Platform.SUPPORT_TOUCH && !DomEvent.isMouseEvent(e)) {
      this.eventSource = DomEvent.getSource(e) as HTMLElement
      DomEvent.addMouseListeners(
        this.eventSource,
        null,
        this.mouseMoveHandler,
        this.mouseUpHandler,
      )
    }
  }

  protected removeListeners() {
    DomEvent.removeMouseListeners(
      document,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler,
    )

    if (this.eventSource != null) {
      DomEvent.removeMouseListeners(
        this.eventSource,
        null,
        this.mouseMoveHandler,
        this.mouseUpHandler,
      )
      this.eventSource = null
    }

    this.mouseMoveHandler = null
    this.mouseUpHandler = null
  }

  protected onMouseDown(e: MouseEvent) {
    if (
      !DomEvent.isConsumed(e) &&
      this.isEnabled() &&
      this.mouseMoveHandler == null
    ) {
      this.startDrag(e)
      this.addListeners(e)

      this.trigger('dragStarted', {
        ...this.getCommonEventData(e),
      })
    }
  }

  protected onMouseMove(e: MouseEvent) {
    let graph = this.options.getGraph.call(this, e)
    if (graph != null && !this.isEventInGraph(graph, e)) {
      graph = null
    }

    if (graph !== this.currentGraph) {
      if (this.currentGraph != null) {
        this.onDragLeave(this.currentGraph, e)
      }

      this.currentGraph = graph

      if (this.currentGraph != null) {
        this.onDragEnter(this.currentGraph, e)
      }
    }

    if (this.currentGraph != null) {
      this.onDragOver(this.currentGraph, e)
    }

    const dragElem = this.dragElement
    const previewElem = this.previewElement

    if (dragElem != null) {
      if (previewElem == null || previewElem.style.display === 'none') {
        if (dragElem.parentNode == null) {
          document.body.appendChild(dragElem)
        }

        dragElem.style.display = ''

        let x = DomEvent.getClientX(e)
        let y = DomEvent.getClientY(e)
        const w = dragElem.offsetWidth
        const h = dragElem.offsetHeight

        x -= this.rateX * w
        y -= this.rateY * h

        const offset = DomUtil.getDocumentScrollOrigin(document)
        dragElem.style.left = DomUtil.toPx(x + offset.x)
        dragElem.style.top = DomUtil.toPx(y + offset.y)
      } else {
        dragElem.style.display = 'none'
      }
    }

    DomEvent.consume(e)
  }

  protected onMouseUp(e: MouseEvent) {
    if (this.currentGraph != null) {
      if (
        this.currentPoint != null &&
        (this.previewElement == null ||
          this.previewElement.style.display !== 'none')
      ) {
        const s = this.currentGraph.view.scale
        const t = this.currentGraph.view.translate
        const x = this.currentPoint.x / s - t.x
        const y = this.currentPoint.y / s - t.y

        this.drop(e, this.currentGraph, this.currentDropTarget, x, y)
      }

      this.onDragLeave(this.currentGraph, e)
      this.currentGraph = null
    }

    this.stopDrag(e)
    this.removeListeners()

    DomEvent.consume(e)
  }

  protected startDrag(e: MouseEvent) {
    const x = DomEvent.getClientX(e)
    const y = DomEvent.getClientY(e)
    const w = this.element.offsetWidth
    const h = this.element.offsetHeight
    const offset = DomUtil.getOffset(this.element)
    this.rateX = (x - offset.x) / w
    this.rateY = (y - offset.y) / h

    this.dragElement = this.createDragElement(e)
    this.dragElement.style.position = 'absolute'
    this.dragElement.style.pointerEvents = 'none'
    this.dragElement.style.zIndex = `${ObjectExt.ensure(
      this.options.zIndex,
      9999,
    )}`

    this.trigger('dragPrepare', {
      ...this.getCommonEventData(e),
    })
  }

  protected stopDrag(e: MouseEvent | null) {
    this.removeDragElement()
    this.trigger('dragStopped', {
      graph: this.currentGraph,
      previewElement: this.previewElement,
      currentPoint: this.currentPoint,
      ...this.getCommonEventData(e!),
    })
  }

  protected onDragEnter(graph: Graph, e: MouseEvent) {
    graph.eventloopManager.isMouseDown = true
    graph.eventloopManager.isMouseTrigger = DomEvent.isMouseEvent(e)

    this.previewElement = this.createPreviewElement(graph)
    if (this.previewElement != null) {
      this.previewElement.style.pointerEvents = 'none'
      if (graph.guideHandler.isEnabled()) {
        this.currentGuide = createGuide(
          graph,
          graph.guideHandler.getStatesForGuide(),
        )
      }
    }

    if (graph.isDropEnabled()) {
      this.currentHighlight = new CellHighlight(graph)
    }

    // Consume all events in the current graph before they are fired
    graph.on('mouseEvent', this.eventConsumer)

    this.trigger('dragEnter', {
      graph,
      previewElement: this.previewElement,
      ...this.getCommonEventData(e),
    })
  }

  protected onDragLeave(graph: Graph, e: MouseEvent | null) {
    this.currentPoint = null
    this.currentDropTarget = null

    graph.eventloopManager.isMouseDown = false
    graph.off('mouseEvent', this.eventConsumer)

    this.removePreviewElement()

    if (this.currentGuide != null) {
      this.currentGuide.dispose()
      this.currentGuide = null
    }

    if (this.currentHighlight != null) {
      this.currentHighlight.dispose()
      this.currentHighlight = null
    }

    this.trigger('dragLeave', {
      graph,
      previewElement: this.previewElement,
      ...this.getCommonEventData(e!),
    })
  }

  protected onDragOver(graph: Graph, e: MouseEvent) {
    const offset = DomUtil.getOffset(graph.container)
    const origin = DomUtil.getScrollOrigin(graph.container)
    let x = DomEvent.getClientX(e) - offset.x + origin.x - graph.panX
    let y = DomEvent.getClientY(e) - offset.y + origin.y - graph.panY

    if (this.options.autoScroll === true) {
      graph.scrollPointToVisible(x, y, graph.autoExtend)
    }

    // Highlight the drop target under the mouse
    if (this.currentHighlight != null) {
      this.currentDropTarget = this.getTargetCell(graph, x, y, e)
      const state = graph.view.getState(this.currentDropTarget)
      this.currentHighlight.highlight(state)
    }

    // Update the location of the preview
    if (this.previewElement != null) {
      if (this.previewElement.parentNode == null) {
        graph.container.appendChild(this.previewElement)
        this.previewElement.style.zIndex = '9999'
        this.previewElement.style.position = 'absolute'
      }

      let hideGuide = true
      const gridEnabled = graph.isGridEnabled()
      const w = this.previewElement.offsetWidth
      const h = this.previewElement.offsetHeight
      x -= w * this.rateX
      y -= h * this.rateY

      if (
        this.currentGuide != null &&
        graph.guideHandler.isGuideEnabledForEvent(e)
      ) {
        const bounds = new Rectangle(0, 0, w, h)
        let delta = new Point(x, y)
        delta = this.currentGuide.move(bounds, delta, gridEnabled)
        x = delta.x
        y = delta.y
        hideGuide = false
      } else if (gridEnabled) {
        const s = graph.view.scale
        const t = graph.view.translate
        const off = graph.gridSize / 2
        x = (graph.snap(x / s - t.x - off) + t.x) * s
        y = (graph.snap(y / s - t.y - off) + t.y) * s
      }

      if (this.currentGuide != null && hideGuide) {
        this.currentGuide.hide()
      }

      this.previewElement.style.display = ''
      this.previewElement.style.left = DomUtil.toPx(Math.round(x))
      this.previewElement.style.top = DomUtil.toPx(Math.round(y))
    }

    this.currentPoint = new Point(x, y)

    this.trigger('dragOver', {
      graph,
      currentPoint: this.currentPoint,
      previewElement: this.previewElement,
      ...this.getCommonEventData(e),
    })
  }

  protected drop(
    e: MouseEvent,
    graph: Graph,
    targetCell: Cell | null,
    x: number,
    y: number,
  ) {
    graph.container.focus()

    this.trigger('drop', {
      graph,
      targetCell,
      targetPosition: new Point(x, y),
      currentPoint: this.currentPoint!,
      previewElement: this.previewElement,
      ...this.getCommonEventData(e),
    })
  }
}

export namespace Dnd {
  export interface Options<T> {
    data?: T
    getGraph: (this: Dnd<T>, args: { e: MouseEvent }) => Graph | null
    getTargetCell?: (
      this: Dnd<T>,
      args: Assign<
        {
          graph: Graph
          graphX: number
          graphY: number
        },
        CommonData<T>
      >,
    ) => Cell | null
    createDragElement?: (
      this: Dnd<T>,
      args: CommonData<T>,
    ) => HTMLElement | null
    createPreviewElement: (
      this: Dnd<T>,
      args: {
        data?: T
        graph: Graph
        element: HTMLElement
        dragElement: HTMLElement
      },
    ) => HTMLElement
    zIndex?: number
    /**
     * Specifies if auto scroll current point to visible in the graph.
     */
    autoScroll?: boolean
  }

  export interface CommonData<T> {
    e: MouseEvent
    data?: T
    element: HTMLElement
    dragElement: HTMLElement
  }

  interface DragingData<T> extends CommonData<T> {
    graph: Graph
    previewElement: HTMLElement | null
  }

  export interface EventArgMap<T> {
    dragPrepare: Assign<{}, CommonData<T>>
    dragStarted: Assign<{}, CommonData<T>>
    dragEnter: Assign<{}, DragingData<T>>

    dragOver: Assign<
      {
        currentPoint: Point
      },
      DragingData<T>
    >

    dragLeave: Assign<
      DragingData<T>,
      {
        e: MouseEvent | null
      }
    >

    drop: Assign<
      {
        currentPoint: Point
        targetCell: Cell | null
        targetPosition: Point
      },
      DragingData<T>
    >

    dragStopped: Assign<
      DragingData<T>,
      {
        currentPoint: Point | null
        graph: Graph | null
        e: MouseEvent | null
      }
    >
  }
}
