import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { Graph, Dom } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      onEdgeLabelRendered: (args) => {
        console.log(args)
        const { label, container, selectors } = args
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
        } else {
          // 通过 selectors 拿到自定义的 Markup 中的容器元素
          console.log(selectors)
          const content = selectors.content as HTMLDivElement
          if (content) {
            content.style.display = 'flex'
            content.style.alignItems = 'center'
            content.style.justifyContent = 'center'
            ReactDOM.render(<Button size="small">Antd Button</Button>, content)
          }
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 480, y: 40 },
      // 使用默认 markup
      label: { position: 0.25, data: 1 },
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 480, y: 160 },
      // 使用默认 markup
      labels: [
        { position: 0.25, data: 2 },
        { position: 0.75, data: 3 },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 280 },
      target: { x: 480, y: 280 },
      label: {
        // 自定义 markup
        markup: {
          tagName: 'foreignObject',
          selector: 'fo',
          children: [
            {
              ns: Dom.ns.xhtml,
              tagName: 'body',
              selector: 'foBody',
              attrs: {
                xmlns: Dom.ns.xhtml,
              },
              style: {
                width: '100%',
                height: '100%',
              },
              children: [
                {
                  tagName: 'div',
                  selector: 'content',
                  style: {
                    width: '100%',
                    height: '100%',
                  },
                },
              ],
            },
          ],
        },
        attrs: {
          fo: {
            width: 120,
            height: 30,
            x: -60,
            y: -15,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 40, y: 400 },
      target: { x: 480, y: 400 },
      defaultLabel: {
        // 自定义 markup
        markup: {
          tagName: 'foreignObject',
          selector: 'fo',
          children: [
            {
              ns: Dom.ns.xhtml,
              tagName: 'body',
              selector: 'foBody',
              attrs: {
                xmlns: Dom.ns.xhtml,
              },
              style: {
                width: '100%',
                height: '100%',
              },
              children: [
                {
                  tagName: 'div',
                  selector: 'content',
                  style: {
                    width: '100%',
                    height: '100%',
                  },
                },
              ],
            },
          ],
        },
        attrs: {
          fo: {
            width: 120,
            height: 30,
            x: -60,
            y: -15,
          },
        },
      },
      label: { position: 0.25 },
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
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
