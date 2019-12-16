import React from 'react'
import { Graph, Style } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const style: Style = {
        shape: 'image',
        image:
          'https://gw.alipayobjects.com/zos/basement_prod/759f4922-517b-4e62-adea-5c431f049f47.svg', // tslint:disable-line
      }
      graph.addNode({
        x: 60,
        y: 40,
        width: 80,
        height: 80,
        label: 'Bottom',
        style: {
          ...style,
          labelVerticalPosition: 'bottom',
          verticalAlign: 'top',
        },
      })

      graph.addNode({
        x: 240,
        y: 40,
        width: 80,
        height: 80,
        label: 'Top',
        style: {
          ...style,
          labelVerticalPosition: 'top',
          verticalAlign: 'bottom',
        },
      })

      graph.addNode({
        x: 60,
        y: 160,
        width: 80,
        height: 80,
        label: 'Left',
        style: {
          ...style,
          labelPosition: 'left',
          align: 'right',
        },
      })

      graph.addNode({
        x: 240,
        y: 160,
        width: 80,
        height: 80,
        label: 'Right',
        style: {
          ...style,
          labelPosition: 'right',
          align: 'left',
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
