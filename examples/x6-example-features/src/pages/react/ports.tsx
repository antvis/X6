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

    const sourceColor = Color.randomHex()
    const targetColor = Color.randomHex()
    const source = graph.addNode({
      shape: 'react-shape',
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
            <span id="1-in-port-1" key="in-port-1" magnet="true" />
            <span id="1-in-port-2" key="in-port-2" magnet="true" />
          </div>
          <div className="out-ports" key="out-ports">
            <span id="1-out-port-1" key="out-port-1" magnet="true" />
            <span id="1-out-port-2" key="out-port-2" magnet="true" />
          </div>
        </div>
      ),
    })

    const target = graph.addNode({
      shape: 'react-shape',
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
            <span id="2-in-port-1" key="in-port-1" magnet="true" />
            <span id="2-in-port-2" key="in-port-2" magnet="true" />
          </div>
          <div className="out-ports" key="out-ports">
            <span id="2-out-port-1" key="out-port-1" magnet="true" />
            <span id="2-out-port-2" key="out-port-2" magnet="true" />
          </div>
        </div>
      ),
    })

    graph.addEdge({
      source: { cell: source, selector: '[id="out-port-2"]' },
      target: { cell: target },
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
