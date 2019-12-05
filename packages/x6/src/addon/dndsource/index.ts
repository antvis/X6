import * as util from '../../util'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { Guide } from '../../handler/guide/guide'
import { createGuide } from '../../handler/guide/option'
import { CellHighlight } from '../../handler'
import { Point, Rectangle } from '../../struct'
import { DomEvent, detector, MouseEventEx } from '../../common'

export class Dnd {
  currentGraph: Graph | null = null
  currentPoint: Point | null
  currentDropTarget: Cell | null = null
  highlightDropTargets: boolean = true
  disabled: boolean = false

  private dragElement: HTMLElement | null
  private previewElement: HTMLElement | null

  private rateX: number = 0
  private rateY: number = 0

  private currentHighlight: CellHighlight | null
  private currentGuide: Guide | null
  private eventSource: HTMLElement | null
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null
  private mouseUpHandler: ((e: MouseEvent) => void) | null = null
  private eventConsumer = (e: MouseEventEx) => e.consume()

  constructor(public element: HTMLElement, public options: Dnd.Options) {
    DomEvent.addMouseListeners(this.element, e =>
      this.mouseDown(e as MouseEvent),
    )

    // Prevents native drag and drop.
    DomEvent.addListener(this.element, 'dragstart', e => DomEvent.consume(e))
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }

  isActive() {
    return this.mouseMoveHandler != null
  }

  reset() {
    if (this.currentGraph != null) {
      this.dragExit(this.currentGraph)
      this.currentGraph = null
    }

    this.removeDragElement()
    this.removeListeners()
    this.stopDrag()
  }

  protected getTargetCell(graph: Graph, x: number, y: number, e: MouseEvent) {
    return graph.getCellAt(x, y)
  }

  protected createDragElement(e: MouseEvent): HTMLElement {
    return (
      (this.options.createDragElement &&
        this.options.createDragElement.call(this, e)) ||
      document.createElement('div')
    )
  }

  protected createPreviewElement(graph: Graph): HTMLElement {
    return (
      (this.options.createPreviewElement &&
        this.options.createPreviewElement.call(this, graph)) ||
      document.createElement('div')
    )
  }

  protected removeDragElement() {
    util.removeElement(this.dragElement)
    this.dragElement = null
  }

