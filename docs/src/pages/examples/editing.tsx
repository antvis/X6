import React from 'react'
import { Graph } from '../../../../src'

export default class Editing extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container, {
      convertDataToString(cell) {
        const data = cell.getData()
        if (typeof data === 'object') {
          return data.label
        }
      },
      getLabel(cell) {
        const data = cell.getData()
        const span = document.createElement('span')
        span.style.color = 'red'
        span.innerText = data.label
        return span
      },
      putLabel(cell, label) {
        const data = cell.getData()
        if (typeof data === 'object') {
          data.label = label
          return label
        }
      },
    })

    graph.batchUpdate(() => {
      graph.addNode({
        data: { label: 'Hello' },
        x: 60,
        y: 60,
        width: 120,
        height: 80,
        style: {
        },
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
