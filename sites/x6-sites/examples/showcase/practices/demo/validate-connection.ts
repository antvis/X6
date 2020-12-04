import { Graph, Edge, Shape, NodeView } from '@antv/x6'

// 定义节点
class MyShape extends Shape.Rect {
  getInPorts() {
    return this.getPortsByGroup('in')
  }

  getOutPorts() {
    return this.getPortsByGroup('out')
  }

  getUsedInPorts(graph: Graph) {
    const incomingEdges = graph.getIncomingEdges(this) || []
    return incomingEdges.map((edge: Edge) => {
      const portId = edge.getTargetPortId()
      return this.getPort(portId!)
    })
  }

  getNewInPorts(length: number) {
    return Array.from(
      {
        length,
      },
      () => {
        return {
          group: 'in',
        }
      },
    )
  }

  updateInPorts(graph: Graph) {
    const minNumberOfPorts = 2
    const ports = this.getInPorts()
    const usedPorts = this.getUsedInPorts(graph)
    const newPorts = this.getNewInPorts(
      Math.max(minNumberOfPorts - usedPorts.length, 1),
    )

    if (
      ports.length === minNumberOfPorts &&
      ports.length - usedPorts.length > 0
    ) {
      // noop
    } else if (ports.length === usedPorts.length) {
      this.addPorts(newPorts)
    } else if (ports.length + 1 > usedPorts.length) {
      this.prop(
        ['ports', 'items'],
        this.getOutPorts().concat(usedPorts).concat(newPorts),
        {
          rewrite: true,
        },
      )
    }

    return this
  }
}

MyShape.config({
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    items: [
      {
        group: 'out',
      },
    ],
    groups: {
      in: {
        position: {
          name: 'top',
        },
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 6,
            stroke: '#ffa940',
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
      out: {
        position: {
          name: 'bottom',
        },
        attrs: {
          portBody: {
            magnet: true,
            r: 6,
            fill: '#fff',
            stroke: '#3199FF',
            strokeWidth: 2,
          },
        },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
})

// 高亮
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {
      fill: '#fff',
      stroke: '#47C769',
    },
  },
}

// 画布
const graph = new Graph({
  grid: true,
  container: document.getElementById('container')!,
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#31d0c6',
        },
      },
    },
  },
  connecting: {
    snap: true,
    dangling: false,
    highlight: true,
    connector: 'rounded',
    connectionPoint: 'boundary',
    router: {
      name: 'er',
      args: {
        direction: 'V',
      },
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#a0a0a0',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              size: 7,
            },
          },
        },
      })
    },
    validateConnection({ sourceView, targetView, targetMagnet }) {
      if (!targetMagnet) {
        return false
      }

      if (sourceView === targetView) {
        return false
      }

      if (targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      if (targetView) {
        const node = targetView.cell
        if (node instanceof MyShape) {
          const portId = targetMagnet.getAttribute('port')
          const usedInPorts = node.getUsedInPorts(graph)
          if (usedInPorts.find((port) => port && port.id === portId)) {
            return false
          }
        }
      }

      return true
    },
  },
})

graph.addNode(
  new MyShape().resize(120, 40).position(200, 50).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 40).position(400, 50).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 40).position(300, 250).updateInPorts(graph),
)

function update(view: NodeView) {
  const cell = view.cell
  if (cell instanceof MyShape) {
    cell.getInPorts().forEach((port) => {
      const portNode = view.findPortElem(port.id!, 'portBody')
      view.unhighlight(portNode, {
        highlighter: magnetAvailabilityHighlighter,
      })
    })
    cell.updateInPorts(graph)
  }
}

graph.on('edge:connected', ({ previousView, currentView }) => {
  if (previousView) {
    update(previousView as NodeView)
  }
  if (currentView) {
    update(currentView as NodeView)
  }
})

graph.on('edge:removed', ({ edge, options }) => {
  if (!options.ui) {
    return
  }

  const target = edge.getTargetCell()
  if (target instanceof MyShape) {
    target.updateInPorts(graph)
  }
})

graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    'source-arrowhead',
    'target-arrowhead',
    {
      name: 'button-remove',
      args: {
        distance: -30,
      },
    },
  ])
})

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools()
})
