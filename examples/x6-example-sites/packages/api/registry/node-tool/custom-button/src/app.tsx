import React from 'react'
import { Graph, Color } from '@antv/x6'
import { Button } from '@antv/x6/es/registry/tool/button'
import './app.css'

// tslint:disable-next-line
const MyButton = Button.define<Button.Options>({
  name: 'my-btn', // 工具名称，可省略，指定后其大驼峰形式同时作为继承的类的类名。
  markup: [
    {
      tagName: 'rect',
      selector: 'button',
      attrs: {
        width: 40,
        height: 20,
        rx: 4,
        ry: 4,
        fill: 'white',
        stroke: '#fe854f',
        'stroke-width': 2,
        cursor: 'pointer',
      },
    },
    {
      tagName: 'text',
      selector: 'text',
      textContent: 'btn',
      attrs: {
        fill: '#fe854f',
        'font-size': 10,
        'text-anchor': 'middle',
        'pointer-events': 'none',
        x: 20,
        y: 13,
      },
    },
  ],
  onClick({ view }: any) {
    const node = view.cell
    const fill = Color.random()
    node.attr({
      body: {
        fill,
      },
      label: {
        fill: Color.invert(fill, true),
      },
    })
  },
})

Graph.registerNodeTool('my-btn', MyButton, true)

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
      width: 120,
      height: 60,
      label: 'Source',
      tools: [
        {
          name: 'my-btn',
          args: {
            x: '100%',
            y: '100%',
            offset: { x: -44, y: -24 },
          },
        },
      ],
    })

    const target = graph.addNode({
      x: 120,
      y: 160,
      width: 120,
      height: 60,
      label: 'Target',
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
