import { Halo } from '../halo'
import { Cell } from '../../core/cell'
import { Node } from '../../core/node'
import { View } from '../../core/view'
import { CellView } from '../../core/cell-view'
import { Model } from '../../core/model'
import { Graph } from '../../core/graph'
import { Collection } from '../../core/collection'
import { StringExt, ObjectExt } from '../../../util'
import { Rectangle, Angle, snapToGrid } from '../../../geometry'
import { KeyValue } from '../../../types'

export class Selection extends View<Selection.EventArgs> {
  public readonly options: Selection.Options
  public readonly collection: Collection

  protected readonly documentEvents = {
    mousemove: 'adjustSelection',
    touchmove: 'adjustSelection',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
    touchcancel: 'onMouseUp',
  }

  protected $container: JQuery<HTMLElement>
  protected $selectionWrapper: JQuery<HTMLElement>
  protected handles: Selection.Handle[]
  protected boxCount: number
  protected boxesUpdated: boolean

  protected get graph() {
    return this.options.graph
  }

  constructor(options: Selection.Options) {
    super()
    this.options = ObjectExt.merge({}, Selection.defaultOptions, options)

    if (this.options.model) {
      this.options.collection = this.options.model.collection
    }

    if (this.options.collection) {
      this.collection = this.options.collection
    } else {
      this.collection = new Collection([], {
        comparator: Selection.depthComparator,
      })
      this.options.collection = this.collection
    }

    this.container = document.createElement('div')
    this.$container = this.$(this.container).appendTo(this.graph.container)
    this.$container.addClass(this.prefixClassName('widget-selection'))

    this.boxCount = 0
    this.$selectionWrapper = this.createSelectionWrapper()
    this.handles = []
    if (this.options.handles) {
      this.options.handles.forEach(handle => this.addHandle(handle))
    }
    this.startListening()
  }

  protected startListening() {
    const graph = this.graph
    const collection = this.collection

    this.delegateEvents({
      'mousedown .selection-box': 'onSelectionBoxMouseDown',
      'touchstart .selection-box': 'onSelectionBoxMouseDown',
      'mousedown .handle': 'onHandleMouseDown',
      'touchstart .handle': 'onHandleMouseDown',
    })

    graph.on('scale', this.onGraphTransformation, this)
    graph.on('translate', this.onGraphTransformation, this)

    // collection.on('reseted', this.cancelSelection, this)
    // collection.on('change', this.onGraphChange, this)
    collection.on('removed', this.onRemoveCellFromSelection, this)
    collection.on('reseted', this.onResetSelection, this)
    collection.on('added', this.onAddCellToSelection, this)
    collection.on('cell:change:*', this.onCellChanged, this)
  }

  protected stopListening() {}

  onGraphTransformation() {
    this.updateSelectionBoxes({ async: false })
  }

  onCellChanged() {
    this.updateSelectionBoxes()
  }

  cancelSelection() {
    this.collection.reset([], { ui: true })
  }

  startSelecting(evt: JQuery.MouseDownEvent) {
    // Flow: startSelecting => adjustSelection => stopSelecting

    evt = this.normalizeEvent(evt) // tslint:disable-line
    this.cancelSelection()
    let x
    let y
    const graphContainer = this.graph.container
    if (
      null != evt.offsetX &&
      null != evt.offsetY &&
      graphContainer.contains(evt.target)
    ) {
      x = evt.offsetX
      y = evt.offsetY
    } else {
      const offset = this.$(graphContainer).offset()!
      const scrollLeft = graphContainer.scrollLeft
      const scrollTop = graphContainer.scrollTop
      x = evt.clientX - offset.left + window.pageXOffset + scrollLeft
      y = evt.clientY - offset.top + window.pageYOffset + scrollTop
    }
    this.$container.css({
      width: 1,
      height: 1,
      left: x,
      top: y,
    })
    this.showLasso()
    this.setEventData<EventData.Selecting>(evt, {
      action: 'selecting',
      clientX: evt.clientX,
      clientY: evt.clientY,
      offsetX: x,
      offsetY: y,
    })
    this.delegateDocumentEvents(this.documentEvents, evt.data)
  }

