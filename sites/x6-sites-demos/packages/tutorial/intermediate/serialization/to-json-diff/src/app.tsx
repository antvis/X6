import React from 'react'
import { Graph, Shape } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'
import './app.css'

hljs.registerLanguage('json', json)

Shape.Rect.config({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
})

Shape.Ellipse.config({
  x: 240,
  y: 180,
  width: 100,
  height: 40,
})

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

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
      label: 'Hello',
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    const target = graph.addNode({
      x: 240,
      y: 180,
      width: 100,
      height: 40,
      shape: 'ellipse',
      label: 'World',
    })

    graph.addEdge({
      source,
      target,
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(
        graph.toJSON({ diff: true }),
        null,
        2,
      )
      hljs.highlightBlock(this.code)
    }

    parse()

    graph.on('cell:change:*', parse)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refCode = (code: HTMLElement) => {
    this.code = code
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <pre>
            <code className="language-json" ref={this.refCode} />
          </pre>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
