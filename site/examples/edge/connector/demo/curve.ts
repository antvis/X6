import { Graph, Path, Transform } from '@antv/x6'

const degreesToRadians = (degrees) => degrees * (Math.PI / 180)
const transCanvasAngleToRos = (angle) => angle - 90

const calcPoint = (p) => {
  const distance = 10
  const theta = degreesToRadians(transCanvasAngleToRos(p.angle))
  const x = p.x + distance * Math.cos(theta)
  const y = p.y + distance * Math.sin(theta)
  return { x, y }
}

const calcIntersectionPoint = (points) => {
  const [p1, p2] = points
  const p11 = calcPoint(p1)
  const p22 = calcPoint(p2)
  const d1 = (p1.x - p11.x) * (p2.y - p22.y)
  const d2 = (p1.y - p11.y) * (p2.x - p22.x)
  const d = d1 - d2

  if (d === 0) {
    return { x: p1.x, y: p1.y }
  }

  const u1 = p1.x * p11.y - p1.y * p11.x
  const u4 = p2.x * p22.y - p2.y * p22.x

  const u2x = p2.x - p22.x
  const u3x = p1.x - p11.x
  const u2y = p2.y - p22.y
  const u3y = p1.y - p11.y

  const px = (u1 * u2x - u3x * u4) / d
  const py = (u1 * u2y - u3y * u4) / d

  const p = { x: px, y: py }

  return p
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  connecting: {
    anchor: 'nodeCenter',
    connectionPoint: 'anchor',
  },
})
graph.use(
  new Transform({
    rotating: {
      enabled: true,
    },
  }),
)

Graph.registerConnector(
  'curve',
  (sourcePoint, targetPoint) => {
    const path = new Path()
    path.appendSegment(Path.createSegment('M', sourcePoint))
    // 基于方向获取控制点
    const controlPoint = calcIntersectionPoint([
      {
        ...sourcePoint,
        angle: graph.getNodesFromPoint(sourcePoint)[0].getAngle(),
      },
      {
        ...targetPoint,
        angle: graph.getNodesFromPoint(targetPoint)[0].getAngle(),
      },
    ])
    // 基于控制点生成二次贝塞尔曲线
    path.appendSegment(path.quadTo(controlPoint, targetPoint))
    return path.serialize()
  },
  true,
)

graph.addNode({
  id: 'source',
  x: 120,
  y: 40,
  angle: 0,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

graph.addNode({
  id: 'target',
  x: 400,
  y: 260,
  angle: 0,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

graph.addEdge({
  source: 'source',
  target: 'target',
  connector: { name: 'curve' },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
