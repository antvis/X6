import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

const data: any = {
  hello: {
    id: 'hello',
    x: 32,
    y: 32,
    width: 100,
    height: 40,
    label: 'Hello',
  },
  world: {
    id: 'world',
    shape: 'circle',
    x: 160,
    y: 180,
    width: 60,
    height: 60,
    label: 'World',
  },
  rect: {
    id: 'rect',
    x: -60,
    y: 100,
    width: 100,
    height: 40,
    label: 'Rect',
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.renderGraph()
  }

  renderGraph(options: State | null = null) {
    let offset
    if (this.graph) {
      offset = this.graph.getScrollbarPosition()
      this.graph.dispose()
    }

    const graph = new Graph({
      container: this.container,
      grid: { visible: true },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
        ...options,
      },
    })

    graph.fromJSON({ nodes: Object.keys(data).map((key) => data[key]) })

    graph.on('node:change:position', ({ node, current }) => {
      const item = data[node.id]
      item.x = current!.x
      item.y = current!.y
    })

    if (offset) {
      graph.setScrollbarPosition(offset.left, offset.top)
    } else {
      graph.center()
    }

    this.graph = graph
  }

  onSettingsChanged = (options: State) => {
    this.renderGraph(options)
  }

  onCenter = () => {
    this.graph.center()
  }

  onCenterContent = () => {
    this.graph.centerContent()
  }

  onCenterCircle = () => {
    const circle = this.graph.getCellById('world')
    if (circle) {
      this.graph.centerCell(circle)
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
        </div>
        <div className="app-main">
          <div className="app-btns">
            <Button onClick={this.onCenter}>Center Graph</Button>
            <Button onClick={this.onCenterContent}>Center Whole Content</Button>
            <Button onClick={this.onCenterCircle}>Center The Circle</Button>
          </div>
          <div className="app-content" ref={this.refContainer} />
        </div>
      </div>
    )
  }
}
