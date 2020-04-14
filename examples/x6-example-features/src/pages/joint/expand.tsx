import React from 'react'
import { joint } from '@antv/x6'
import { Rect } from '@antv/x6/es/research/shape/standard'
import '../index.less'
import './index.less'

const EXPANDED_COLOR = '#8CC152'
const COLLAPSED_COLOR = '#FCBB42'
const BASE_COLOR = '#434A54'

class TogglableRect extends Rect {
  onConnectedEdgeVisibleChange(
    edge: joint.Edge,
    type: joint.Edge.TerminalType,
    visible: boolean,
  ) {
    const terminal = edge[type]
    const portId = (terminal as joint.Edge.TerminalCellData).portId
    if (portId && this.isNode()) {
      var expand = visible
      var collapsedMap: { [poerId: string]: number } =
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
    var collapsedMap: { [poerId: string]: number } =
      this.prop('collapsed') || {}
    return collapsedMap[portId] > 0
  }

  expandPort(portId: string) {
    if (portId) {
      if (this.isPortCollapsed(portId) && this.model) {
        const resolve = (edge: joint.Edge) => {
          const source = edge.getSource()
          const target = edge.getTarget()
          let result

          if (
            source &&
            this.id !== (source as joint.Edge.TerminalCellData).cellId
          ) {
            result = {
              opposite: source,
              current: target,
            }
          }

          if (
            target &&
            this.id !== (target as joint.Edge.TerminalCellData).cellId
          ) {
            result = {
              opposite: target,
              current: source,
            }
          }

          return result
        }

        this.model.getConnectedEdges(this).forEach(edge => {
          const ret = resolve(edge as any)
          if (
            ret &&
            (ret.current as joint.Edge.TerminalCellData).portId === portId &&
            (ret.opposite as joint.Edge.TerminalCellData).cellId
          ) {
            const cellId = (ret.opposite as joint.Edge.TerminalCellData).cellId
            const cell = this.model!.getCell(cellId)
            cell && cell.show()
          }
        })
      }
    }
  }
}

TogglableRect.config({
  ports: {
    groups: {
      in: {
        attrs: {
          circle: {
            stroke: BASE_COLOR,
            magnet: true,
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
            stroke: BASE_COLOR,
            magnet: true,
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
      xAlignment: 'middle',
      yAlignment: 'middle',
      fill: '#F5F7FA',
    },
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 1,
      defaultConnectionPoint: { name: 'boundary' },
      magnetThreshold: 'onleave',
      clickThreshold: 5,
      validateMagnet: function(cellView: joint.CellView, magnet: Element) {
        var cell = (cellView.cell as any) as TogglableRect
        var portId = magnet.getAttribute('port')
        return portId ? !cell.isPortCollapsed(portId) : true
      },
    })

    const a = new TogglableRect({
      id: 'a',
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

    a.setSize(100, 100).setPosition(200, 10)
    graph.addNode(a)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
