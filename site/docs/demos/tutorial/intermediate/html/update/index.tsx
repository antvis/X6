import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Shape, Color } from '@antv/x6'

Shape.HTML.register({
  shape: 'custom-update-html',
  width: 160,
  height: 80,
  effect: ['data'],
  html(cell) {
    const { color } = cell.getData()
    const div = document.createElement('div')
    div.className = 'custom-html'
    div.style.background = color
    return div
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const node = graph.addNode({
      shape: 'custom-update-html',
      x: 60,
      y: 100,
      data: {
        color: '#333232',
      },
    })

    setInterval(() => {
      node.setData({
        color: Color.randomHex(),
      })
    }, 2000)

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="html-update-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.html-update-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.html-update-app .app-content {
  flex: 1;
  height: 240px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.html-update-app .custom-html {
  width: 100%;
  height: 100%;
  background: #333232;
  border-radius: 1em;
  box-shadow: 0 0.125em 0.3125em rgba(0, 0, 0, 0.25), 0 0.02125em 0.06125em rgba(0, 0, 0, 0.25);
  perspective: 600px;
}
.html-update-app .custom-html::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  background: #333232 linear-gradient(180deg, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.4));
  border-radius: 0 0 1em 1em;
  transform: rotateX(180deg);
  transform-origin: center top;
  transition: 0.7s ease-in-out transform;
  content: ' ';
}
.html-update-app .custom-html:hover::before {
  transform: rotateX(0);
}
`)
