import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings.tsx'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 80,
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

    this.onChanged(defaults)
  }

  getText(args: State) {
    return `brightness(${args.amount})`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'brightness',
          args: { amount: args.amount },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="filter-brightness-app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
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
.filter-brightness-app {
  display: flex;
  padding: 0;
  padding: 16px 8px;
  font-family: sans-serif;
}
.filter-brightness-app .app-left {
  bottom: 0;
  width: 336px;
  padding: 0 8px;
}
.filter-brightness-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.filter-brightness-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.filter-brightness-app .ant-card-head-title {
  text-align: center;
}
.filter-brightness-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.filter-brightness-app .slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
`)
