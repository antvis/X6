import { Graph, Model } from '@antv/x6'

const data: Model.FromJSONData = {
  nodes: [],
  edges: [],
}

// 中心节点
const centerNode = {
  id: 'center',
  shape: 'circle',
  width: 50,
  height: 50,
  label: '核心',
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#5F95FF',
      strokeWidth: 2,
    },
    label: {
      fill: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
    },
  },
}
data.nodes!.push(centerNode)

// 第一层节点（内圈）
const innerNodes = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8']
innerNodes.forEach((label, index) => {
  data.nodes!.push({
    id: `inner-${index}`,
    shape: 'circle',
    width: 40,
    height: 40,
    label: label,
    attrs: {
      body: {
        stroke: '#5F95FF',
        fill: '#5F95FF',
        strokeWidth: 2,
      },
      label: {
        fill: '#fff',
        fontSize: 12,
      },
    },
  })
  // 连接到中心节点
  data.edges!.push({
    id: `edge-center-inner-${index}`,
    source: 'center',
    target: `inner-${index}`,
    attrs: {
      line: {
        stroke: '#d9d9d9',
        strokeWidth: 1,
      },
    },
  })
})

// 第二层节点（外圈）
const outerNodes = [
  'B1',
  'B2',
  'B3',
  'B4',
  'B5',
  'B6',
  'B7',
  'B8',
  'B9',
  'B10',
  'B11',
  'B12',
  'B13',
  'B14',
  'B15',
  'B16',
]
outerNodes.forEach((label, index) => {
  data.nodes!.push({
    id: `outer-${index}`,
    shape: 'circle',
    width: 30,
    height: 30,
    label: label,
    attrs: {
      body: {
        stroke: '#5F95FF',
        fill: '#5F95FF',
        strokeWidth: 2,
      },
      label: {
        fill: '#fff',
        fontSize: 10,
      },
    },
  })
})

const graph = new Graph({
  container: document.getElementById('container')!,
})

// 同心圆布局位置
const center = [400, 300]

// 设置各层节点的位置
const nodeMap = new Map(data.nodes!.map((node) => [node.id, node]))
const DEG_TO_RAD = Math.PI / 180
const INNER_RADIUS = 110
const OUTER_RADIUS = 260

const positionNodesOnCircle = (
  prefix: string,
  count: number,
  radius: number,
) => {
  for (let i = 0; i < count; i++) {
    const node = nodeMap.get(`${prefix}-${i}`)
    if (node) {
      const angle = ((i * 360) / count) * DEG_TO_RAD
      ;(node as any).x = center[0] + radius * Math.cos(angle)
      ;(node as any).y = center[1] + radius * Math.sin(angle)
    }
  }
}

// 中心节点
const centerNodeData = nodeMap.get('center')
if (centerNodeData) {
  ;(centerNodeData as any).x = center[0]
  ;(centerNodeData as any).y = center[1]
}

// 内层节点
positionNodesOnCircle('inner', innerNodes.length, INNER_RADIUS)

// 外层节点
positionNodesOnCircle('outer', outerNodes.length, OUTER_RADIUS)

// 渲染图形
graph.fromJSON(data)
