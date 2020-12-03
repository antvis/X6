import React from 'react'
import { Graph, Markup } from '@antv/x6'
import ReactDOM from 'react-dom'

class Label extends React.Component {
  onClick = () => {
    alert('clicked')
  }

  render() {
    return (
      <button
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          color: '#000',
          background: '#ffd591',
          border: '2px solid #ffa940',
          borderRadius: 4,
        }}
        onClick={this.onClick}
      >
        React Button
      </button>
    )
  }
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onEdgeLabelRendered: (args) => {
    const { selectors } = args
    const content = selectors.foContent as HTMLDivElement
    if (content) {
      ReactDOM.render(<Label />, content)
    }
  },
})

graph.addEdge({
  source: [170, 160],
  target: [550, 160],
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
  attrs: {
    line: {
      stroke: '#ccc',
    },
  },
})
