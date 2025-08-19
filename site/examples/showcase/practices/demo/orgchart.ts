import { Graph, Cell, Node, Dom } from '@antv/x6'
import dagre from 'dagre'
import insertCss from 'insert-css'

// 定义样式
insertCss(`
  .x6-cell {
    cursor: default;
  }
  .x6-node .btn {
    cursor: pointer;
  }
`)

// 自定义节点
Graph.registerNode(
  'org-node',
  {
    width: 260,
    height: 88,
    markup: [
      {
        tagName: 'rect',
        attrs: {
          class: 'card',
        },
      },
      {
        tagName: 'image',
        attrs: {
          class: 'image',
        },
      },
      {
        tagName: 'text',
        attrs: {
          class: 'rank',
        },
      },
      {
        tagName: 'text',
        attrs: {
          class: 'name',
        },
      },
      {
        tagName: 'g',
        attrs: {
          class: 'btn add',
        },
        children: [
          {
            tagName: 'circle',
            attrs: {
              class: 'add',
            },
          },
          {
            tagName: 'text',
            attrs: {
              class: 'add',
            },
          },
        ],
      },
      {
        tagName: 'g',
        attrs: {
          class: 'btn del',
        },
        children: [
          {
            tagName: 'circle',
            attrs: {
              class: 'del',
            },
          },
          {
            tagName: 'text',
            attrs: {
              class: 'del',
            },
          },
        ],
      },
    ],
    attrs: {
      '.card': {
        rx: 10,
        ry: 10,
        refWidth: '100%',
        refHeight: '100%',
        fill: '#5F95FF',
        stroke: '#5F95FF',
        strokeWidth: 1,
        pointerEvents: 'visiblePainted',
      },
      '.image': {
        x: 16,
        y: 16,
        width: 56,
        height: 56,
        opacity: 0.7,
      },
      '.rank': {
        refX: 0.95,
        refY: 0.5,
        fill: '#fff',
        fontFamily: 'Courier New',
        fontSize: 13,
        textAnchor: 'end',
        textVerticalAnchor: 'middle',
      },
      '.name': {
        refX: 0.95,
        refY: 0.7,
        fill: '#fff',
        fontFamily: 'Arial',
        fontSize: 14,
        fontWeight: '600',
        textAnchor: 'end',
      },
      '.btn.add': {
        refDx: -16,
        refY: 16,
        event: 'node:add',
      },
      '.btn.del': {
        refDx: -44,
        refY: 16,
        event: 'node:delete',
      },
      '.btn > circle': {
        r: 10,
        fill: 'transparent',
        stroke: '#fff',
        strokeWidth: 1,
      },
      '.btn.add > text': {
        fontSize: 20,
        fontWeight: 800,
        fill: '#fff',
        x: -5.5,
        y: 7,
        fontFamily: 'Times New Roman',
        text: '+',
      },
      '.btn.del > text': {
        fontSize: 28,
        fontWeight: 500,
        fill: '#fff',
        x: -4.5,
        y: 6,
        fontFamily: 'Times New Roman',
        text: '-',
      },
    },
  },
  true,
)

// 自定义边
Graph.registerEdge(
  'org-edge',
  {
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: '#A2B1C3',
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true,
)

const male =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
const female =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'
// 布局方向
const dir = 'LR' // LR RL TB BT

// 创建画布
const graph = new Graph({
  container: document.getElementById('container')!,
  scroller: true,
  interacting: false,
})

// 监听自定义事件
function setup() {
  graph.on('node:add', ({ e, node }) => {
    e.stopPropagation()
    const member = createNode(
      'Employee',
      'New Employee',
      Math.random() < 0.5 ? male : female,
    )
    graph.addCell([member, createEdge(node, member)])
    layout()
  })

  graph.on('node:delete', ({ e, node }) => {
    e.stopPropagation()
    graph.removeCell(node)
    layout()
  })
}

// 自动布局
function layout() {
  const nodes = graph.getNodes()
  const edges = graph.getEdges()
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: dir, nodesep: 16, ranksep: 16 })
  g.setDefaultEdgeLabel(() => ({}))

  const width = 260
  const height = 90
  nodes.forEach((node) => {
    g.setNode(node.id, { width, height })
  })

  edges.forEach((edge) => {
    const source = edge.getSource()
    const target = edge.getTarget()
    g.setEdge(source.cell, target.cell)
  })

  dagre.layout(g)

  g.nodes().forEach((id) => {
    const node = graph.getCellById(id) as Node
    if (node) {
      const pos = g.node(id)
      node.position(pos.x, pos.y)
    }
  })

  edges.forEach((edge) => {
    const source = edge.getSourceNode()!
    const target = edge.getTargetNode()!
    const sourceBBox = source.getBBox()
    const targetBBox = target.getBBox()

    if ((dir === 'LR' || dir === 'RL') && sourceBBox.y !== targetBBox.y) {
      const gap =
        dir === 'LR'
          ? targetBBox.x - sourceBBox.x - sourceBBox.width
          : -sourceBBox.x + targetBBox.x + targetBBox.width
      const fix = dir === 'LR' ? sourceBBox.width : 0
      const x = sourceBBox.x + fix + gap / 2
      edge.setVertices([
        { x, y: sourceBBox.center.y },
        { x, y: targetBBox.center.y },
      ])
    } else if (
      (dir === 'TB' || dir === 'BT') &&
      sourceBBox.x !== targetBBox.x
    ) {
      const gap =
        dir === 'TB'
          ? targetBBox.y - sourceBBox.y - sourceBBox.height
          : -sourceBBox.y + targetBBox.y + targetBBox.height
      const fix = dir === 'TB' ? sourceBBox.height : 0
      const y = sourceBBox.y + fix + gap / 2
      edge.setVertices([
        { x: sourceBBox.center.x, y },
        { x: targetBBox.center.x, y },
      ])
    } else {
      edge.setVertices([])
    }
  })
}

function createNode(rank: string, name: string, image: string) {
  return graph.createNode({
    shape: 'org-node',
    attrs: {
      '.image': { xlinkHref: image },
      '.rank': {
        text: Dom.breakText(rank, { width: 160, height: 45 }),
      },
      '.name': {
        text: Dom.breakText(name, { width: 160, height: 45 }),
      },
    },
  })
}

function createEdge(source: Cell, target: Cell) {
  return graph.createEdge({
    shape: 'org-edge',
    source: { cell: source.id },
    target: { cell: target.id },
  })
}

const nodes = [
  createNode('Founder & Chairman', 'Pierre Omidyar', male),
  createNode('President & CEO', 'Margaret C. Whitman', female),
  createNode('President, PayPal', 'Scott Thompson', male),
  createNode('President, Ebay Global Marketplaces', 'Devin Wenig', male),
  createNode('Senior Vice President Human Resources', 'Jeffrey S. Skoll', male),
  createNode('Senior Vice President Controller', 'Steven P. Westly', male),
]

const edges = [
  createEdge(nodes[0], nodes[1]),
  createEdge(nodes[1], nodes[2]),
  createEdge(nodes[1], nodes[3]),
  createEdge(nodes[1], nodes[4]),
  createEdge(nodes[1], nodes[5]),
]

graph.resetCells([...nodes, ...edges])
layout()
graph.zoomTo(0.8)
graph.centerContent()
setup()
