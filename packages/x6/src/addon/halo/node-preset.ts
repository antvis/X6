import { Util } from '../../global'
import { StringExt, FunctionExt } from '../../util'
import { Point, Rectangle, Angle } from '../../geometry'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { Edge } from '../../model/edge'
import { CellView } from '../../view/cell'
import { NodeView } from '../../view/node'
import { EdgeView } from '../../view/edge'
import { Handle } from '../common'
import { notify } from '../transform/util'
import { Halo } from './index'

export class NodePreset {
  private edgeView: EdgeView | null
  private flip: number

  constructor(private halo: Halo) {}

  get options() {
    return this.halo.options
  }

  get graph() {
    return this.halo.graph
  }

  get model() {
    return this.halo.model
  }

  get view() {
    return this.halo.view
  }

  get cell() {
    return this.halo.cell
  }

  get node() {
    return this.cell as Node
  }

  getPresets(): Halo.Options {
    return {
      className: 'type-node',
      handles: [
        {
          name: 'remove',
          position: 'nw',
          events: {
            mousedown: this.removeCell.bind(this),
          },
          icon: null,
        },
        {
          name: 'resize',
          position: 'se',
          events: {
            mousedown: this.startResize.bind(this),
            mousemove: this.doResize.bind(this),
            mouseup: this.stopResize.bind(this),
          },
          icon: null,
        },
        {
          name: 'clone',
          position: 'n',
          events: {
            mousedown: this.startClone.bind(this),
            mousemove: this.doClone.bind(this),
            mouseup: this.stopClone.bind(this),
          },
          icon: null,
        },
        {
          name: 'link',
          position: 'e',
          events: {
            mousedown: this.startLink.bind(this),
            mousemove: this.doLink.bind(this),
            mouseup: this.stopLink.bind(this),
          },
          icon: null,
        },
        {
          name: 'fork',
          position: 'ne',
          events: {
            mousedown: this.startFork.bind(this),
            mousemove: this.doFork.bind(this),
            mouseup: this.stopFork.bind(this),
          },
          icon: null,
        },
        {
          name: 'unlink',
          position: 'w',
          events: {
            mousedown: this.unlink.bind(this),
          },
          icon: null,
        },
        {
          name: 'rotate',
          position: 'sw',
          events: {
            mousedown: this.startRotate.bind(this),
            mousemove: this.doRotate.bind(this),
            mouseup: this.stopRotate.bind(this),
          },
          icon: null,
        },
      ],

      bbox(view) {
        if (this.options.useCellGeometry) {
          const node = view.cell as Node
          return node.getBBox()
        }
        return view.getBBox()
      },

      content(view) {
        const template = StringExt.template(
          'x: <%= x %>, y: <%= y %>, width: <%= width %>, height: <%= height %>, angle: <%= angle %>',
        )
        const cell = view.cell as Node
        const bbox = cell.getBBox()
        return template({
          x: Math.floor(bbox.x),
          y: Math.floor(bbox.y),
          width: Math.floor(bbox.width),
          height: Math.floor(bbox.height),
          angle: Math.floor(cell.getAngle()),
        })
      },
      magnet(view) {
        return view.container
      },
      tinyThreshold: 40,
      smallThreshold: 80,
      loopEdgePreferredSide: 'top',
      loopEdgeWidth: 40,
      rotateGrid: 15,
      rotateEmbeds: false,
    }
  }

  removeCell() {
    this.model.removeConnectedEdges(this.cell)
    this.cell.remove()
  }

  // #region create edge

  startLink({ x, y }: Handle.EventArgs) {
    this.halo.startBatch()
    const graph = this.graph
    const edge = this.createEdgeConnectedToSource()
    edge.setTarget({ x, y })
    this.model.addEdge(edge, {
      validation: false,
      halo: this.halo.cid,
      async: false,
    })

    graph.view.undelegateEvents()
    this.edgeView = graph.renderer.findViewByCell(edge) as EdgeView
    this.edgeView.prepareArrowheadDragging('target', {
      x,
      y,
      fallbackAction: 'remove',
    })
  }

  createEdgeConnectedToSource() {
    const magnet = this.getMagnet(this.view, 'source')
    const terminal = this.getEdgeTerminal(this.view, magnet)
    const edge = this.graph.hook.getDefaultEdge(this.view, magnet)
    edge.setSource(terminal)
    return edge
  }

