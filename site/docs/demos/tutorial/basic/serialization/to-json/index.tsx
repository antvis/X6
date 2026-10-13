import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'


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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
/*

github.com style (c) Vasily Polovnyov <vast@whiteants.net>

*/
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
}
.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}
.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: bold;
}
.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #008080;
}
.hljs-string,
.hljs-doctag {
  color: #d14;
}
.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #900;
  font-weight: bold;
}
.hljs-subst {
  font-weight: normal;
}
.hljs-type,
.hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}
.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #000080;
  font-weight: normal;
}
.hljs-regexp,
.hljs-link {
  color: #009926;
}
.hljs-symbol,
.hljs-bullet {
  color: #990073;
}
.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}
.hljs-meta {
  color: #999;
  font-weight: bold;
}
.hljs-deletion {
  background: #fdd;
}
.hljs-addition {
  background: #dfd;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
.to-json-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.to-json-app .app-side {
  width: 320px;
  height: 280px;
  overflow: auto;
}
.to-json-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

@media (max-width: 640px) {
  .to-json-app {
    flex-wrap: wrap;
    height: auto;
  }
  .to-json-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .to-json-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
