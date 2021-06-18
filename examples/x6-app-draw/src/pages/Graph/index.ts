import { Graph, Addon, Shape } from '@antv/x6'
import './shape'

export default class FlowGraph {
  public static graph: Graph
  private static stencil: Addon.Stencil

  public static init() {
    this.graph = new Graph({
      container: document.getElementById('container')!,
      width: 1000,
      height: 800,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#E7E8EA',
            thickness: 1,
          },
          {
            color: '#CBCED3',
            thickness: 1,
            factor: 5,
          },
        ],
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
        modifiers: 'ctrl',
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#000',
                strokeWidth: 1,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#D06269',
              stroke: '#D06269',
            },
          },
        },
      },
      resizing: true,
      rotating: true,
      selecting: {
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
      },
      snapline: true,
      keyboard: true,
      history: true,
      minimap: {
        enabled: true,
        container: document.getElementById('minimap')!,
        width: 198,
        height: 198,
        padding: 10,
      },
      clipboard: true,
    })
    this.initStencil()
    this.initShape()
    this.initEvent()
    this.initKeyboard()
    return this.graph
  }

  private static initStencil() {
    this.stencil = new Addon.Stencil({
      title: 'Flowchart',
      target: this.graph,
      stencilGraphWidth: 214,
      stencilGraphHeight: document.body.offsetHeight - 105,
      layoutOptions: {
        columns: 4,
        columnWidth: 48,
        rowHeight: 40,
        marginY: 20,
      },
      getDropNode(node) {
        const size = node.size()
        return node.clone().size(size.width * 3, size.height * 3)
      },
    })
    const stencilContainer = document.querySelector('#stencil')
    if (stencilContainer) {
      stencilContainer.appendChild(this.stencil.container)
    }
  }

  private static initShape() {
    const { graph } = this
    const r1 = graph.createNode({
      shape: 'custom-rect',
    })
    const r2 = graph.createNode({
      shape: 'custom-rect',
      attrs: {
        body: {
          rx: 4,
          ry: 4,
        },
      },
    })
    const r3 = graph.createNode({
      shape: 'custom-polygon',
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'custom-polygon',
      attrs: {
        body: {
          refPoints: '10,0 40,0 30,20 0,20',
        },
      },
    })
    const r5 = graph.createNode({
      shape: 'custom-circle',
    })
    this.stencil.load([r1, r2, r3, r4, r5])
  }

  private static showPorts(ports: NodeListOf<SVGElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  private static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!

    graph.on('node:mouseenter', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.showPorts(ports, true)
    })
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>
      this.showPorts(ports, false)
    })
  }

  private static initKeyboard() {
    const { graph } = this
    // copy cut paste
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })

    //undo redo
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.history.canUndo()) {
        graph.history.undo()
      }
      return false
    })
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.history.canRedo()) {
        graph.history.redo()
      }
      return false
    })

    // select all
    graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = graph.getNodes()
      if (nodes) {
        graph.select(nodes)
      }
    })

    //delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })

    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom()
      if (zoom < 1.5) {
        graph.zoom(0.1)
      }
    })
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom()
      if (zoom > 0.5) {
        graph.zoom(-0.1)
      }
    })
  }
}
