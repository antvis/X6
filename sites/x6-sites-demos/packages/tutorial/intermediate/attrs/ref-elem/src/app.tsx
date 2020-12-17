import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

Graph.registerNode(
  'custom-text',
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
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'rect',
        selector: 'outline',
      },
    ],
    attrs: {
      label: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 48,
      },
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
        ref: 'label',
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
      shape: 'custom-text',
      x: 320,
      y: 160,
      width: 280,
      height: 120,
      attrs: {
        label: {
          text: 'H',
        },
        e: {
          ref: 'label',
          refRx: '50%',
          refRy: '25%',
          refCx: '50%',
          refCy: 0,
          refX: '-50%',
          refY: '25%',
        },
        r: {
          ref: 'label',
          refX: '100%',
          refY: '100%',
          x: -10,
          y: -10,
          refWidth: '50%',
          refHeight: '50%',
        },
        c: {
          ref: 'label',
          refRCircumscribed: '50%',
        },
      },
    })

    let currentTransitions = 0
    let typeToggle = true

    function type() {
      node.transition('attrs/label/text', 'Hello, World!', {
        delay: 1000,
        duration: 4000,
        interp(start, end) {
          return function (time) {
            return start + end.substr(1, Math.ceil(end.length * time))
          }
        },
      })

      typeToggle = false
    }

    function untype() {
      node.transition('attrs/label/text', 'H', {
        delay: 1000,
        duration: 4000,
        timing(time) {
          return 1 - time
        },
        interp(start, end) {
          return function (time) {
            return end + start.substr(1, Math.ceil(start.length * time))
          }
        },
      })

      typeToggle = true
    }

    type()

    node.on('transition:start', () => {
      currentTransitions += 1
    })

    node.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (typeToggle) {
          type()
        } else {
          untype()
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
