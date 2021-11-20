import { Graph, Vector } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
})

const path = graph.addNode({
  shape: 'path',
  x: 100,
  y: 200,
  width: 400,
  height: 80,
  path: 'M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z',
  attrs: {
    body: {
      fill: '#EFF4FF',
      stroke: '#5F95FF',
    },
  },
})

const view = graph.findViewByCell(path)
if (view) {
  const path = view.findOne('path') as SVGPathElement
  if (path) {
    const token = Vector.create('circle', {
      r: 6,
      fill: '#5F95FF',
    })
    token.animateAlongPath(
      {
        dur: '5s',
        repeatCount: 'indefinite',
      },
      path,
    )
    token.appendTo(path.parentNode as SVGGElement)
  }
}
