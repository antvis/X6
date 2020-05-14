import React from 'react'
import { Graph, Node, Dom } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      background: {
        color: '#fff',
        image:
          'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Slack_colored_svg-32.png',
        repeat: 'watermark',
        opacity: 0.1,
      },
    })

    const rect = graph.addNode({
      type: 'basic.rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'rect',
    })

    console.log(rect)

    graph.addNode({
      type: 'basic.circle',
      x: 160,
      y: 30,
      label: 'circle',
    })

    graph.addNode({
      type: 'basic.ellipse',
      x: 240,
      y: 40,
      label: 'ellipse',
    })

    const rhombus = graph.addNode({
      type: 'basic.rhombus',
      x: 320,
      y: 30,
      attrs: {
        text: { text: 'rhombus', fontSize: 10 },
      },
    })

    console.log(rhombus)

    graph.addNode({
      type: 'basic.image',
      x: 400,
      y: 30,
      width: 40,
      height: 40,
      label: 'image',
      imageUrl: 'http://placehold.it/48x48',
      imageWidth: 48,
      imageHeight: 48,
    })

    const path = graph.addNode({
      type: 'basic.path',
      x: 450,
      y: 20,
      width: 40,
      height: 40,
      label: 'path',
      d:
        'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z',
    })

    console.log(path)

    graph.addNode({
      type: 'basic.text',
      x: 520,
      y: 40,
      width: 60,
      height: 30,
      label: 'text',
    })

    const DecoratedRect = Node.define({
      markup:
        '<g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g>',
      size: { width: 100, height: 60 },
      attrs: {
        rect: { fill: '#FFFFFF', stroke: 'black', width: 100, height: 60 },
        text: {
          fontSize: 14,
          text: '',
          refX: 0.5,
          refY: 0.5,
          ref: 'rect',
          yAlignment: 'middle',
          xAlignment: 'middle',
          fill: 'black',
        },
        image: {
          ref: 'rect',
          refX: 2,
          refY: 2,
          width: 16,
          height: 16,
        },
      },
    })

    const decoratedRect = new DecoratedRect({
      x: 40,
      y: 140,
      width: 180,
      height: 80,
      attrs: {
        text: { text: 'Decorated with image' },
        image: { 'xlink:href': 'http://placehold.it/16x16' },
      },
    })

    graph.addNode(decoratedRect)

    graph.addNode({
      type: 'basic.text-block',
      x: 280,
      y: 140,
      width: 220,
      height: 80,
      content:
        'Lorem ipsum dolor sit amet,\n consectetur adipiscing elit. Nulla vel porttitor est.',
    })

    const MyElementWithPorts = Node.define({
      markup: [
        '<g class="rotatable">',
        '<g class="scalable">',
        '<rect/>',
        '</g>',
        '<g class="inPorts">',
        '<g class="port1"><circle/><text/></g>',
        '<g class="port2"><circle/><text/></g>',
        '</g>',
        '<g class="outPorts">',
        '<g class="port3"><circle/><text/></g>',
        '<g class="port4"><circle/><text/></g>',
        '</g>',
        '</g>',
      ].join(''),
      attrs: {
        '.': {
          fill: '#ffffff',
          stroke: 'none',
          magnet: false,
        },
        rect: {
          width: 150,
          height: 250,
          stroke: 'black',
        },
        circle: {
          r: 5,
          magnet: true,
          stroke: 'black',
        },
        text: {
          fill: 'black',
          'pointer-events': 'none',
        },
        '.label': { text: 'Model', dx: 5, dy: 5 },
        '.inPorts text': { dx: -15, 'text-anchor': 'end' },
        '.outPorts text': { dx: 15 },
        '.inPorts circle': { fill: 'PaleGreen' },
        '.outPorts circle': { fill: 'Tomato' },
      },
    })

    const nodeWithPort = new MyElementWithPorts({
      x: 90,
      y: 300,
      width: 80,
      height: 80,
      attrs: {
        '.port1 text': { text: 'port1' },
        '.port2 text': { text: 'port2' },
        '.port3 text': { text: 'port3' },
        '.port4 text': { text: 'port4' },
        '.port1': { ref: 'rect', refY: 0.2 },
        '.port2': { ref: 'rect', refY: 0.4 },
        '.port3': { ref: 'rect', refY: 0.2, refDx: 0 },
        '.port4': { ref: 'rect', refY: 0.4, refDx: 0 },
      },
    })

    graph.addNode(nodeWithPort)

    const cylinder = graph.addNode({
      type: 'basic.cylinder',
      x: 305,
      y: 220,
      width: 180,
      height: 150,
      label: 'cylinder',
    })

    const cylinderView = graph.renderer.findViewByCell(cylinder)
    if (cylinderView) {
      const pathNode = cylinderView.findOne('path') as SVGPathElement
      const scalableNode = cylinderView.findOne('.scalable') as SVGGElement
      if (pathNode && scalableNode) {
        const ctm = scalableNode.getCTM()!.inverse()
        const token = Dom.createVector('circle', { r: 8, fill: 'red' })
        token.animateAlongPath(
          {
            dur: '4s',
            repeatCount: 'indefinite',
          },
          pathNode,
        )

        token.scale(ctm.a, ctm.d)
        token.appendTo(scalableNode)
      }
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
