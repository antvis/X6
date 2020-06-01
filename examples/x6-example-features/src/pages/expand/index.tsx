import React from 'react'
import { Graph, Edge, CellView, StandardShape } from '@antv/x6'
import '../index.less'
import './index.less'

const EXPANDED_COLOR = '#8CC152'
const COLLAPSED_COLOR = '#FCBB42'
const BASE_COLOR = '#434A54'

class TogglableRect extends StandardShape.Rect {
  onConnectedEdgeVisibleChange(
    edge: Edge,
    type: Edge.TerminalType,
    visible: boolean,
  ) {
    const terminal = edge[type]
    const portId = (terminal as Edge.TerminalCellData).port
    if (portId && this.isNode()) {
      var expand = visible
      var collapsedMap: { [portId: string]: number } =
        this.prop('collapsed') || {}

      if (expand) {
        if (isFinite(collapsedMap[portId])) {
          collapsedMap[portId]--
        }

        if (collapsedMap[portId] <= 0) {
          delete collapsedMap[portId]
          this.portProp(portId, 'collapsed', false)
          this.onPortExpand(portId, expand)
        }
      } else {
        if (!collapsedMap[portId]) {
          collapsedMap[portId] = 1
          this.portProp(portId, 'collapsed', true)
          this.onPortExpand(portId, expand)
        } else {
          collapsedMap[portId]++
        }
      }

      this.prop('collapsed', collapsedMap)
    }
  }

  protected onPortExpand(portId: string, expand: boolean) {
    var color = expand ? EXPANDED_COLOR : COLLAPSED_COLOR
    var className = expand ? 'expanded' : 'collapsed'
    this.portProp(portId, 'attrs/circle/fill', color)
    this.portProp(portId, 'attrs/circle/class', className)
  }

  isPortCollapsed(portId: string) {
    var collapsedMap: { [portId: string]: number } =
      this.prop('collapsed') || {}
    return collapsedMap[portId] > 0
  }

  expandPort(portId: string) {
    if (portId) {
      if (this.isPortCollapsed(portId) && this.model) {
        const resolve = (edge: Edge) => {
          const source = edge.getSource()
          const target = edge.getTarget()
          let result

          if (source && this.id !== (source as Edge.TerminalCellData).cell) {
            result = {
              opposite: source,
              current: target,
            }
          }

          if (target && this.id !== (target as Edge.TerminalCellData).cell) {
            result = {
              opposite: target,
              current: source,
            }
          }

          return result
        }

        this.model.getConnectedEdges(this).forEach((edge) => {
          const ret = resolve(edge as any)
          if (
            ret &&
            (ret.current as Edge.TerminalCellData).port === portId &&
            (ret.opposite as Edge.TerminalCellData).cell
          ) {
            const cellId = (ret.opposite as Edge.TerminalCellData).cell
            const cell = this.model!.getCell(cellId)
            cell && cell.show()
          }
        })
      }
    }
  }
}

