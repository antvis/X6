import React from 'react'
import { Graph, Edge, NodeView, StandardShape } from '@antv/x6'
import '../index.less'

class Shape extends StandardShape.Rect {
  getInPorts() {
    return this.getPortsByGroup('in')
  }

  getOutPorts() {
    return this.getPortsByGroup('out')
  }

  getUsedInPorts() {
    const incomingEdges = this.getIncomingEdges() || []
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

  updateInPorts() {
    var minNumberOfPorts = 2
    var ports = this.getInPorts()
    var usedPorts = this.getUsedInPorts()
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
  }
}

Shape.config({
  attrs: {
    root: {
      magnet: false,
    },
    body: {
      fill: 'lightgray',
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
            fill: 'darkblue',
            stroke: 'black',
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
            fill: 'lightblue',
            stroke: 'black',
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
      stroke: 'red',
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
      grid: 1,
      connecting: {
        snap: true,
        dangling: true,
        connector: 'smooth',
        connectionPoint: 'boundary',
        highlight: true,
        validateConnection(
          sourceView,
          sourceMagnet,
          targetView,
          targetMagnet,
          terminalType,
          edgeView,
        ) {
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
            if (node instanceof Shape) {
              var portId = targetMagnet.getAttribute('port')
              var usedInPorts = node.getUsedInPorts()
              if (usedInPorts.find((port) => port && port.id === portId)) {
                return false
              }
            }
          }

          return true
        },
      },
    })

    graph.options.highlighting.magnetAvailable = magnetAvailabilityHighlighter

    const shape1 = new Shape()
    shape1.resize(120, 100)
    shape1.pos(200, 100)
    shape1.updateInPorts()
    graph.addNode(shape1)

    var shape2 = new Shape()
    shape2.resize(120, 100)
    shape2.pos(400, 100)
    shape2.updateInPorts()
    graph.addNode(shape2)

    var shape3 = new Shape()
    shape3.resize(120, 100)
    shape3.pos(300, 400)
    shape3.updateInPorts()
    graph.addNode(shape3)

    function update(view: NodeView) {
      var cell = view.cell
      if (cell instanceof Shape) {
        cell.getInPorts().forEach((port) => {
          var portNode = view.findPortElem(port.id!, 'portBody')
          view.unhighlight(portNode, {
            highlighter: magnetAvailabilityHighlighter,
          })
        })
        cell.updateInPorts()
      }
    }

    graph.on('edge:mouseenter', ({ view }) => {
      view.addTools({
        tools: [
          'targetArrowhead',
          {
            name: 'remove',
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

    graph.on('edge:connected', ({ view }) => {
      update(view)
    })

    graph.on('edge:disconnected', ({ view }) => {
      update(view)
    })

    graph.on('link:connect link:disconnect', function (
      linkView,
      evt,
      elementView,
    ) {})

    // graph.on('edge:mouseenter', ({ view }) => {})

    // graph.on('edge:mouseleave', function({ view }) {
    //   view.removeTools()
    // })

    graph.on('edge:removed', function ({ edge, options }) {
      if (!options.ui) {
        return
      }

      var target = edge.getTargetCell()
      if (target instanceof Shape) {
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
