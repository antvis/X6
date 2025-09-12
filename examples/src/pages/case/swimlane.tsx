import React from 'react'
import { Graph, Cell, CellView, Node } from '@antv/x6'
import '../index.less'

Graph.registerNode(
  'lane',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'rect',
        selector: 'name-rect',
      },
      {
        tagName: 'text',
        selector: 'name-text',
      },
    ],
    attrs: {
      body: {
        fill: '#FFF',
        stroke: '#5F95FF',
        strokeWidth: 1,
      },
      'name-rect': {
        width: 200,
        height: 30,
        fill: '#5F95FF',
        stroke: '#fff',
        strokeWidth: 1,
        x: -1,
      },
      'name-text': {
        ref: 'name-rect',
        refY: 0.5,
        refX: 0.5,
        textAnchor: 'middle',
        fontWeight: 'bold',
        fill: '#fff',
        fontSize: 12,
      },
    },
  },
  true,
)

Graph.registerNode(
  'lane-rect',
  {
    inherit: 'rect',
    width: 100,
    height: 60,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerNode(
  'lane-polygon',
  {
    inherit: 'polygon',
    width: 80,
    height: 80,
    attrs: {
      body: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        refPoints: '0,10 10,0 20,10 10,20',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerEdge(
  'lane-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    label: {
      attrs: {
        label: {
          fill: '#A2B1C3',
          fontSize: 12,
        },
      },
    },
  },
  true,
)

const data = [
  {
    id: '1',
    shape: 'lane',
    width: 200,
    height: 500,
    position: { x: 60, y: 60 },
    label: '<Function>',
  },
  {
    id: '2',
    shape: 'lane',
    width: 200,
    height: 500,
    position: { x: 260, y: 60 },
    label: '<Function>',
  },
  {
    id: '3',
    shape: 'lane',
    width: 200,
    height: 500,
    position: { x: 460, y: 60 },
    label: '<Function>',
  },
  {
    id: '4',
    shape: 'lane',
    width: 200,
    height: 500,
    position: { x: 660, y: 60 },
    label: '<Function>',
  },
  {
    id: '5',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 110, y: 120 },
    label: 'Start',
    attrs: {
      body: {
        rx: 30,
        ry: 30,
      },
    },
    parent: '1',
  },
  {
    id: '6',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 320, y: 120 },
    label: 'Process',
    parent: '2',
  },
  {
    id: '7',
    shape: 'lane-polygon',
    width: 80,
    height: 80,
    position: { x: 520, y: 110 },
    label: 'Judge',
    parent: '3',
  },
  {
    id: '8',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 510, y: 240 },
    label: 'Process',
    parent: '3',
  },
  {
    id: '9',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 720, y: 240 },
    label: 'Process',
    parent: '4',
  },
  {
    id: '10',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 720, y: 350 },
    label: 'Process',
    parent: '4',
  },
  {
    id: '11',
    shape: 'lane-polygon',
    width: 80,
    height: 80,
    position: { x: 520, y: 340 },
    label: 'Judge',
    parent: '3',
  },
  {
    id: '12',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 510, y: 470 },
    label: 'Process',
    parent: '3',
  },
  {
    id: '13',
    shape: 'lane-rect',
    width: 100,
    height: 60,
    position: { x: 300, y: 470 },
    label: 'End',
    attrs: {
      body: {
        rx: 30,
        ry: 30,
      },
    },
    parent: '2',
  },
  {
    id: '14',
    shape: 'lane-edge',
    source: '5',
    target: '6',
  },
  {
    id: '15',
    shape: 'lane-edge',
    source: '6',
    target: '7',
  },
  {
    id: '16',
    shape: 'lane-edge',
    source: '7',
    target: '8',
    label: 'Yes',
  },
  {
    id: '17',
    shape: 'lane-edge',
    source: '7',
    target: '9',
    label: 'No',
  },
  {
    id: '18',
    shape: 'lane-edge',
    source: '8',
    target: '9',
  },
  {
    id: '19',
    shape: 'lane-edge',
    source: '9',
    target: '10',
  },
  {
    id: '20',
    shape: 'lane-edge',
    source: '10',
    target: '11',
  },
  {
    id: '21',
    shape: 'lane-edge',
    source: '11',
    target: '12',
    label: 'Yes',
  },
  {
    id: '22',
    shape: 'lane-edge',
    source: '11',
    target: '13',
    label: 'No',
  },
  {
    id: '23',
    shape: 'lane-edge',
    source: '12',
    target: '13',
  },
]

export class CaseSwimlaneExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
      connecting: {
        router: 'orth',
      },
      translating: {
        restrict(cellView: CellView) {
          const cell = cellView.cell as Node
          const parentId = cell.prop('parent')
          if (parentId) {
            const parentNode = graph.getCellById(parentId) as Node
            if (parentNode) {
              return parentNode.getBBox().moveAndExpand({
                x: 0,
                y: 30,
                width: 0,
                height: -30,
              })
            }
          }
          return cell.getBBox()
        },
      },
    })

    const cells: Cell[] = []
    data.forEach((item) => {
      if (item.shape === 'lane-edge') {
        cells.push(graph.createEdge(item))
      } else {
        cells.push(graph.createNode(item))
      }
    })
    graph.resetCells(cells)
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
