import { Graph, Markup } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement
    if (content) {
      content.style.display = 'flex'
      content.style.alignItems = 'center'
      content.style.justifyContent = 'center'
      const btn = document.createElement('button')
      btn.appendChild(document.createTextNode('HTML Button'))
      btn.style.height = '30px'
      btn.style.lineHeight = '1'
      btn.addEventListener('click', () => {
        alert('clicked')
      })
      content.appendChild(btn)
    }
  },
})

graph.addEdge({
  source: {
    x: 40,
    y: 200,
  },
  target: {
    x: 480,
    y: 200,
  },
  defaultLabel: {
    markup: Markup.getForeignObjectMarkup(),
    attrs: {
      fo: {
        width: 120,
        height: 30,
        x: 60,
        y: -15,
      },
    },
  },
  label: {
    position: 0.25,
  },
})
