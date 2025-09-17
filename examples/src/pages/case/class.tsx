import React from 'react'
import { Graph, Cell, ObjectExt } from '@antv/x6'
import '../index.less'

Graph.registerNode(
  'class',
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
        tagName: 'rect',
        selector: 'attrs-rect',
      },
      {
        tagName: 'rect',
        selector: 'methods-rect',
      },
      {
        tagName: 'text',
        selector: 'name-text',
      },
      {
        tagName: 'text',
        selector: 'attrs-text',
      },
      {
        tagName: 'text',
        selector: 'methods-text',
      },
    ],
    attrs: {
      rect: {
        width: 160,
      },
      'name-rect': {
        fill: '#FC8830',
        stroke: '#fff',
        strokeWidth: 0.5,
      },
      'attrs-rect': {
        fill: '#fda059',
        stroke: '#fff',
        strokeWidth: 0.5,
      },
      'methods-rect': {
        fill: '#fda059',
        stroke: '#fff',
        strokeWidth: 0.5,
      },
      'name-text': {
        ref: 'name-rect',
        refY: 0.5,
        refX: 0.5,
        textAnchor: 'middle',
        fontWeight: 'bold',
        fill: 'black',
        fontSize: 12,
      },
      'attrs-text': {
        ref: 'attrs-rect',
        refY: 0.5,
        refX: 5,
        textAnchor: 'left',
        fill: 'black',
        fontSize: 12,
      },
      'methods-text': {
        ref: 'methods-rect',
        refY: 0.5,
        refX: 5,
        textAnchor: 'left',
        fill: 'black',
        fontSize: 12,
      },
    },
    propHooks(meta) {
      const { name, attributes, methods, ...others } = meta

      if (!(name && attributes && methods)) {
        return meta
      }

      const rects = [
        { type: 'name', text: name },
        { type: 'attrs', text: attributes },
        { type: 'methods', text: methods },
      ]

      let offsetY = 0
      rects.forEach((rect) => {
        const height = rect.text.length * 12 + 16
        ObjectExt.setByPath(
          others,
          `attrs/${rect.type}-text/text`,
          rect.text.join('\n'),
        )
        ObjectExt.setByPath(others, `attrs/${rect.type}-rect/height`, height)
        ObjectExt.setByPath(
          others,
          `attrs/${rect.type}-rect/transform`,
          'translate(0,' + offsetY + ')',
        )
        offsetY += height
      })

      others.size = { width: 160, height: offsetY }

      return others
    },
  },
  true,
)

Graph.registerEdge(
  'extends',
  {
    inherit: 'edge',
    attrs: {
      line: {
        strokeWidth: 1,
        targetMarker: {
          name: 'path',
          d: 'M 20 0 L 0 10 L 20 20 z',
          fill: 'white',
          offsetX: -10,
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'implement',
  {
    inherit: 'edge',
    attrs: {
      line: {
        strokeWidth: 1,
        strokeDasharray: '3,3',
        targetMarker: {
          name: 'path',
          d: 'M 20 0 L 0 10 L 20 20 z',
          fill: 'white',
          offsetX: -10,
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'composition',
  {
    inherit: 'edge',
    attrs: {
      line: {
        strokeWidth: 1,
        sourceMarker: {
          name: 'path',
          d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
          fill: 'black',
          offsetX: -10,
        },
        targetMarker: {
          name: 'path',
          d: 'M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z',
          fill: 'black',
          offsetX: -5,
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'aggregation',
  {
    inherit: 'edge',
    attrs: {
      line: {
        strokeWidth: 1,
        sourceMarker: {
          name: 'path',
          d: 'M 30 10 L 20 16 L 10 10 L 20 4 z',
          fill: 'white',
          offsetX: -10,
        },
        targetMarker: {
          name: 'path',
          d: 'M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z',
          fill: 'black',
          offsetX: -5,
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'association',
  {
    inherit: 'edge',
    attrs: {
      line: {
        strokeWidth: 1,
        targetMarker: {
          name: 'path',
          d: 'M 6 10 L 18 4 C 14.3333 6 10.6667 8 7 10 L 18 16 z',
          fill: 'black',
          offsetX: -5,
        },
      },
    },
  },
  true,
)

const data = [
  {
    id: '1',
    shape: 'class',
    name: ['<<Abstract>>', '动物'],
    attributes: ['+有生命'],
    methods: ['+新陈代谢()', '+繁殖()'],
    position: { x: 300, y: 40 },
  },
  {
    id: '2',
    shape: 'class',
    name: ['鸟'],
    attributes: ['+羽毛'],
    methods: ['+下蛋'],
    position: { x: 300, y: 200 },
  },
  {
    id: '3',
    shape: 'extends',
    source: '2',
    target: '1',
  },
  {
    id: '4',
    shape: 'class',
    name: ['翅膀'],
    attributes: [],
    methods: [],
    position: { x: 560, y: 212 },
  },
  {
    id: '5',
    shape: 'composition',
    source: '2',
    target: '4',
    label: '1:2',
  },
  {
    id: '6',
    shape: 'class',
    name: ['大雁'],
    attributes: [],
    methods: ['+飞()'],
    position: { x: 210, y: 340 },
  },
  {
    id: '7',
    shape: 'class',
    name: ['企鹅'],
    attributes: [],
    methods: ['+下蛋()'],
    position: { x: 400, y: 340 },
  },
  {
    id: '8',
    shape: 'extends',
    source: '2',
    target: '6',
  },
  {
    id: '9',
    shape: 'extends',
    source: '2',
    target: '7',
  },
  {
    id: '10',
    shape: 'class',
    name: ['<<interface>>', '飞翔'],
    attributes: [],
    methods: ['+飞()'],
    position: { x: 320, y: 500 },
  },
  {
    id: '11',
    shape: 'implement',
    source: '6',
    target: '10',
  },
  {
    id: '12',
    shape: 'class',
    name: ['雁群'],
    attributes: [],
    methods: ['+V字飞行()', '+一字飞行()'],
    position: { x: 90, y: 500 },
  },
  {
    id: '13',
    shape: 'aggregation',
    source: '12',
    target: '6',
  },
  {
    id: '14',
    shape: 'class',
    name: ['气候'],
    attributes: [],
    methods: [],
    position: { x: 540, y: 510 },
  },
  {
    id: '15',
    shape: 'association',
    source: '7',
    target: '14',
  },
]

export class CaseClassExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const cells: Cell[] = []
    const edgeShapes = [
      'extends',
      'composition',
      'implement',
      'aggregation',
      'association',
    ]
    data.forEach((item) => {
      if (edgeShapes.includes(item.shape)) {
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
