import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import '@antv/x6-react-shape'
import '../index.less'

class MyComponent extends React.Component<{ node?: Node; text: string }> {
  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  render() {
    const color = Color.randomHex()
    return (
      <div
        // onMouseDown={() => {
        //   console.log('div')
        // }}
        style={{
          color: Color.invert(color, true),
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '60px',
          background: color,
        }}
      >
        {this.props.text}
      </div>
    )
  }
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      selecting: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
    })

    graph.bindKey('backspace', () => {
      graph.removeCells(graph.getSelectedCells())
    })

    const source = graph.addNode({
      shape: 'react-shape',
      x: 80,
      y: 80,
      width: 160,
      height: 60,
      data: {},
      xxx: {},
      component: <MyComponent text="Source" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 320,
      y: 320,
      width: 180,
      height: 80,
      component: (node) => {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid #eee',
              padding: 8,
            }}
          >
            输入点什么
            <input />
          </div>
        )
      },
    })

    graph.addEdge({
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
