import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

Graph.registerNode(
  'custom-node',
  {
    width: 200,
    height: 60,
    attrs: {
      body: {
        stroke: '#5F95FF',
        strokeWidth: 1,
        fill: 'rgba(95,149,255,0.05)',
        refWidth: 1,
        refHeight: 1,
      },
      image: {
        'xlink:href':
          'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        width: 16,
        height: 16,
        x: 12,
        y: 12,
      },
      title: {
        text: 'Node',
        refX: 40,
        refY: 14,
        fill: 'rgba(0,0,0,0.85)',
        fontSize: 12,
        'text-anchor': 'start',
      },
      text: {
        text: 'this is content text',
        refX: 40,
        refY: 38,
        fontSize: 12,
        fill: 'rgba(0,0,0,0.6)',
        'text-anchor': 'start',
      },
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'image',
      },
      {
        tagName: 'text',
        selector: 'title',
      },
      {
        tagName: 'text',
        selector: 'text',
      },
    ],
  },
  true,
)

export class AnimateTransformExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const rect1 = graph.addNode({
      shape: 'custom-node',
      x: 40,
      y: 40,
    })

    const view1 = graph.findView(rect1)

    view1?.on('view:render', () => {
      view1.animateTransform('image', {
        attributeType: 'XML',
        attributeName: 'transform',
        type: 'rotate',
        from: '0 20 20',
        to: '360 20 20',
        dur: '3s',
        repeatCount: 'indefinite',
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ height: 500 }}>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
