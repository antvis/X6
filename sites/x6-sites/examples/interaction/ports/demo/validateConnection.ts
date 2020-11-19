import { Graph, Edge, Shape, NodeView } from '@antv/x6'

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
    return Array.from({ length }, () => {
      return { group: 'in' }
    })
  }

  updateInPorts(graph: Graph) {
    var minNumberOfPorts = 2
    var ports = this.getInPorts()
    var usedPorts = this.getUsedInPorts(graph)
    var newPorts = this.getNewInPorts(
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
        { rewrite: true },
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
      fill: '#ff9c6e',
      stroke: '#ff7a45',
    },
  },
  ports: {
    items: [{ group: 'out' }],
    groups: {
      in: {
        position: { name: 'top' },
        attrs: {
          portBody: {
            magnet: 'passive',
            r: 12,
            cy: -4,
            fill: '#b37feb',
            stroke: '#9254de',
          },
        },
        z: 0,
      },
      out: {
        position: { name: 'bottom' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 12,
            cy: 4,
            fill: '#69c0ff',
            stroke: '#40a9ff',
          },
        },
        z: 0,
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

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 6,
    attrs: {
      strokeWidth: 3,
      stroke: '#ff0000',
    },
  },
}

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  connecting: {
    snap: true,
    dangling: false,
    highlight: true,
    connector: 'rounded',
    router: {
      name: 'er',
      args: {
        // direction: 'W',
      },
    },
    connectionPoint: 'boundary',
    createEdge() {
      return new Shape.Edge()
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
          var portId = targetMagnet.getAttribute('port')
          var usedInPorts = node.getUsedInPorts(graph)
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
  new MyShape().resize(120, 100).position(200, 100).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 100).position(400, 100).updateInPorts(graph),
)

graph.addNode(
  new MyShape().resize(120, 100).position(300, 400).updateInPorts(graph),
)

function update(view: NodeView) {
  var cell = view.cell
  if (cell instanceof MyShape) {
    cell.getInPorts().forEach((port) => {
      var portNode = view.findPortElem(port.id!, 'portBody')
      view.unhighlight(portNode, {
        highlighter: magnetAvailabilityHighlighter,
      })
    })
    cell.updateInPorts(graph)
  }
}

graph.on('edge:mouseenter', ({ view }) => {
  view.addTools({
    tools: [
      'source-arrowhead',
      'target-arrowhead',
      {
        name: 'button-remove',
        args: {
          distance: -30,
        },
      },
    ],
  })
})

graph.on('edge:mouseleave', ({ view }) => {
  view.removeTools()
})

graph.on('edge:connected', ({ previousView, currentView }) => {
  if (previousView) {
    update(previousView)
  }
  if (currentView) {
    update(currentView)
  }
})

graph.on('edge:removed', function ({ edge, options }) {
  if (!options.ui) {
    return
  }

  var target = edge.getTargetCell()
  if (target instanceof MyShape) {
    target.updateInPorts()
  }
})