  protected stopSelecting(evt: JQuery.MouseUpEvent) {
    const graph = this.graph
    const action = this.getEventData<EventData.Common>(evt).action
    switch (action) {
      case 'selecting': {
        let width = this.$container.width()!
        let height = this.$container.height()!
        const offset = this.$container.offset()!
        const origin = graph.pageToLocalPoint(offset.left, offset.top)
        const scale = graph.getScale()
        width = width / scale.sx
        height = height / scale.sy
        const rect = new Rectangle(origin.x, origin.y, width, height)
        let views = this.getNodesInArea(rect)
        const filter = this.options.filter
        if (Array.isArray(filter)) {
          views = views.filter(
            view =>
              !filter.includes(view.cell) && !filter.includes(view.cell.type),
          )
        } else {
          if (typeof filter === 'function') {
            views = views.filter(view => !filter(view.cell as Node))
          }
        }
        const cells = views.map(view => view.cell)
        this.collection.reset(cells, { ui: true })
        break
      }
      case 'translating': {
        this.graph.model.stopBatch('selection-translate')
        const client = graph.snapToGrid(evt.clientX, evt.clientY)
        this.notifyBoxEvent('selection-box:mouseup', evt, client.x, client.y)
        break
      }
      default: {
        if (!action) {
          this.cancelSelection()
        }
      }
    }
  }

  protected onSelectionBoxMouseDown(evt: JQuery.MouseDownEvent) {
    evt.stopPropagation()
    evt = this.normalizeEvent(evt) // tslint:disable-line

    if (this.options.movable) {
      this.startTranslating(evt)
    }

    const activeView = this.getCellViewFromElem(evt.target)!
    this.setEventData<EventData.SelectionBox>(evt, { activeView })
    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.notifyBoxEvent('selection-box:mousedown', evt, client.x, client.y)
    this.delegateDocumentEvents(this.documentEvents, evt.data)
  }

  protected startTranslating(evt: JQuery.MouseDownEvent) {
    this.graph.model.startBatch('selection-translate')
    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.setEventData<EventData.Translating>(evt, {
      action: 'translating',
      clientX: client.x,
      clientY: client.y,
    })
  }

  protected adjustSelection(evt: JQuery.MouseMoveEvent) {
    evt = this.normalizeEvent(evt) // tslint:disable-line
    const eventData = this.getEventData<EventData.Common>(evt)
    const action = eventData.action
    switch (action) {
      case 'selecting': {
        const data = eventData as EventData.Selecting
        const dx = evt.clientX - data.clientX
        const dy = evt.clientY - data.clientY
        const left = parseInt(this.$container.css('left'), 10)
        const top = parseInt(this.$container.css('top'), 10)
        this.$container.css({
          left: dx < 0 ? data.offsetX + dx : left,
          top: dy < 0 ? data.offsetY + dy : top,
          width: Math.abs(dx),
          height: Math.abs(dy),
        })
        break
      }

      case 'translating': {
        const data = eventData as EventData.Translating
        const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
        let dx = client.x - data.clientX
        let dy = client.y - data.clientY
        const restrictedArea = this.graph.getRestrictedArea()
        if (restrictedArea) {
          const cells = this.collection.toArray()
          const totalBBox = Cell.getCellsBBox(cells)!
          const minDx = restrictedArea.x - totalBBox.x
          const minDy = restrictedArea.y - totalBBox.y
          const maxDx =
            restrictedArea.x +
            restrictedArea.width -
            (totalBBox.x + totalBBox.width)
          const maxDy =
            restrictedArea.y +
            restrictedArea.height -
            (totalBBox.y + totalBBox.height)
          if (dx < minDx) {
            dx = minDx
          }
          if (dy < minDy) {
            dy = minDy
          }
          if (maxDx < dx) {
            dx = maxDx
          }
          if (maxDy < dy) {
            dy = maxDy
          }
        }
        if (dx || dy) {
          if ((this.translateSelectedNodes(dx, dy), this.boxesUpdated)) {
            if (this.collection.length > 1) {
              this.updateSelectionBoxes()
            }
          } else {
            const scale = this.graph.getScale()
            this.$container
              .children('.selection-box')
              .add(this.$selectionWrapper)
              .css({
                left: `+=${dx * scale.sx}`,
                top: `+=${dy * scale.sy}`,
              })
          }
          data.clientX = client.x
          data.clientY = client.y
        }

        this.notifyBoxEvent('selection-box:mousemove', evt, client.x, client.y)
        break
      }

      default: {
        if (action) {
          this.onMouseMove(evt)
        }
      }
    }
    this.boxesUpdated = false
  }

  protected translateSelectedNodes(dx: number, dy: number) {
    const map: { [id: string]: boolean } = {}
    this.collection.toArray().forEach(cell => {
      if (!map[cell.id]) {
        const options = {
          selection: this.cid,
        }
        cell.translate(dx, dy, options)
        cell.getDescendants({ deep: true }).forEach(child => {
          map[child.id] = true
        })
        this.graph.model.getConnectedEdges(cell).forEach(edge => {
          if (!map[edge.id]) {
            edge.translate(dx, dy, options)
            map[edge.id] = true
          }
        })
      }
    })
  }

