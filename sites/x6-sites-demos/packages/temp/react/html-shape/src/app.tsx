import React from 'react'
import { Graph } from '@antv/x6'
import '@antv/x6-react-shape'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      shape: 'html',
      html() {
        const wrap = document.createElement('div')
        wrap.style.width = '100%'
        wrap.style.height = '100%'
        wrap.style.background = '#f0f0f0'
        wrap.style.display = 'flex'
        wrap.style.justifyContent = 'center'
        wrap.style.alignItems = 'center'

        wrap.innerText = 'Hello'

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
    wrap.innerText = 'World'

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      shape: 'html',
      html: wrap,
    })

    graph.addEdge({
      source,
      target,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
