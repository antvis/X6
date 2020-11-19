import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  grid: true,
})

const source = graph.addNode({
  shape: 'html',
  x: 80,
  y: 80,
  width: 160,
  height: 60,
  html: () => {
    const wrap = document.createElement('div')
    wrap.style.width = '100%'
    wrap.style.height = '100%'
    wrap.style.background = '#f0f0f0'
    wrap.style.display = 'flex'
    wrap.style.justifyContent = 'center'
    wrap.style.alignItems = 'center'

    wrap.innerText = 'hello'

    return wrap
  },
})

const wrap = document.createElement('div')
wrap.style.width = '100%'
wrap.style.height = '100%'
wrap.style.background = '#f0f0f0'
wrap.style.display = 'flex'
wrap.style.justifyContent = 'center'
wrap.style.alignItems = 'center'

wrap.innerText = 'world'

const target = graph.addNode({
  shape: 'html',
  x: 320,
  y: 320,
  width: 160,
  height: 60,
  html: wrap,
})

graph.addEdge({
  source,
  target,
})