  protected getNodesInArea(rect: Rectangle) {
    const graph = this.graph
    const options = {
      strict: this.options.strict,
    }
    return this.options.useModelGeometry
      ? (graph.model
          .getNodesInArea(rect, options)
          .map(node => graph.findViewByCell(node))
          .filter(view => view != null) as CellView[])
      : graph.findViewsInArea(rect, options)
  }

  // #region handle

  hasHandle(name: string) {
    return this.getHandleIdx(name) >= 0
  }

  getHandleIdx(name: string) {
    return this.handles.findIndex(item => item.name === name)
  }

  getHandle(name: string) {
    return this.handles.find(item => item.name === name)
  }

  addHandle(handle: Selection.Handle) {
    this.handles.push(handle)
    const $handle = this.$('<div/>')
      .addClass(`handle ${handle.name} ${handle.position}`)
      .attr('data-action', handle.name)

    if (handle.icon) {
      $handle.css('background-image', `url(${handle.icon})`)
    }

    if (handle.content) {
      $handle.html(handle.content)
    }

    Halo.applyAttrs($handle, handle.attrs)
    this.$selectionWrapper.append($handle)
    const events = handle.events
    if (events) {
      Object.keys(events).forEach(action => {
        const callback = events[action]
        const name = `action:${handle.name}:${action}`
        if (typeof callback === 'string') {
          this.on(name, (this as any)[callback], this)
        } else {
          this.on(name, callback)
        }
      })
    }

    return this
  }

  addHandles(handles: Selection.Handle[]) {
    handles.forEach(handle => this.addHandle(handle))
    return this
  }

  removeHandles() {
    while (this.handles.length) {
      this.removeHandle(this.handles[0].name)
    }
    return this
  }

  removeHandle(name: string) {
    const index = this.getHandleIdx(name)
    const handle = this.handles[index]
    if (handle) {
      if (handle.events) {
        Object.keys(handle.events).forEach(event => {
          this.off(`action:${name}:${event}`)
        })
      }
      this.getHandleElem(name).remove()
      this.handles.splice(index, 1)
    }
    return this
  }

