import { Graph, Model } from '@antv/x6'
import { CircularLayout } from '@antv/layout'

const data: Model.FromJSONData = {
  nodes: [],
}

for (let i = 1; i <= 16; i++) {
  data.nodes!.push({
    id: `${i}`,
    shape: 'circle',
    width: 30,
    height: 30,
    label: `${i}`,
    attrs: {
      body: {
        stroke: 'transparent',
        fill: '#5F95FF',
      },
      label: {
        fill: '#fff',
      },
    },
  })
}

const graph = new Graph({
  container: document.getElementById('container')!,
})

const circularLayout = new CircularLayout({
  type: 'circular',
  center: [350, 250],
})
const model = circularLayout.layout(data)

graph.fromJSON(model)
