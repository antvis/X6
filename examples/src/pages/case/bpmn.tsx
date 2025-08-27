import React from 'react'
import { Graph, Cell } from '../../../../src'
import '../index.less'

Graph.registerNode(
  'bpmn-event',
  {
    inherit: 'circle',
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#5F95FF',
        fill: '#FFF',
      },
    },
  },
  true,
)

Graph.registerNode(
  'bpmn-activity',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        strokeWidth: 2,
      },
      img: {
        x: 6,
        y: 6,
        width: 16,
        height: 16,
        'xlink:href':
          'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ',
      },
      label: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerNode(
  'bpmn-gateway',
  {
    inherit: 'polygon',
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',
        strokeWidth: 2,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
      },
      label: {
        text: '+',
        fontSize: 40,
        fill: '#5F95FF',
      },
    },
  },
  true,
)

Graph.registerEdge(
  'bpmn-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
  },
  true,
)

const data = [
  {
    id: '1',
    shape: 'bpmn-event',
    width: 40,
    height: 40,
    position: { x: 50, y: 180 },
  },
  {
    id: '2',
    shape: 'bpmn-activity',
    width: 100,
    height: 60,
    position: { x: 20, y: 280 },
    label: '请假申请',
  },
  {
    id: '3',
    shape: 'bpmn-edge',
    source: '1',
    target: '2',
  },
  {
    id: '4',
    shape: 'bpmn-gateway',
    width: 55,
    height: 55,
    position: { x: 170, y: 282.5 },
  },
  {
    id: '5',
    shape: 'bpmn-edge',
    source: '2',
    target: '4',
  },
  {
    id: '6',
    shape: 'bpmn-activity',
    width: 100,
    height: 60,
    position: { x: 300, y: 240 },
    label: '领导审批',
  },
  {
    id: '7',
    shape: 'bpmn-activity',
    width: 100,
    height: 60,
    position: { x: 300, y: 320 },
    label: '人事审批',
  },
  {
    id: '8',
    shape: 'bpmn-edge',
    source: '4',
    target: '6',
  },
  {
    id: '9',
    shape: 'bpmn-edge',
    source: '4',
    target: '7',
  },
  {
    id: '10',
    shape: 'bpmn-gateway',
    width: 55,
    height: 55,
    position: { x: 460, y: 282.5 },
  },
  {
    id: '11',
    shape: 'bpmn-edge',
    source: '6',
    target: '10',
  },
  {
    id: '12',
    shape: 'bpmn-edge',
    source: '7',
    target: '10',
  },
  {
    id: '13',
    shape: 'bpmn-activity',
    width: 100,
    height: 60,
    position: { x: 560, y: 280 },
    label: '人事审批',
  },
  {
    id: '14',
    shape: 'bpmn-edge',
    source: '10',
    target: '13',
  },
  {
    id: '15',
    shape: 'bpmn-event',
    width: 40,
    height: 40,
    position: { x: 710, y: 290 },
    attrs: {
      body: {
        strokeWidth: 4,
      },
    },
  },
  {
    id: '16',
    shape: 'bpmn-edge',
    source: '13',
    target: '15',
  },
]

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      connecting: {
        router: 'orth',
      },
    })

    const cells: Cell[] = []
    data.forEach((item) => {
      if (item.shape === 'bpmn-edge') {
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
