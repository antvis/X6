import { Graph, Node, Point } from '@antv/x6'

const nodes: Node.Metadata[] = []

for (let i = 1; i <= 20; i++) {
  nodes!.push({
    id: `${i}`,
    shape: 'path',
    width: 26,
    height: 26,
    attrs: {
      body: {
        d: 'M0,-9.898961565145173L2.222455340918111,-3.0589473502942863L9.41447190108659,-3.058947350294287L3.596008280084239,1.1684139180159865L5.818463621002351,8.008428132866873L4.440892098500626e-16,3.7810668645565997L-5.8184636210023495,8.008428132866873L-3.5960082800842383,1.1684139180159867L-9.41447190108659,-3.058947350294285L-2.2224553409181116,-3.058947350294286Z',
        fill: '#EFF4FF',
        stroke: '#5F95FF',
      },
    },
  })
}

function layout(nodes: Node.Metadata[]) {
  const cx = 320
  const cy = 180
  const rx = 200
  const ry = 120
  const ratio = rx / ry
  const center = new Point(cx, cy)
  const start = new Point(cx, cy - ry)
  const stepAngle = 360 / nodes.length

  nodes.forEach((node: Node.Metadata, index: number) => {
    const angle = stepAngle * index
    const p = start
      .clone()
      .rotate(-angle, center)
      .scale(ratio, 1, center)
      .round()
    node.x = p.x
    node.y = p.y
  })

  return nodes
}

const graph = new Graph({
  container: document.getElementById('container')!,
})

graph.fromJSON(layout(nodes))