  getMagnet(view: CellView, terminal: Edge.TerminalType) {
    const magnet = this.options.magnet
    if (typeof magnet === 'function') {
      const val = FunctionExt.call(magnet, this.halo, view, terminal)
      if (val instanceof SVGElement) {
        return val
      }
    }
    throw new Error('`magnet()` has to return an SVGElement')
  }

  getEdgeTerminal(view: CellView, magnet: Element) {
    const terminal: Edge.TerminalCellData = {
      cell: view.cell.id,
    }
    if (magnet !== view.container) {
      const port = magnet.getAttribute('port')
      if (port) {
        terminal.port = port
      } else {
        terminal.selector = view.getSelector(magnet)
      }
    }
    return terminal
  }

  doLink({ e, x, y }: Handle.EventArgs) {
    if (this.edgeView) {
      this.edgeView.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopLink({ e, x, y }: Handle.EventArgs) {
    const edgeView = this.edgeView
    if (edgeView) {
      edgeView.onMouseUp(e as JQuery.MouseUpEvent, x, y)
      const edge = edgeView.cell
      if (edge.hasLoop()) {
        this.makeLoopEdge(edge)
      }
      this.halo.stopBatch()
      this.halo.trigger('action:edge:addde', { edge })
      this.edgeView = null
    }
    this.graph.view.delegateEvents()
  }

  makeLoopEdge(edge: Edge) {
    let vertex1: Point | null = null
    let vertex2: Point | null = null
    const loopEdgeWidth = this.options.loopEdgeWidth!
    const graphOptions = this.graph.options
    const graphRect = new Rectangle(
      0,
      0,
      graphOptions.width,
      graphOptions.height,
    )

    const bbox = this.graph.graphToLocal(this.view.getBBox())
    const found = [
      this.options.loopEdgePreferredSide,
      'top',
      'bottom',
      'left',
      'right',
    ].some((position) => {
      let point: Point | null = null
      let dx = 0
      let dy = 0
      switch (position) {
        case 'top':
          point = new Point(bbox.x + bbox.width / 2, bbox.y - loopEdgeWidth)
          dx = loopEdgeWidth / 2
          break
        case 'bottom':
          point = new Point(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height + loopEdgeWidth,
          )
          dx = loopEdgeWidth / 2
          break
        case 'left':
          point = new Point(bbox.x - loopEdgeWidth, bbox.y + bbox.height / 2)
          dy = loopEdgeWidth / 2
          break
        case 'right':
          point = new Point(
            bbox.x + bbox.width + loopEdgeWidth,
            bbox.y + bbox.height / 2,
          )
          dy = loopEdgeWidth / 2
          break
        default:
          break
      }

      if (point) {
        vertex1 = point.translate(-dx, -dy)
        vertex2 = point.translate(dx, dy)

        return (
          graphRect.containsPoint(vertex1) && graphRect.containsPoint(vertex2)
        )
      }
      return false
    })

    if (found && vertex1 && vertex2) {
      edge.setVertices([vertex1, vertex2])
    }
  }

  // #endregion

  // #region resize

  startResize({ e }: Handle.EventArgs) {
    this.halo.startBatch()
    this.flip = [1, 0, 0, 1, 1, 0, 0, 1][
      Math.floor(Angle.normalize(this.node.getAngle()) / 45)
    ]
    this.view.addClass('node-resizing')
    notify('node:resize', e as JQuery.MouseDownEvent, this.view as NodeView)
  }

  doResize({ e, dx, dy }: Handle.EventArgs) {
    const size = this.node.getSize()
    const width = Math.max(size.width + (this.flip ? dx : dy), 1)
    const height = Math.max(size.height + (this.flip ? dy : dx), 1)
    this.node.resize(width, height, {
      absolute: true,
    })
    notify('node:resizing', e as JQuery.MouseMoveEvent, this.view as NodeView)
  }

  stopResize({ e }: Handle.EventArgs) {
    this.view.removeClass('node-resizing')
    notify('node:resized', e as JQuery.MouseUpEvent, this.view as NodeView)
    this.halo.stopBatch()
  }

  // #endregion

  // #region clone

  startClone({ e, x, y }: Handle.EventArgs) {
    this.halo.startBatch()
    const options = this.options
    const cloned = options.clone!(this.cell, {
      clone: true,
    })

    if (!Cell.isCell(cloned)) {
      throw new Error("option 'clone()' has to return a cell")
    }

    this.centerNodeAtCursor(cloned, x, y)
    this.model.addCell(cloned, {
      halo: this.halo.cid,
      async: false,
    })
    const cloneView = this.graph.renderer.findViewByCell(cloned) as NodeView
    cloneView.onMouseDown(e as JQuery.MouseDownEvent, x, y)
    this.halo.setEventData(e, { cloneView })
  }

  centerNodeAtCursor(cell: Cell, x: number, y: number) {
    const center = cell.getBBox().getCenter()
    const dx = x - center.x
    const dy = y - center.y
    cell.translate(dx, dy)
  }

  doClone({ e, x, y }: Handle.EventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopClone({ e, x, y }: Handle.EventArgs) {
    const nodeView = this.halo.getEventData(e).cloneView as NodeView
    if (nodeView) {
      nodeView.onMouseUp(e as JQuery.MouseUpEvent, x, y)
    }
    this.halo.stopBatch()
  }

  // #endregion

  // #region fork

  startFork({ e, x, y }: Handle.EventArgs) {
    this.halo.startBatch()

    const cloned = this.options.clone!(this.cell, {
      fork: true,
    })

    if (!Cell.isCell(cloned)) {
      throw new Error("option 'clone()' has to return a cell")
    }

    this.centerNodeAtCursor(cloned, x, y)
    this.model.addCell(cloned, {
      halo: this.halo.cid,
      async: false,
    })

    const edge = this.createEdgeConnectedToSource()
    const cloneView = this.graph.renderer.findViewByCell(cloned) as CellView
    const magnet = this.getMagnet(cloneView, 'target')
    const terminal = this.getEdgeTerminal(cloneView, magnet)

    edge.setTarget(terminal)
    this.model.addEdge(edge, {
      halo: this.halo.cid,
      async: false,
    })

    cloneView.onMouseDown(e as JQuery.MouseDownEvent, x, y)
    this.halo.setEventData(e, { cloneView })
  }

  doFork({ e, x, y }: Handle.EventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopFork({ e, x, y }: Handle.EventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseUp(e as JQuery.MouseUpEvent, x, y)
    }
    this.halo.stopBatch()
  }

  // #endregion

  // #region rotate

  startRotate({ e, x, y }: Handle.EventArgs) {
    this.halo.startBatch()
    const center = this.node.getBBox().getCenter()
    const nodes = [this.node]
    if (this.options.rotateEmbeds) {
      this.node
        .getDescendants({
          deep: true,
        })
        .reduce((memo, cell) => {
          if (cell.isNode()) {
            memo.push(cell)
          }
          return memo
        }, nodes)
    }

    this.halo.setEventData(e, {
      center,
      nodes,
      rotateStartAngles: nodes.map((node) => node.getAngle()),
      clientStartAngle: new Point(x, y).theta(center),
    })

    nodes.forEach((node) => {
      const view = this.graph.findViewByCell(node) as NodeView
      if (view) {
        view.addClass('node-rotating')
        notify('node:rotate', e as JQuery.MouseDownEvent, view)
      }
    })
  }

  doRotate({ e, x, y }: Handle.EventArgs) {
    const data = this.halo.getEventData(e)
    const delta = data.clientStartAngle - new Point(x, y).theta(data.center)
    data.nodes.forEach((node: Node, index: number) => {
      const startAngle = data.rotateStartAngles[index]
      const targetAngle = Util.snapToGrid(
        startAngle + delta,
        this.options.rotateGrid!,
      )
      node.rotate(targetAngle, {
        absolute: true,
        center: data.center,
        halo: this.halo.cid,
      })
      notify(
        'node:rotating',
        e as JQuery.MouseMoveEvent,
        this.graph.findViewByCell(node) as NodeView,
      )
    })
  }

  stopRotate({ e }: Handle.EventArgs) {
    const data = this.halo.getEventData(e)
    data.nodes.forEach((node: Node) => {
      const view = this.graph.findViewByCell(node) as NodeView
      view.removeClass('node-rotating')
      notify('node:rotated', e as JQuery.MouseUpEvent, view)
    })
    this.halo.stopBatch()
  }

  // #endregion

  // #region unlink

  unlink() {
    this.halo.startBatch()
    this.model.removeConnectedEdges(this.cell)
    this.halo.stopBatch()
  }

  // #endregion
}
