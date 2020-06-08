import React from 'react'
import { Graph, Color } from '@antv/x6'
import '@antv/x6-react-shape'
import '../index.less'
import './ports.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
    })

    const sourceColor = Color.random()
    const targetColor = Color.random()
    const source = graph.addNode({
      type: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      attrs: {
        '.': {
          magnet: false,
        },
      },
      component: (
        <div
          className="react-shape-ports"
          style={{
            color: Color.invert(sourceColor, true),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '60px',
            background: sourceColor,
          }}
        >
          <div key="text">Source</div>
          <div className="in-ports" key="in-ports">
            <span key="port-1" magnet="true" />
            <span key="port-2" magnet="true" />
          </div>
          <div className="out-ports" key="out-ports">
            <span key="port-1" magnet="true" />
            <span key="port-2" magnet="true" />
          </div>
        </div>
      ),
    })

    const target = graph.addNode({
      type: 'react-shape',
      x: 320,
      y: 320,
      width: 160,
      height: 60,
      component: (
        <div
          className="react-shape-ports"
          style={{
            color: Color.invert(targetColor, true),
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '60px',
            background: targetColor,
          }}
        >
          <div key="text">Target</div>
          <div className="in-ports" key="in-ports">
            <span key="port-1" magnet="true" />
            <span key="port-2" magnet="true" />
          </div>
          <div className="out-ports" key="out-ports">
            <span key="port-1" magnet="true" />
            <span key="port-2" magnet="true" />
          </div>
        </div>
      ),
    })

    graph.addEdge({
      type: 'edge',
      source,
      target,
    })
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
