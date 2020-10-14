import React from 'react'
import ReactDOM from 'react-dom'
import { Tooltip } from 'antd'
import { Graph, Markup } from '@antv/x6'
import 'antd/dist/antd.css'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      onPortRendered(args) {
        const selectors = args.contentSelectors
        const container = selectors && selectors.foContent
        if (container) {
          ReactDOM.render(
            (
              <Tooltip title="port">
                <div className="my-port" />
              </Tooltip>
            ) as any,
            container as HTMLElement,
          )
        }
      },
    })

    graph.addNode({
      x: 40,
      y: 35,
      width: 160,
      height: 30,
      label: 'Hello',
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#108ee9',
          fill: '#fff',
          rx: 5,
          ry: 5,
        },
      },
      portMarkup: [Markup.getForeignObjectMarkup()],
      ports: {
        items: [
          { group: 'in', id: 'in1' },
          { group: 'in', id: 'in2' },
          { group: 'out', id: 'out1' },
          { group: 'out', id: 'out2' },
        ],
        groups: {
          in: {
            position: { name: 'top' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
            },
            zIndex: 1,
          },
          out: {
            position: { name: 'bottom' },
            attrs: {
              fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
            },
            zIndex: 1,
          },
        },
      },
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