  protected removePreviewElement() {
    util.removeElement(this.previewElement)
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

  /**
   * Checks if event is inside the bounds of the graph container
   */
  protected isEventInGraph(graph: Graph, e: MouseEvent) {
    const x = DomEvent.getClientX(e)
    const y = DomEvent.getClientY(e)
    const offset = util.getOffset(graph.container)
    const origin = util.getScrollOrigin(null)
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

  protected addListeners(e: MouseEvent) {
    this.mouseMoveHandler = (e: MouseEvent) => this.mouseMove(e)
    this.mouseUpHandler = (e: MouseEvent) => this.mouseUp(e)
    DomEvent.addMouseListeners(
      document,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler,
    )

    if (detector.SUPPORT_TOUCH && !DomEvent.isMouseEvent(e)) {
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

  protected mouseDown(e: MouseEvent) {
    if (
      !this.disabled &&
      !DomEvent.isConsumed(e) &&
      this.mouseMoveHandler == null
    ) {
      this.startDrag(e)
      this.addListeners(e)
    }
  }

  protected mouseMove(e: MouseEvent) {
    let graph = this.options.getGraph.call(this, e)
    if (graph != null && !this.isEventInGraph(graph, e)) {
      graph = null
    }

    if (graph !== this.currentGraph) {
      if (this.currentGraph != null) {
        this.dragExit(this.currentGraph)
      }

      this.currentGraph = graph

      if (this.currentGraph != null) {
        this.dragEnter(this.currentGraph, e)
      }
    }

    if (this.currentGraph != null) {
      this.dragOver(this.currentGraph, e)
    }

    const dragElement = this.dragElement
    const previewElement = this.previewElement

    if (dragElement != null) {
      if (
        previewElement == null ||
        previewElement.style.visibility !== 'visible'
      ) {
        if (dragElement.parentNode == null) {
          document.body.appendChild(dragElement)
        }

        dragElement.style.visibility = 'visible'

        let x = DomEvent.getClientX(e)
        let y = DomEvent.getClientY(e)
        const w = dragElement.offsetWidth || dragElement.clientWidth
        const h = dragElement.offsetHeight || dragElement.clientHeight

        x -= this.rateX * w
        y -= this.rateY * h

        const offset = util.getDocumentScrollOrigin(document)
        dragElement.style.left = util.toPx(x + offset.x)
        dragElement.style.top = util.toPx(y + offset.y)
      } else {
        dragElement.style.visibility = 'hidden'
      }
    }

    DomEvent.consume(e)
  }

  protected mouseUp(e: MouseEvent) {
    if (this.currentGraph != null) {
      if (
        this.currentPoint != null &&
        (this.previewElement == null ||
          this.previewElement.style.visibility !== 'hidden')
      ) {
        const s = this.currentGraph.view.scale
        const t = this.currentGraph.view.translate
        const x = this.currentPoint.x / s - t.x
        const y = this.currentPoint.y / s - t.y

        this.drop(this.currentGraph, e, this.currentDropTarget, x, y)
      }

      this.dragExit(this.currentGraph)
      this.currentGraph = null
    }

    this.stopDrag()
    this.removeListeners()

    DomEvent.consume(e)
  }

  protected startDrag(e: MouseEvent) {
    const x = DomEvent.getClientX(e)
    const y = DomEvent.getClientY(e)
    const w = this.element.offsetWidth || this.element.clientWidth
    const h = this.element.offsetHeight || this.element.clientHeight
    const offset = util.getOffset(this.element)
    this.rateX = (x - offset.x) / w
    this.rateY = (y - offset.y) / h

    this.dragElement = this.createDragElement(e)
    this.dragElement.style.position = 'absolute'
    this.dragElement.style.pointerEvents = 'none'
  }

  protected stopDrag() {
    this.removeDragElement()
  }

  protected dragEnter(graph: Graph, e: MouseEvent) {
    graph.eventloop.isMouseDown = true
    graph.eventloop.isMouseTrigger = DomEvent.isMouseEvent(e)

    this.previewElement = this.createPreviewElement(graph)

    if (this.previewElement != null) {
      this.previewElement.style.pointerEvents = 'none'
      if (graph.guideHandler.isGuideEnabledForEvent(e)) {
        this.currentGuide = createGuide(
          graph,
          graph.guideHandler.getStatesForGuide(),
        )
      }
    }

    if (this.highlightDropTargets && graph.isDropEnabled()) {
      this.currentHighlight = new CellHighlight(graph)
    }

    // Consumes all events in the current graph before they are fired
    graph.on(DomEvent.FIRE_MOUSE_EVENT, this.eventConsumer)
  }

  protected dragExit(graph: Graph) {
    this.currentPoint = null
    this.currentDropTarget = null

    graph.eventloop.isMouseDown = false
    graph.off(DomEvent.FIRE_MOUSE_EVENT, this.eventConsumer)

    this.removePreviewElement()

    if (this.currentGuide != null) {
      this.currentGuide.dispose()
      this.currentGuide = null
    }

    if (this.currentHighlight != null) {
      this.currentHighlight.dispose()
      this.currentHighlight = null
    }
  }

  protected dragOver(graph: Graph, e: MouseEvent) {
    const offset = util.getOffset(graph.container)
    const origin = util.getScrollOrigin(graph.container)
    let x = DomEvent.getClientX(e) - offset.x + origin.x - graph.panDx
    let y = DomEvent.getClientY(e) - offset.y + origin.y - graph.panDy

    if (graph.autoScroll) {
      graph.scrollPointToVisible(x, y, graph.autoExtend)
    }

    // Highlights the drop target under the mouse
    if (this.currentHighlight != null) {
      this.currentDropTarget = this.getTargetCell(graph, x, y, e)
      const state = graph.view.getState(this.currentDropTarget)
      this.currentHighlight.highlight(state)
    }

    // Updates the location of the preview
    if (this.previewElement != null) {
      if (this.previewElement.parentNode == null) {
        graph.container.appendChild(this.previewElement)
        this.previewElement.style.zIndex = '9999'
        this.previewElement.style.position = 'absolute'
      }

      const gridEnabled = graph.isGridEnabled()
      let hideGuide = true

      // Grid and guides
      if (this.currentGuide != null) {
        const w = this.previewElement.offsetWidth
        const h = this.previewElement.offsetHeight
        const bounds = new Rectangle(0, 0, w, h)
        let delta = new Point(x, y)
        delta = this.currentGuide.move(bounds, delta, gridEnabled)
        hideGuide = false
        x = delta.x
        y = delta.y
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

      this.previewElement.style.left = util.toPx(Math.round(x))
      this.previewElement.style.top = util.toPx(Math.round(y))
      this.previewElement.style.visibility = 'visible'
    }

    this.currentPoint = new Point(x, y)
  }

  protected drop(
    graph: Graph,
    e: MouseEvent,
    target: Cell | null,
    x: number,
    y: number,
  ) {
    if (this.options.onDrop != null) {
      this.options.onDrop.call(this, { graph, target, e, x, y })
    }
  }
}

export namespace Dnd {
  export interface Options {
    getGraph: (this: Dnd, e: MouseEvent) => Graph | null
    createDragElement?: (this: Dnd, e: MouseEvent) => HTMLElement
    createPreviewElement?: (this: Dnd, graph: Graph) => HTMLElement
    onStartDrag?: () => void
    onDrop?: () => void
    onStopDrag?: () => void
    onDragEnter?: () => void
    onDragOver?: () => void
    onDragExit?: () => void
  }
}
