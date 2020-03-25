import React from 'react'
import { joint } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({ container: this.container })
    const rect = graph.addNode({
      size: { width: 100, height: 40 },
      position: { x: 32, y: 40 },
      attrs: {
        text: { text: 'rect' },
      },
    })

    rect.setAttrByPath('rect/fill', 'red')

    graph.addNode({
      type: 'basic.circle',
      position: { x: 160, y: 40 },
      attrs: {
        text: { text: 'circle' },
      },
    })

    graph.addNode({
      type: 'basic.ellipse',
      position: { x: 240, y: 40 },
      attrs: {
        text: { text: 'ellipse' },
      },
    })

    graph.addNode({
      type: 'basic.text',
      position: { x: 170, y: 120 },
      size: { width: 60, height: 30 },
      attrs: {
        text: { text: 'text' },
      },
    })

    graph.addNode({
      type: 'basic.rhombus',
      position: { x: 320, y: 40 },
      attrs: {
        text: { text: 'rhombus', fontSize: 10 },
      },
    })

    graph.addNode({
      type: 'basic.image',
      size: { width: 40, height: 40 },
      position: { x: 450, y: 50 },
      attrs: {
        text: { text: 'image' },
        image: {
          'xlink:href': 'http://placehold.it/48x48',
          width: 48,
          height: 48,
        },
      },
    })

    graph.addNode({
      type: 'basic.path',
      position: { x: 50, y: 120 },
      size: { width: 40, height: 40 },
      attrs: {
        path: {
          d:
            'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z',
        },
        text: { text: 'path' },
      },
    })

    graph.addNode({
      type: 'basic.text-block',
      position: { x: 400, y: 150 },
      size: { width: 180, height: 100 },
      content:
        'Lorem ipsum dolor sit amet,\n consectetur adipiscing elit. Nulla vel porttitor est.',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
