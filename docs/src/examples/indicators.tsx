import React from 'react'
import { Graph, DomEvent, CellStyle } from '../../../src'

export class Indicators extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const style: CellStyle = {
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
        x: 60, y: 60, width: 96, height: 96,
        data: 'Bottom Label',
        style: { ...style },
      })

      graph.addNode({
        data: 'Top Label', x: 240, y: 60, width: 96, height: 96,
        style: {
          ...style,
          indicatorShape: 'actor',
          indicatorColor: 'blue',
          verticalAlign: 'top',
          imageVerticalAlign: 'bottom',
        }
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        className="graph-container" />
    )
  }
}
