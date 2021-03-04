import { Graph, Model } from '@antv/x6'
import { CircularLayout } from '@antv/layout'

const data: Model.FromJSONData = {
  nodes: [],
}

for (let i = 1; i <= 24; i++) {
  data.nodes!.push({
    id: `${i}`,
    shape: 'rect',
    width: 24,
    height: 24,
    label: '💜',
    attrs: {
      body: {
        stroke: 'transparent',
      },
    },
  })
}

const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
})

const circularLayout = new CircularLayout({
  type: 'circular',
  center: [350, 250],
})
const model = circularLayout.layout(data)

graph.fromJSON(model)
