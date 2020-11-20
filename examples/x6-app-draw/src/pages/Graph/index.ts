import { Graph, Addon, FunctionExt, Shape } from '@antv/x6'
import {
  FlowChartRect,
  FlowChartImageRect,
  FlowChartTitleRect,
  FlowChartAnimateText,
  NodeGroup,
} from './shape'
import graphData from './data'

export default class FlowGraph {
  public static graph: Graph
  private static stencil: Addon.Stencil

  public static init() {
    this.graph = new Graph({
      container: document.getElementById('container')!,
      width: 0,
      height: 0,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#cccccc',
            thickness: 1,
          },
          {
            color: '#5F95FF',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        dangling: false,
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
    this.initGraphShape()
    this.initEvent()
    return this.graph
  }

  private static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 180,
        },
        {
          name: 'combination',
          title: '组合节点',
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
          graphHeight: 260,
        },
        {
          name: 'group',
          title: '节点组',
          graphHeight: 100,
          layoutOptions: {
            columns: 1,
            marginX: 60,
          },
        },
      ],
    })
    const stencilContainer = document.querySelector('#stencil')
    stencilContainer?.appendChild(this.stencil.container)
  }

  private static initShape() {
    const r1 = new FlowChartRect({
      attrs: {
        body: {
          rx: 24,
          ry: 24,
        },
        text: {
          text: '起始节点',
        },
      },
    })
    const r2 = new FlowChartRect({
      attrs: {
        text: {
          text: '流程节点',
        },
      },
    })
    const r3 = new FlowChartRect({
      width: 52,
      height: 52,
      angle: 45,
      attrs: {
        'edit-text': {
          style: {
            transform: 'rotate(-45deg)',
          },
        },
        text: {
          text: '判断节点',
          transform: 'rotate(-45deg)',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: -26,
              },
            },
          },
          right: {
            position: {
              name: 'right',
              args: {
                dy: -26,
              },
            },
          },
          bottom: {
            position: {
              name: 'bottom',
              args: {
                dx: 26,
              },
            },
          },
          left: {
            position: {
              name: 'left',
              args: {
                dy: 26,
              },
            },
          },
        },
      },
    })
    const r4 = new FlowChartRect({
      width: 70,
      height: 70,
      attrs: {
        body: {
          rx: 35,
          ry: 35,
        },
        text: {
          text: '链接节点',
        },
      },
    })
    const c1 = new FlowChartImageRect()
    const c2 = new FlowChartTitleRect()
    const c3 = new FlowChartAnimateText()
    const g1 = new NodeGroup({
      attrs: {
        text: {
          text: 'Group Name',
        },
      },
      data: {
        parent: true,
      },
    })
    this.stencil.load([r1, r2, r3, r4], 'basic')
    this.stencil.load([c1, c2, c3], 'combination')
    this.stencil.load([g1], 'group')
  }

  private static initGraphShape() {
    this.graph.fromJSON(graphData as any)
  }

  private static showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  private static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!

    graph.on('node:contextmenu', ({ e, x, y, cell, view }) => {
      cell.attr('text/style/display', 'none')
      const elem = view.container.querySelector('.x6-edit-text') as HTMLElement
      if (elem) {
        elem.focus()
      }
    })
    graph.on(
      'node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<
          SVGAElement
        >
        this.showPorts(ports, true)
      }),
      500,
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<
        SVGAElement
      >
      this.showPorts(ports, false)
    })

    graph.on('node:collapse', ({ node }: { node }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach((node) => {
        if (collapsed) {
          node.hide()
        } else {
          node.show()
        }
      })
    })

    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
  }
}
