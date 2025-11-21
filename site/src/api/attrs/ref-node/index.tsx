import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

Graph.registerNode(
  'custom-rect',
  {
    markup: [
      {
        tagName: 'ellipse',
        selector: 'e',
      },
      {
        tagName: 'rect',
        selector: 'r',
      },
      {
        tagName: 'circle',
        selector: 'c',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      e: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        strokeDasharray: '5 5',
        strokeDashoffset: 2.5,
        fill: 'none',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const node = graph.addNode({
      shape: 'custom-rect',
      x: 160,
      y: 100,
      width: 280,
      height: 120,
      attrs: {
        e: {
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          refX: '100%',
          refY: '100%',
          refWidth: '50%',
          refHeight: '50%',
          x: -10, // additional x offset
          y: -10, // additional y offset
        },
        c: {
          refRCircumscribed: '50%',
          refCx: '50%',
          refCy: '50%',
        },
      },
    })

    let stretchToggle = false

    function contract() {
      node.animate(
        {
          'size/width': 40,
          'size/height': 40,
          'position/x': 280,
          'position/y': 130,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      stretchToggle = true
    }

    function stretch() {
      node.animate(
        {
          'size/width': 280,
          'size/height': 120,
          'position/x': 160,
          'position/y': 100,
        },
        {
          delay: 1000,
          duration: 2000,
          direction: 'alternate',
          iterations: 2,
          easing: 'linear',
          fill: 'none',
        },
      )

      stretchToggle = false
    }

    stretch()

    node.on('animation:finish', () => {
      if (stretchToggle) {
        stretch()
      } else {
        contract()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-ref-node-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
