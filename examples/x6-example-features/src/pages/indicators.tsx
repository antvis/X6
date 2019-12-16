import React from 'react'
import { Graph, Style } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const style: Style = {
        shape: 'label',
        align: 'center',
        verticalAlign: 'bottom',
        indicatorShape: 'ellipse',
        indicatorWidth: 40,
        indicatorHeight: 40,
        indicatorColor: 'green',
        imageAlign: 'center',
        imageVerticalAlign: 'top',
        fill: 'none',
        stroke: 'none',
        spacing: 8,
      }

      graph.addNode({
        x: 60,
        y: 60,
        width: 96,
        height: 96,
        label: 'Bottom Label',
        style: { ...style },
      })

      graph.addNode({
        x: 240,
        y: 60,
        width: 96,
        height: 96,
        label: 'Top Label',
        style: {
          ...style,
          indicatorShape: 'actor',
          indicatorColor: 'blue',
          verticalAlign: 'top',
          imageVerticalAlign: 'bottom',
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
