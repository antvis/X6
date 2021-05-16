import { Graph, Addon, FunctionExt, Shape } from '@antv/x6'
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
            factor: 4,
          },
        ],
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: false,
        movable: true,
        showNodeSelectionBox: true,
        filter: ['groupNode'],
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        highlight: true,
        snap: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#5F95FF',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 8,
                },
              },
            },
            router: {
              name: 'manhattan',
            },
            zIndex: 0,
          })
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false
          }
          if (!sourceMagnet) {
            return false
          }
          if (!targetMagnet) {
            return false
          }
          return true
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'rgba(223,234,255)',
            },
          },
        },
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            // 只有 data.parent 为 true 的节点才是父节点
            const data = node.getData<any>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })
    this.initStencil()
    this.initShape()
    this.initEvent()
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
        rowHeight: 30,
        marginY: 30,
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
      shape: 'rect',
      width: 30,
      height: 15,
    })
    const r2 = graph.createNode({
      shape: 'rect',
      width: 30,
      height: 15,
      attrs: {
        body: {
          rx: 4,
          ry: 4,
        },
      },
    })
    const r3 = graph.createNode({
      shape: 'polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })
    const r5 = graph.createNode({
      shape: 'polygon',
      width: 30,
      height: 15,
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
        },
      },
    })
    this.stencil.load([r1, r2, r3, r4, r5])
  }

  private static showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  private static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!

    graph.on('node:contextmenu', ({ cell, view }) => {
      const oldText = cell.attr('text/textWrap/text') as string
      const elem = view.container.querySelector('.x6-edit-text') as HTMLElement
      if (elem == null) {
        return
      }
      cell.attr('text/style/display', 'none')
      if (elem) {
        elem.style.display = ''
        elem.contentEditable = 'true'
        elem.innerText = oldText
        elem.focus()
      }
      const onBlur = () => {
        cell.attr('text/textWrap/text', elem.innerText)
        cell.attr('text/style/display', '')
        elem.style.display = 'none'
        elem.contentEditable = 'false'
      }
      elem.addEventListener('blur', () => {
        onBlur()
        elem.removeEventListener('blur', onBlur)
      })
    })
    graph.on(
      'node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll(
          '.x6-port-body',
        ) as NodeListOf<SVGAElement>
        this.showPorts(ports, true)
      }),
      500,
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGAElement>
      this.showPorts(ports, false)
    })

    graph.on('node:collapse', ({ node, e }) => {
      e.stopPropagation()
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach((n) => {
        if (collapsed) {
          n.hide()
        } else {
          n.show()
        }
      })
    })

    graph.on('node:embedded', ({ cell }) => {
      if (cell.shape !== 'groupNode') {
        cell.toFront()
      }
    })

    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
  }
}
