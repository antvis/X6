import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { Portal } from '@antv/x6-react-shape'
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
      width: 160,
      height: 60,
      component: (node) => {
        return <div>{node.attr('body/fill')}</div>
      },
      // component: () => <Test text="target" />,
    })

    graph.addEdge({
      source,
      target,
    })

    const update = () => {
      target.prop('attrs/body/fill', Color.randomHex())
      setTimeout(update, 1000)
    }

    update()

    console.log(graph.toJSON())
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    const X6ReactPortalProvider = Portal.getPovider()
    return (
      <div className="x6-graph-wrap">
        <X6ReactPortalProvider />
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