  changeHandle(name: string, newHandle: Partial<Selection.Handle>) {
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

  protected getHandleElem(name: string) {
    return this.$container.find(`.handle.${name}`)
  }

  // #endregion

  protected notifyBoxEvent<
    K extends keyof Selection.BoxEventArgs,
    T extends JQuery.TriggeredEvent
  >(name: K, e: T, x: number, y: number) {
    const data = this.getEventData<EventData.SelectionBox>(e)
    const view = data.activeView
    this.trigger(name, { e, view, x, y })
  }

  protected destroySelectionBox(cell: Cell) {
    this.$container.find(`[data-cell="${cell.id}"]`).remove()
    if (this.$container.children('.selection-box').length === 0) {
      this.hide()
    }
    this.boxCount = Math.max(0, this.boxCount - 1)
  }

  protected destroyAllSelectionBoxes() {
    this.hide()
    this.$container.children('.selection-box').remove()
    this.boxCount = 0
  }

  hide() {
    this.$container.removeClass('lasso selected')
  }

  protected showSelected() {
    this.$container.addClass('selected')
  }

  protected showLasso() {
    this.$container.addClass('lasso')
  }

  protected createSelectionBox(cell: Cell) {
    const view = this.graph.findViewByCell(cell)
    if (view) {
      const bbox = view.getBBox({
        fromCell: this.options.useModelGeometry,
      })
      this.$('<div/>')
        .addClass('selection-box')
        .attr('data-cell', cell.id)
        .css({
          left: bbox.x,
          top: bbox.y,
          width: bbox.width,
          height: bbox.height,
        })
        .appendTo(this.container)
      this.showSelected()
      this.boxCount += 1
    }
  }

  protected createSelectionWrapper() {
    const $wrapper = this.$('<div/>').addClass('selection-wrapper')
    const $box = this.$('<div/>').addClass('box')
    $wrapper.append($box)
    $wrapper.attr('data-selection-length', this.collection.length)
    this.$container.prepend($wrapper)
    return $wrapper
  }

  protected updateSelectionWrapper() {
    const origin = { x: Infinity, y: Infinity }
    const corner = { x: 0, y: 0 }

    this.collection.toArray().forEach(cell => {
      const view = this.graph.findViewByCell(cell)
      if (view) {
        const bbox = view.getBBox({
          fromCell: this.options.useModelGeometry,
        })
        origin.x = Math.min(origin.x, bbox.x)
        origin.y = Math.min(origin.y, bbox.y)
        corner.x = Math.max(corner.x, bbox.x + bbox.width)
        corner.y = Math.max(corner.y, bbox.y + bbox.height)
      }
    })

    this.$selectionWrapper
      .css({
        left: origin.x,
        top: origin.y,
        width: corner.x - origin.x,
        height: corner.y - origin.y,
      })
      .attr('data-selection-length', this.collection.length)

    const boxContent = this.options.boxContent
    if (boxContent) {
      const $box = this.$container.find('.box')
      if (typeof boxContent === 'function') {
        const content = boxContent.call(this, $box[0])
        if (content) {
          $box.html(content)
        }
      } else {
        $box.html(boxContent)
      }
    }
  }

  protected updateSelectionBoxes(options: KeyValue = {}) {
    if (this.collection.length > 0) {
      this.boxesUpdated = true
      this.graph.requestViewUpdate(this as any, 1, 2, options)
    }
  }

  confirmUpdate() {
    if (this.boxCount) {
      this.hide()
      this.$container.children('.selection-box').each((_, elem) => {
        const cellId = this.$(elem)
          .remove()
          .attr('data-cell')
        const cell = this.collection.get(cellId)
        if (cell) {
          this.createSelectionBox(cell)
        }
      })

      this.updateSelectionWrapper()
    }
    return 0
  }

  protected getCellViewFromElem(elem: Element) {
    const id = elem.getAttribute('data-cell')
    if (id) {
      const cell = this.collection.get(id)
      if (cell) {
        return this.graph.findViewByCell(cell)
      }
    }
    return null
  }

  protected onHandleMouseDown(e: JQuery.MouseDownEvent) {
    const action = this.$(e.currentTarget).attr('data-action')
    if (action) {
      e.preventDefault()
      e.stopPropagation()
      e = this.normalizeEvent(e) // tslint:disable-line
      this.triggerAction(action, 'mousedown', e)
      this.setEventData(e, {
        action,
        clientX: e.clientX,
        clientY: e.clientY,
        startClientX: e.clientX,
        startClientY: e.clientY,
      })
      this.delegateDocumentEvents(this.documentEvents, e.data)
    }
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const data = this.getEventData(evt)
    const action = data.action
    if (action) {
      const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
      const origin = this.graph.snapToGrid(data.clientX, data.clientY)
      const dx = client.x - origin.x
      const dy = client.y - origin.y
      this.triggerAction(action, 'mousemove', evt, {
        dx,
        dy,
        offsetX: evt.clientX - data.startClientX,
        offsetY: evt.clientY - data.startClientY,
      })
      data.clientX = evt.clientX
      data.clientY = evt.clientY
    }
  }

  protected onMouseUp(evt: JQuery.MouseUpEvent) {
    const action = this.getEventData<EventData.Common>(evt).action
    if (action) {
      this.triggerAction(action, 'mouseup', evt)
      this.stopSelecting(evt)
      this.undelegateDocumentEvents()
    }
  }

  protected triggerAction(
    action: string,
    eventName: string,
    e: JQuery.TriggeredEvent,
    args?: any,
  ) {
    this.trigger(`action:${action}:${eventName}`, { e, ...args })
  }

  protected onRemoveCellFromSelection({
    cell,
  }: Collection.EventArgs['removed']) {
    this.destroySelectionBox(cell)
    this.updateSelectionWrapper()
  }

  protected onResetSelection({ current }: Collection.EventArgs['reseted']) {
    this.destroyAllSelectionBoxes()
    current.forEach(cell => this.createSelectionBox(cell))
    this.updateSelectionWrapper()
  }

  protected onAddCellToSelection({ cell }: Collection.EventArgs['added']) {
    this.createSelectionBox(cell)
    this.updateSelectionWrapper()
  }

  protected removeSelectedCells() {
    const cells = this.collection.toArray()
    this.cancelSelection()
    this.graph.model.removeCells(cells, {
      selection: this.cid,
    })
  }

  protected startRotating({ e }: Halo.HandleEventArgs) {
    const cells = this.collection.toArray()
    const center = Cell.getCellsBBox(cells)!.getCenter()
    const client = this.graph.snapToGrid(e.clientX!, e.clientY!)
    const initialAngles = cells.reduce<{ [id: string]: number }>(
      (memo, cell: Node) => {
        memo[cell.id] = Angle.normalize(cell.getRotation())
        return memo
      },
      {},
    )

    this.setEventData(e, {
      center,
      initialAngles,
      clientAngle: client.theta(center),
    })
  }

  protected doRotate({ e }: Halo.HandleEventArgs) {
    const data = this.getEventData(e)
    const grid = this.options.rotationGrid!
    const client = this.graph.snapToGrid(e.clientX!, e.clientY!)
    const delta = data.clientAngle - client.theta(data.center)
    if (Math.abs(delta) > 0.001) {
      this.collection.toArray().forEach((node: Node) => {
        const angle = snapToGrid(data.initialAngles[node.id] + delta, grid)
        node.rotate(angle, true, data.center, {
          selection: this.cid,
        })
      })
      this.updateSelectionBoxes()
    }
  }

  protected startResizing({ e }: Halo.HandleEventArgs) {
    const gridSize = this.graph.options.gridSize
    const cells = this.collection.toArray()
    const bbox = Cell.getCellsBBox(cells)!
    const bboxes = cells.map(cell => cell.getBBox())
    const maxWidth = bboxes.reduce((maxWidth, bbox) => {
      return bbox.width < maxWidth ? bbox.width : maxWidth
    }, Infinity)
    const maxHeight = bboxes.reduce((maxHeight, bbox) => {
      return bbox.height < maxHeight ? bbox.height : maxHeight
    }, Infinity)
    this.setEventData(e, {
      bbox,
      cells: this.graph.model.getSubGraph(cells),
      minWidth: (gridSize * bbox.width) / maxWidth,
      minHeight: (gridSize * bbox.height) / maxHeight,
    })
  }

  protected doResize({ e, dx, dy }: Halo.HandleEventArgs) {
    const data = this.eventData(e)
    const bbox = data.bbox
    const width = bbox.width
    const height = bbox.height
    const newWidth = Math.max(width + dx, data.minWidth)
    const newHeight = Math.max(height + dy, data.minHeight)
    if (
      0.001 < Math.abs(width - newWidth) ||
      0.001 < Math.abs(height - newHeight)
    ) {
      this.graph.model.resizeCells(newWidth, newHeight, data.cells, {
        selection: this.cid,
      })
      bbox.width = newWidth
      bbox.height = newHeight
      this.updateSelectionBoxes()
    }
  }
}

export namespace Selection {
  export interface Options {
    graph: Graph
    model?: Model
    collection?: Collection
    strict?: boolean
    movable?: boolean
    useModelGeometry?: boolean
    rotationGrid?: number
    handles?: Handle[]
    boxContent?:
      | false
      | string
      | ((this: Selection, boxDOMElement: HTMLElement) => string)
    filter?: (string | Cell)[] | filterFunction
  }

