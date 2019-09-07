import React from 'react'
import { Graph, DomEvent, Image, Style } from '../../../src'

export class Images extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    const graph = new Graph(this.container, {
      backgroundImage: new Image(
        'https://gw.alipayobjects.com/mdn/rms_5cf9ec/afts/img/A*tgCPSLMZAr8AAAAAAAAAAABkARQnAQ',
        852, 480,
      ),
    })

    graph.batchUpdate(() => {
      graph.addNode({
        x: 600, y: 80, width: 128, height: 112,
        style: {
          shape: 'image',
          image: 'https://gw.alipayobjects.com/zos/basement_prod/3970a24b-4309-412d-8f08-89a8e0e24705.svg', // tslint:disable-line
        },
      })

      const style: Style = {
        shape: 'label',
        stroke: '#ccc',
        align: 'center',
        verticalAlign: 'bottom',
        imageAlign: 'center',
        imageVerticalAlign: 'top',
        image: 'https://gw.alipayobjects.com/zos/basement_prod/759f4922-517b-4e62-adea-5c431f049f47.svg', // tslint:disable-line
        imageWidth: 64,
        imageHeight: 64,
        spacing: 8,
        fontColor: '#fff',
        fill: 'none',
      }

      graph.addNode({
        data: 'Top',
        x: 60, y: 80, width: 128, height: 128,
        style: { ...style },
      })

      graph.addNode({
        data: 'Bottom',
        x: 60, y: 240, width: 128, height: 128,
        style: {
          ...style,
          imageVerticalAlign: 'bottom',
          verticalAlign: 'top',
        },
      })

      graph.addNode({
        data: 'Left',
        x: 240, y: 80, width: 128, height: 128,
        style: {
          ...style,
          align: 'right',
          verticalAlign: 'middle',
          imageAlign: 'left',
          imageVerticalAlign: 'middle',

        },
      })

      graph.addNode({
        data: 'Right',
        x: 240, y: 240, width: 128, height: 128,
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
    return (
      <div
        ref={this.refContainer}
        style={{ width: 852, height: 480 }}
        className="graph-container" />
    )
  }
}
