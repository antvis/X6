import * as util from '../util'
import { Graph, State } from '../core'
import { BaseManager } from './manager-base'
import {
  TooltipHandler,
  ConnectionHandler,
  SelectionHandler,
  GraphHandler,
  PanningHandler,
  PopupMenuHandler,
  NodeHandler,
  EdgeHandler,
  EdgeElbowHandler,
  EdgeSegmentHandler,
  RubberbandHandler,
} from '../handler'
import { EdgeStyle } from '../stylesheet'

export class HandlerManager extends BaseManager {
  private inited: boolean = false

  constructor(graph: Graph) {
    super(graph)
    this.initHandlers()
  }

  private initHandlers() {
    if (this.inited) {
      return
    }

    this.inited = true

    this.graph.tooltipHandler = this.createTooltipHandler()
    this.graph.disableTooltips()

    this.graph.selectionHandler = this.createSelectionHandler()

    this.graph.connectionHandler = this.createConnectionHandler()
    this.graph.disableConnection()

    this.graph.graphHandler = this.createGraphHandler()

    this.graph.panningHandler = this.createPanningHandler()
    this.graph.panningHandler.disablePanning()

    this.graph.popupMenuHandler = this.createPopupMenuHandler()

    this.graph.rubberbandHandler = this.createRubberbandHandler()
    this.graph.disableRubberband()
  }

  protected createTooltipHandler() {
    return (
      util.call(this.options.createTooltipHandler, this, this) ||
      new TooltipHandler(this.graph)
    )
  }

  protected createConnectionHandler() {
    return (
      util.call(this.options.createConnectionHandler, this, this) ||
      new ConnectionHandler(this.graph)
    )
  }

  protected createSelectionHandler() {
    return (
      util.call(this.options.createSelectionHandler, this, this) ||
      new SelectionHandler(this.graph)
    )
  }

  protected createGraphHandler() {
    return (
      util.call(this.options.createGraphHandler, this, this) ||
      new GraphHandler(this.graph)
    )
  }

  protected createPanningHandler() {
    return (
      util.call(this.options.createPanningHandler, this, this) ||
      new PanningHandler(this.graph)
    )
  }

  protected createPopupMenuHandler() {
    return (
      util.call(this.options.createPopupMenuHandler, this, this) ||
      new PopupMenuHandler(this.graph)
    )
  }

  protected createRubberbandHandler() {
    return (
      util.call(this.options.createRubberbandHandler, this, this) ||
      new RubberbandHandler(this.graph)
    )
  }

  createCellHandler(state: State | null) {
    if (state != null) {
      if (this.model.isEdge(state.cell)) {
        const sourceState = state.getVisibleTerminalState(true)
        const targetState = state.getVisibleTerminalState(false)
        const geo = this.graph.getCellGeometry(state.cell)

        const edgeFn = this.view.getEdgeFunction(
          state, geo != null ? geo.points : null, sourceState!, targetState!,
        )
        return this.createEdgeHandler(state, edgeFn)
      }

      return this.createNodeHandler(state)
    }

    return null
  }

  protected createNodeHandler(state: State) {
    return (
      util.call(this.options.createNodeHandler, this, this, state) ||
      new NodeHandler(this.graph, state)
    )
  }

  protected createEdgeHandler(state: State, edgeFn: any) {
    let result = null

    if (
      edgeFn === EdgeStyle.loop ||
      edgeFn === EdgeStyle.elbowConnector ||
      edgeFn === EdgeStyle.sideToSide ||
      edgeFn === EdgeStyle.topToBottom
    ) {
      result = this.createElbowEdgeHandler(state)
    } else if (
      edgeFn === EdgeStyle.segmentConnector ||
      edgeFn === EdgeStyle.orthConnector
    ) {
      result = this.createEdgeSegmentHandler(state)
    } else {
      return (
        util.call(this.options.createEdgeHandler, this, this, state) ||
        new EdgeHandler(this.graph, state)
      )
    }

    return result
  }

  protected createEdgeSegmentHandler(state: State) {
    return (
      util.call(this.options.createEdgeSegmentHandler, this, this, state) ||
      new EdgeSegmentHandler(this.graph, state)
    )
  }

  protected createElbowEdgeHandler(state: State) {
    return (
      util.call(this.options.createElbowEdgeHandler, this, this, state) ||
      new EdgeElbowHandler(this.graph, state)
    )
  }
}
