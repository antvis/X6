import React from 'react'
import { Graph, Edge, NodeView, Shape } from '@antv/x6'
import '../index.less'

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
      fill: '#f5f5f5',
      stroke: '#ccc',
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
            r: 6,
            cy: 0,
            fill: '#fff',
            stroke: '#31d0c6',
          },
        },
        z: 0,
      },
      out: {
        position: { name: 'bottom' },
        attrs: {
          portBody: {
            magnet: 'active',
            r: 6,
            cy: 0,
            fill: '#fff',
            stroke: '#FFA500',
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
    padding: 5,
    attrs: {
      strokeWidth: 10,
      stroke: '#31d0c6',
    },
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
      },
      connecting: {
        snap: true,
        allowBlank: false,
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
      new MyShape().resize(120, 40).position(200, 100).updateInPorts(graph),
    )

    graph.addNode(
      new MyShape().resize(120, 40).position(400, 100).updateInPorts(graph),
    )

    graph.addNode(
      new MyShape().resize(120, 40).position(300, 280).updateInPorts(graph),
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
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Port rotation compensation</h1>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
