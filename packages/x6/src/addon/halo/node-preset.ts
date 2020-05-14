import { Util } from '../../global'
import { StringExt } from '../../util'
import { Point, Rectangle, Angle } from '../../geometry'
import { CellView, NodeView, EdgeView } from '../../view'
import { Cell, Node, Edge } from '../../model'
import { Halo } from './index'

export function getNodePreset(halo: Halo) {}

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
            mousedown: this.startResizing.bind(this),
            mousemove: this.doResize.bind(this),
            mouseup: this.halo.stopBatch.bind(this.halo),
          },
          icon: null,
        },
        {
          name: 'clone',
          position: 'n',
          events: {
            mousedown: this.startCloning.bind(this),
            mousemove: this.doClone.bind(this),
            mouseup: this.stopCloning.bind(this),
          },
          icon: null,
        },
        {
          name: 'link',
          position: 'e',
          events: {
            mousedown: this.startLinking.bind(this),
            mousemove: this.doLink.bind(this),
            mouseup: this.stopLinking.bind(this),
          },
          icon: null,
        },
        {
          name: 'fork',
          position: 'ne',
          events: {
            mousedown: this.startForking.bind(this),
            mousemove: this.doFork.bind(this),
            mouseup: this.stopForking.bind(this),
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
            mousedown: this.startRotating.bind(this),
            mousemove: this.doRotate.bind(this),
            mouseup: this.halo.stopBatch.bind(this.halo),
          },
          icon: null,
        },
      ],

      bbox(view, halo) {
        if (halo.options.useModelGeometry) {
          const node = view.cell as Node
          return node.getBBox()
        }
        return view.getBBox()
      },

      boxContent(view) {
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
          angle: Math.floor(cell.getRotation()),
        })
      },
      magnet(view) {
        return view.container
      },
      tinyThreshold: 40,
      smallThreshold: 80,
      loopLinkPreferredSide: 'top',
      loopLinkWidth: 40,
      rotateAngleGrid: 15,
      rotateEmbeds: false,
      // linkAttributes: {},
      // smoothLinks: undefined,
    }
  }

  removeCell() {
    this.model.removeEdges(this.cell)
    this.cell.remove()
  }

  // #region create edge

  startLinking({ x, y }: Halo.HandleEventArgs) {
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
      const val = magnet.call(this.halo, view, terminal)
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

  doLink({ e, x, y }: Halo.HandleEventArgs) {
    if (this.edgeView) {
      this.edgeView.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopLinking({ e, x, y }: Halo.HandleEventArgs) {
    const edgeView = this.edgeView
    if (edgeView) {
      edgeView.onMouseUp(e as JQuery.MouseUpEvent, x, y)
      const edge = edgeView.cell
      if (edge.hasLoop()) {
        this.makeLoopLink(edge)
      }
      this.halo.stopBatch()
      this.halo.trigger('action:edge:addde', { edge })
      this.edgeView = null
    }
    this.graph.view.delegateEvents()
  }

  makeLoopLink(edge: Edge) {
    let vertex1: Point | null = null
    let vertex2: Point | null = null
    const loopLinkWidth = this.options.loopLinkWidth!
    const graphOptions = this.graph.options
    const graphRect = new Rectangle(
      0,
      0,
      graphOptions.width,
      graphOptions.height,
    )

    const bbox = this.graph.graphToLocalRect(this.view.getBBox())
    const found = [
      this.options.loopLinkPreferredSide,
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
          point = new Point(bbox.x + bbox.width / 2, bbox.y - loopLinkWidth)
          dx = loopLinkWidth / 2
          break
        case 'bottom':
          point = new Point(
            bbox.x + bbox.width / 2,
            bbox.y + bbox.height + loopLinkWidth,
          )
          dx = loopLinkWidth / 2
          break
        case 'left':
          point = new Point(bbox.x - loopLinkWidth, bbox.y + bbox.height / 2)
          dy = loopLinkWidth / 2
          break
        case 'right':
          point = new Point(
            bbox.x + bbox.width + loopLinkWidth,
            bbox.y + bbox.height / 2,
          )
          dy = loopLinkWidth / 2
      }

      if (point) {
        vertex1 = point.translate(-dx, -dy)
        vertex2 = point.translate(dx, dy)

        return (
          graphRect.containsPoint(vertex1) && graphRect.containsPoint(vertex2)
        )
      }
    })

    if (found && vertex1 && vertex2) {
      edge.setVertices([vertex1, vertex2])
    }
  }

  // #endregion

  // #region resize

  startResizing() {
    this.halo.startBatch()
    this.flip = [1, 0, 0, 1, 1, 0, 0, 1][
      Math.floor(Angle.normalize(this.node.getRotation()) / 45)
    ]
  }

  doResize({ dx, dy }: Halo.HandleEventArgs) {
    const size = this.node.getSize()
    const width = Math.max(size.width + (this.flip ? dx : dy), 1)
    const height = Math.max(size.height + (this.flip ? dy : dx), 1)
    this.node.resize(width, height, {
      absolute: true,
    })
  }

  // #endregion

  // #region clone

  startCloning({ e, x, y }: Halo.HandleEventArgs) {
    this.halo.startBatch()
    const options = this.options
    const cloned = options.clone!(this.cell, {
      clone: true,
    })

    if (!(cloned instanceof Cell)) {
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

  doClone({ e, x, y }: Halo.HandleEventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopCloning({ e, x, y }: Halo.HandleEventArgs) {
    const nodeView = this.halo.getEventData(e).cloneView as NodeView
    if (nodeView) {
      nodeView.onMouseUp(e as JQuery.MouseUpEvent, x, y)
    }
    this.halo.stopBatch()
  }

  // #endregion

  // #region fork

  startForking({ e, x, y }: Halo.HandleEventArgs) {
    this.halo.startBatch()

    const cloned = this.options.clone!(this.cell, {
      fork: true,
    })

    if (!(cloned instanceof Cell)) {
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

  doFork({ e, x, y }: Halo.HandleEventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseMove(e as JQuery.MouseMoveEvent, x, y)
    }
  }

  stopForking({ e, x, y }: Halo.HandleEventArgs) {
    const view = this.halo.getEventData(e).cloneView as CellView
    if (view) {
      view.onMouseUp(e as JQuery.MouseUpEvent, x, y)
    }
    this.halo.stopBatch()
  }

  // #endregion

  // #region rotate

  startRotating({ e, x, y }: Halo.HandleEventArgs) {
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
      rotationStartAngles: nodes.map((node) => node.getRotation()),
      clientStartAngle: new Point(x, y).theta(center),
    })
  }

  doRotate({ e, x, y }: Halo.HandleEventArgs) {
    const data = this.halo.getEventData(e)
    const delta = data.clientStartAngle - new Point(x, y).theta(data.center)
    data.nodes.forEach((node: Node, index: number) => {
      const startAngle = data.rotationStartAngles[index]
      const targetAngle = Util.snapToGrid(
        startAngle + delta,
        this.options.rotateAngleGrid!,
      )
      node.rotate(targetAngle, true, data.center, {
        halo: this.halo.cid,
      })
    })
  }

  // #endregion

  // #region unlink

  unlink() {
    this.halo.startBatch()
    this.model.removeEdges(this.cell)
    this.halo.stopBatch()
  }

  // #endregion
}
