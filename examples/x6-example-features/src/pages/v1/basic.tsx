import React from 'react'
import { v, v1 } from '@antv/x6'
import '../index.less'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new v1.Graph({
      container: this.container,
      background: {
        // color: '#f5f5f5',
        image:
          'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Slack_colored_svg-32.png',
        repeat: 'watermark',
        opacity: 0.1,
      },
    })

    graph.addNode({
      type: 'basic.rect',
      size: { width: 100, height: 40 },
      position: { x: 40, y: 40 },
      attrs: {
        text: { text: 'rect' },
      },
    })

    graph.addNode({
      type: 'basic.circle',
      position: { x: 160, y: 30 },
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
      type: 'basic.rhombus',
      position: { x: 320, y: 30 },
      attrs: {
        text: { text: 'rhombus', fontSize: 10 },
      },
    })

    graph.addNode({
      type: 'basic.image',
      size: { width: 40, height: 40 },
      position: { x: 400, y: 30 },
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
      position: { x: 450, y: 20 },
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
      type: 'basic.text',
      position: { x: 520, y: 40 },
      size: { width: 60, height: 30 },
      attrs: {
        text: { text: 'text' },
      },
    })

    const DecoratedRect = v1.Node.define({
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
      position: { x: 40, y: 140 },
      size: { width: 180, height: 80 },
      attrs: {
        text: { text: 'Decorated with image' },
        image: { 'xlink:href': 'http://placehold.it/16x16' },
      },
    })

    graph.addNode(decoratedRect)

    graph.addNode({
      type: 'basic.text-block',
      position: { x: 280, y: 140 },
      size: { width: 220, height: 80 },
      content:
        'Lorem ipsum dolor sit amet,\n consectetur adipiscing elit. Nulla vel porttitor est.',
    })

    const MyElementWithPorts = v1.Node.define({
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

    graph.addNode(
      new MyElementWithPorts({
        position: { x: 90, y: 300 },
        size: { width: 80, height: 80 },
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
      }),
    )

    const cylinder = graph.addNode({
      type: 'basic.cylinder',
      position: { x: 305, y: 220 },
      size: { width: 180, height: 150 },
      attrs: {
        text: { text: 'cylinder' },
      },
    })

    const cylinderView = graph.findViewByCell(cylinder)
    if (cylinderView) {
      const cylinderPath = cylinderView.findOne('path') as SVGPathElement
      const cylinderScalable = cylinderView.findOne('.scalable') as SVGGElement
      if (cylinderPath && cylinderScalable) {
        var ctm = cylinderScalable.getCTM()!.inverse()
        const token = v.create('circle', { r: 8, fill: 'red' })
        token.animateAlongPath(
          {
            dur: '4s',
            repeatCount: 'indefinite',
          },
          cylinderPath,
        )

        token.scale(ctm.a, ctm.d)
        token.appendTo(cylinderScalable)
      }
    }

    console.log(graph.model.toJSON())
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
