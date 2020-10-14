import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { Graph, Dom } from '@antv/x6'
import 'antd/dist/antd.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onEdgeLabelRendered: (args) => {
        const { label, container } = args
        const data = label.data
        if (data) {
          const content = this.appendForeignObject(container)
          if (data === 1) {
            const txt = document.createTextNode('text node')
            content.style.border = '1px solid #f0f0f0'
            content.style.borderRadius = '4px'
            content.appendChild(txt)
          } else if (data === 2) {
            const btn = document.createElement('button')
            btn.appendChild(document.createTextNode('HTML Button'))
            btn.style.height = '30px'
            btn.style.lineHeight = '1'
            btn.addEventListener('click', () => {
              alert('clicked')
            })
            content.appendChild(btn)
          } else if (data === 3) {
            ReactDOM.render(<Button size="small">Antd Button</Button>, content)
          }
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 480, y: 40 },
      label: { attrs: { text: { text: 'Hello' } } },
    })

    graph.addEdge({
      source: { x: 40, y: 100 },
      target: { x: 480, y: 100 },
      label: { position: 0.25, data: 1 },
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 480, y: 160 },
      labels: [
        { position: 0.25, data: 2 },
        { position: 0.75, data: 3 },
      ],
    })
  }

  appendForeignObject(container: Element): HTMLDivElement {
    const fo = Dom.createSvgElement('foreignObject')
    const body = Dom.createElementNS<HTMLBodyElement>('body', Dom.ns.xhtml)
    const content = Dom.createElementNS<HTMLDivElement>('div', Dom.ns.xhtml)

    fo.setAttribute('width', '120')
    fo.setAttribute('height', '30')
    fo.setAttribute('x', '-60')
    fo.setAttribute('y', '-15')

    body.setAttribute('xmlns', Dom.ns.xhtml)
    body.style.width = '100%'
    body.style.height = '100%'
    body.style.padding = '0'
    body.style.margin = '0'

    content.style.width = '100%'
    content.style.height = '100%'
    content.style.textAlign = 'center'
    content.style.lineHeight = '30px'

    body.appendChild(content)
    fo.appendChild(body)
    container.appendChild(fo)

    return content
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
