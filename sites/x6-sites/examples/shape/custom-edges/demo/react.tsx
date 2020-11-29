import React from 'react'
import { Graph, Markup } from '@antv/x6'
import ReactDOM from 'react-dom'

class MyComponent extends React.Component {
  render() {
    return (
      <button
        style={{
          color: '#fff',
          width: '200px',
          height: '40px',
          textAlign: 'center',
          lineHeight: '40px',
          background: '#000',
          border: 'none',
        }}
      >
        React Button
      </button>
    )
  }
}

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
      ReactDOM.render(<MyComponent />, content)
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
