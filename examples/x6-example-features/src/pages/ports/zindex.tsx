import React from 'react'
import { Graph, Node } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 400,
      grid: 1,
      connecting: {
        validateMagnet() {
          return false
        },
      },
    })

    const rect = graph.addNode({
      type: 'basic.rect',
      markup:
        '<g class="rotatable"><g class="scalable"><rect class="main"/></g><rect class="inner"/></g>',
      position: { x: 130, y: 30 },
      size: { width: 80, height: 150 },
      attrs: {
        '.main': {
          width: 80,
          height: 150,
          stroke: '#31d0c6',
          'stroke-width': 2,
        },
        '.inner': {
          width: 60,
          height: 130,
          'ref-x': 10,
          'ref-y': 10,
          stroke: '#31d0c6',
          'stroke-width': 2,
          fill: '#7c68fc',
        },
      },
    })

    var portIndex = 0
    var addPort = function (z: number | string) {
      var color = '#' + Number(0xe00eee + portIndex++ * 1000).toString(16)
      const zIndex = typeof z === 'number' ? z : undefined
      rect.addPort({
        zIndex,
        id: `${portIndex}`,
        attrs: {
          circle: {
            r: 20,
            magnet: false,
            fill: color,
            stroke: '#31d0c6',
            strokeWidth: 2,
          },
          text: { text: `z: ${z}    `, fill: '#6a6c8a' },
        },
      })
    }

    addPort('auto')
    addPort(0)
    addPort(1)
    addPort(2)
    addPort(3)

    function updateZIndex(node: Node, portId: string, decrease: boolean) {
      if (!node.hasPorts()) {
        return
      }

      if (node.hasPorts() && portId) {
        const portIndex = node.getPortIndex(portId)
        const pathBase = `ports/items/${portIndex}`
        const pathZIndex = `${pathBase}/zIndex`
        const pathText = `${pathBase}/attrs/text/text`
        let z = node.prop<number>(pathZIndex) || 0
        z = decrease ? Math.max(0, --z) : ++z
        node.prop(pathZIndex, z)
        node.prop(pathText, `z: ${z}    `)
      }
    }

    graph.on('node:contextmenu', ({ e, node }) => {
      var portId = e.target.getAttribute('port')
      if (portId) {
        updateZIndex(node, portId, true)
      }
    })

    graph.on('node:click', ({ e, node }) => {
      var portId = e.target.getAttribute('port')
      if (portId) {
        updateZIndex(node, portId, false)
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Port z-index</h1>
        <div className="x6-graph-tools">
          <p>
            Left click on any port to increment, right click to decrement
            z-index
          </p>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