TogglableRect.config({
  size: {
    width: 100,
    height: 100,
  },
  ports: {
    groups: {
      in: {
        attrs: {
          circle: {
            magnet: true,
            stroke: BASE_COLOR,
            fill: EXPANDED_COLOR,
          },
        },
        position: {
          name: 'left',
        },
      },
      out: {
        attrs: {
          circle: {
            magnet: true,
            stroke: BASE_COLOR,
            fill: EXPANDED_COLOR,
          },
        },
        position: 'right',
      },
    },
  },
  attrs: {
    body: {
      refWidth: 1,
      refHeight: 1,
      fill: '#AAB2BD',
    },
    label: {
      refX: '50%',
      refY: '50%',
      fontWeight: 'bold',
      fontSize: 24,
      xAlign: 'middle',
      yAlign: 'middle',
      fill: '#F5F7FA',
    },
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 1,
      connecting: {
        connectionPoint: 'boundary',
        validateMagnet: function (cellView: CellView, magnet: Element) {
          var cell = (cellView.cell as any) as TogglableRect
          var portId = magnet.getAttribute('port')
          return portId ? !cell.isPortCollapsed(portId) : true
        },
      },
      magnetThreshold: 'onleave',
      clickThreshold: 5,
    })

    graph.on('node:click', ({ view }) => {
      view.cell.hide()
    })

    graph.on('node:magnet:click', ({ e, view, magnet }) => {
      e.stopPropagation()
      var portId = magnet.getAttribute('port')
      if (portId) {
        const rect = (view.cell as any) as TogglableRect
        rect.expandPort(portId)
      }
    })

    graph.on('cell:change:visible', ({ cell, current }) => {
      console.log(cell)
      if (cell.isEdge()) {
        const visible = current !== false
        const sourceCell = cell.getSourceCell()
        if (sourceCell) {
          const rect = (sourceCell as any) as TogglableRect
          rect.onConnectedEdgeVisibleChange(cell, 'source', visible)
        }

        const targetCell = cell.getTargetCell()
        if (targetCell) {
          const rect = (targetCell as any) as TogglableRect
          rect.onConnectedEdgeVisibleChange(cell, 'target', visible)
        }
      }
    })

    const a = new TogglableRect({
      id: 'a',
      x: 200,
      y: 40,
      attrs: { label: { text: 'a' } },
      ports: {
        items: [
          { group: 'in', id: 'in1', type: 'a' },
          { group: 'in', id: 'in2', type: 'o' },
          { group: 'out', id: 'out1' },
          { group: 'out', id: 'out2' },
        ],
      },
    })

    a.addTo(graph)

    const aa = new TogglableRect({
      id: 'aa',
      x: 400,
      y: 40,
      attrs: { label: { text: 'aa' } },
      ports: {
        items: [
          { group: 'in', id: 'in1' },
          { group: 'in', id: 'in2' },
          { group: 'out', id: 'out1' },
          { group: 'out', id: 'out2' },
        ],
      },
    })
    aa.addTo(graph)

    const aaa = new TogglableRect({
      id: 'aaa',
      x: 550,
      y: 120,
      attrs: { label: { text: 'aaa' } },
      ports: {
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' },
        ],
      },
    })
    aaa.addTo(graph)

    const b = new TogglableRect({
      id: 'b',
      x: 200,
      y: 200,
      attrs: { label: { text: 'b' } },
      ports: {
        items: [
          { group: 'in', id: 'in1' },
          { group: 'in', id: 'in2' },
          { group: 'out', id: 'out1' },
          { group: 'out', id: 'out2' },
        ],
      },
    })
    b.addTo(graph)

    const bb = b
      .clone()
      .prop('id', 'bb')
      .attr({ label: { text: 'bb' } })
      .setPosition(400, 200)
    bb.addTo(graph)

    const bbb = b
      .clone()
      .prop('id', 'bbb')
      .attr({ label: { text: 'bbb' } })
      .setPosition(400, 350)
    bbb.addTo(graph)

    const x = new TogglableRect({
      id: 'x',
      x: 60,
      y: 400,
      attrs: { label: { text: 'x' } },
      ports: {
        items: [
          { group: 'out', id: 'out1' },
          { group: 'out', id: 'out2' },
        ],
      },
    })
    x.addTo(graph)

    const y = x
      .clone()
      .prop('id', 'y')
      .attr({ label: { text: 'y' } })
      .setPosition(30, 80)
    y.addTo(graph)

    graph.addEdge({
      type: 'edge',
      source: { cell: a.id, port: 'out1' },
      target: { cell: aa.id, port: 'in1' },
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: aa,
      targetCell: aaa,
      sourcePort: 'out2',
      targetPort: 'in1',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: b.id,
      targetCell: bb.id,
      sourcePort: 'out1',
      targetPort: 'in1',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: b,
      targetCell: bbb,
      sourcePort: 'out2',
      targetPort: 'in1',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: b,
      targetCell: aaa,
      sourcePort: 'out1',
      targetPort: 'in1',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: aaa,
      sourcePort: 'out1',
      targetPoint: { x: 700, y: 100 },
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: bbb,
      targetCell: x,
      sourcePort: 'in1',
      targetPort: 'out2',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: b,
      targetCell: x,
      sourcePort: 'in2',
      targetPort: 'out1',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: b,
      targetCell: y,
      sourcePort: 'in1',
      targetPort: 'out2',
    })

    graph.addEdge({
      type: 'edge',
      sourceCell: a,
      targetCell: y,
      sourcePort: 'in1',
      targetPort: 'out1',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
