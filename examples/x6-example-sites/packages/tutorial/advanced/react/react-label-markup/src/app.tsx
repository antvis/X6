import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from 'antd'
import { Graph, Markup } from '@antv/x6'
import 'antd/dist/antd.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onEdgeLabelRendered: (args) => {
        console.log(args)
        const { selectors } = args

        const content = selectors.foContent as HTMLDivElement
        if (content) {
          content.style.display = 'flex'
          content.style.alignItems = 'center'
          content.style.justifyContent = 'center'
          ReactDOM.render(<Button size="small">Antd Button</Button>, content)
        }
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 480, y: 40 },
      label: {
        markup: Markup.getForeignObjectMarkup(),
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
      source: { x: 40, y: 100 },
      target: { x: 480, y: 100 },
      defaultLabel: {
        markup: Markup.getForeignObjectMarkup(),
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
