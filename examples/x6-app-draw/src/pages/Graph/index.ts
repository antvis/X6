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
      scroller: {
        enabled: true,
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
    // const copy = () => {
    //   const { graph } = FlowGraph
    //   const cells = graph.getSelectedCells()
    //   if (cells.length) {
    //     graph.copy(cells)
    //   }
    //   return false
    // }
    // const cut = () => {
    //   const { graph } = FlowGraph
    //   const cells = graph.getSelectedCells()
    //   if (cells.length) {
    //     graph.cut(cells)
    //   }
    //   return false
    // }
    // const paste = () => {
    //   const { graph } = FlowGraph
    //   if (!graph.isClipboardEmpty()) {
    //     const cells = graph.paste({ offset: 32 })
    //     graph.cleanSelection()
    //     graph.select(cells)
    //   }
    //   return false
    // }
    // graph.bindKey(['meta+z', 'ctrl+z'], () => {
    //   if (history.canUndo()) {
    //     history.undo()
    //   }
    //   return false
    // })
    // graph.bindKey(['meta+shift+z', 'ctrl+y'], () => {
    //   if (history.canRedo()) {
    //     history.redo()
    //   }
    //   return false
    // })
    // graph.bindKey(['meta+d', 'ctrl+d'], () => {
    //   graph.clearCells()
    //   return false
    // })
    // graph.bindKey(['meta+s', 'ctrl+s'], () => {
    //   graph.toPNG((datauri: string) => {
    //     DataUri.downloadDataUri(datauri, 'chart.png')
    //   })
    //   return false
    // })
    // graph.bindKey(['meta+p', 'ctrl+p'], () => {
    //   graph.printPreview()
    //   return false
    // })
    // graph.bindKey(['meta+c', 'ctrl+c'], copy)
    // graph.bindKey(['meta+v', 'ctrl+v'], paste)
    // graph.bindKey(['meta+x', 'ctrl+x'], cut)
  }
}
