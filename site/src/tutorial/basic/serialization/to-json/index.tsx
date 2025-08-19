import React from 'react'
import { Graph } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'
import './index.less'

hljs.registerLanguage('json', json)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private code: HTMLElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
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
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      label: 'X6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    const parse = () => {
      this.code.innerText = JSON.stringify(graph.toJSON(), null, 2)
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
      <div className="to-json-app">
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
