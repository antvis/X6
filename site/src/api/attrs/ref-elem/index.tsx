import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

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
        ref: 'label',
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

    let typeToggle = true

    function type() {
      const full = 'Hello, World!'
      const delay = 1000
      const duration = 4000
      const steps = full.length - 1
      setTimeout(() => {
        let i = 1
        const step = Math.max(1, Math.floor(duration / steps))
        const timer = setInterval(() => {
          node.attr('label/text', full.substring(0, i + 1))
          i += 1
          if (i >= full.length) {
            clearInterval(timer)
          }
        }, step)
      }, delay)

      node.animate(
        {
          'outline/strokeDashoffset': 2.5,
        },
        {
          delay,
          duration,
          easing: 'linear',
          fill: 'none',
        },
      )

      typeToggle = false
    }

    function untype() {
      const full = 'Hello, World!'
      const delay = 1000
      const duration = 4000
      const steps = full.length - 1
      setTimeout(() => {
        let i = full.length
        const step = Math.max(1, Math.floor(duration / steps))
        const timer = setInterval(() => {
          i -= 1
          node.attr('label/text', full.substring(0, Math.max(1, i)))
          if (i <= 1) {
            clearInterval(timer)
          }
        }, step)
      }, delay)

      node.animate(
        {
          'outline/strokeDashoffset': 2.5,
        },
        {
          delay,
          duration,
          easing: 'linear',
          fill: 'none',
        },
      )

      typeToggle = true
    }

    type()

    node.on('animation:finish', () => {
      if (typeToggle) {
        type()
      } else {
        untype()
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-ref-elem-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