  export type filterFunction = (node: Node) => boolean

  export interface Handle {
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
    content?: string
    events?: { [event: string]: string }
    attrs?: { [selector: string]: JQuery.PlainObject }
  }

  export type OrthPosition = 'e' | 'w' | 's' | 'n'
  export type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw'
}

export namespace Selection {
  interface SelectionBoxEventArgs<T> {
    e: T
    view: CellView
    cell: Cell
    x: number
    y: number
  }

  export interface BoxEventArgs {
    'selection-box:mousedown': SelectionBoxEventArgs<JQuery.MouseDownEvent>
    'selection-box:mousemove': SelectionBoxEventArgs<JQuery.MouseMoveEvent>
    'selection-box:mouseup': SelectionBoxEventArgs<JQuery.MouseUpEvent>
  }

  export interface EventArgs extends BoxEventArgs {}
}
export namespace Selection {
  export const defaultOptions: Partial<Options> = {
    boxContent() {
      return StringExt.template(
        '<%= length %> node<%= length > 1 ? "s":"" %> selected.',
      )({
        length: this.collection.length,
      })
    },
    handles: [
      {
        name: 'remove',
        position: 'nw',
        events: {
          mousedown: 'removeSelectedCells',
        },
      },
      {
        name: 'rotate',
        position: 'sw',
        events: {
          mousedown: 'startRotating',
          mousemove: 'doRotate',
          mouseup: 'stopBatch',
        },
      },
      {
        name: 'resize',
        position: 'se',
        events: {
          mousedown: 'startResizing',
          mousemove: 'doResize',
          mouseup: 'stopBatch',
        },
      },
    ],
    strict: false,
    useModelGeometry: false,
    rotationGrid: 15,
    movable: true,
  }

  export function depthComparator(cell: Cell) {
    return cell.getAncestors().length
  }
}

namespace EventData {
  export interface Common {
    action: 'selecting' | 'translating'
  }

  export interface Selecting extends Common {
    action: 'selecting'
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
  }

  export interface Translating extends Common {
    action: 'translating'
    clientX: number
    clientY: number
  }

  export interface SelectionBox {
    activeView: CellView
  }
}
