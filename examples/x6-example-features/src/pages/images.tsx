import React from 'react'
import { Graph, Style } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      graph.addNode({
        x: 600,
        y: 80,
        width: 128,
        height: 112,
        style: {
          shape: 'image',
          image:
            'https://gw.alipayobjects.com/zos/basement_prod/3970a24b-4309-412d-8f08-89a8e0e24705.svg', // tslint:disable-line
        },
      })

      const style: Style = {
        shape: 'label',
        stroke: '#ccc',
        align: 'center',
        verticalAlign: 'bottom',
        imageAlign: 'center',
        imageVerticalAlign: 'top',
        image:
          'https://gw.alipayobjects.com/zos/basement_prod/759f4922-517b-4e62-adea-5c431f049f47.svg', // tslint:disable-line
        imageWidth: 64,
        imageHeight: 64,
        spacing: 8,
        fill: 'none',
      }

      graph.addNode({
        data: 'Top\nTop',
        x: 60,
        y: 80,
        width: 128,
        height: 128,
        style: { ...style },
      })

      graph.addNode({
        data: 'Bottom\nBottom',
        x: 60,
        y: 240,
        width: 128,
        height: 128,
        style: {
          ...style,
          imageVerticalAlign: 'bottom',
          verticalAlign: 'top',
        },
      })

      graph.addNode({
        data: 'Left\nLeft',
        x: 240,
        y: 80,
        width: 128,
        height: 128,
        style: {
          ...style,
          align: 'right',
          verticalAlign: 'middle',
          imageAlign: 'left',
          imageVerticalAlign: 'middle',
        },
      })

      graph.addNode({
        data: 'Right\nRight',
        x: 240,
        y: 240,
        width: 128,
        height: 128,
        style: {
          ...style,
          align: 'left',
          verticalAlign: 'middle',
          imageAlign: 'right',
          imageVerticalAlign: 'middle',
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
