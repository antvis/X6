import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

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
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(255,0,0,0.3)',
      },
      r: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,255,0,0.3)',
      },
      c: {
        strokeWidth: 1,
        stroke: '#000000',
        fill: 'rgba(0,0,255,0.3)',
      },
      outline: {
        refX: 0,
        refY: 0,
        refWidth: '100%',
        refHeight: '100%',
        strokeWidth: 1,
        stroke: '#000000',
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
      grid: true,
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
    let currentTransitions = 0

    function contract() {
      node.transition(
        'size',
        { width: 40, height: 40 },
        {
          delay: 1000,
          duration: 4000,
          interp: Interp.object,
        },
      )

      node.transition(
        'position',
        { x: 280, y: 130 },
        {
          delay: 1000,
          duration: 4000,
          interp: Interp.object,
        },
      )

      stretchToggle = true
    }

    function stretch() {
      node.transition(
        'size',
        { width: 280, height: 120 },
        {
          delay: 1000,
          duration: 4000,
          interp: Interp.object,
        },
      )

      node.transition(
        'position',
        { x: 160, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          interp: Interp.object,
        },
      )

      stretchToggle = false
    }

    stretch()

    node.on('transition:start', () => {
      currentTransitions += 1
    })

    node.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (stretchToggle) {
          stretch()
        } else {
          contract()
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
