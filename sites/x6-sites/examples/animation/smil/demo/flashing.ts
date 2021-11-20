import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const polygon = graph.addNode({
  shape: 'polygon',
  x: 200,
  y: 140,
  width: 80,
  height: 80,
  points:
    '26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182',
  attrs: {
    body: {
      stroke: 'none',
    },
  },
})

const view = graph.findView(polygon)
if (view) {
  view.animate('polygon', {
    attributeType: 'XML',
    attributeName: 'fill',
    values: '#5F95FF;#EFF4FF',
    dur: '1s',
    repeatCount: 'indefinite',
  })
}
