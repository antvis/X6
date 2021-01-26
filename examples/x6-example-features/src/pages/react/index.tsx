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
        style={{
          color: Color.invert(color, true),
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '60px',
          borderRadius: 30,
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
      primer: 'circle',
      x: 80,
      y: 80,
      width: 60,
      height: 60,
      data: {},
      xxx: {},
      component: <MyComponent text="Source" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 320,
      y: 320,
      width: 120,
      height: 48,
      component: (node) => {
        return (
          <div style={{ lineHeight: '48px', textAlign: 'center' }}>
            {node.attr('body/fill')}
          </div>
        )
      },
      // component: () => <Test text="target" />,
    })

    graph.addNode({
      shape: 'react-shape',
      primer: 'circle',
      x: 80,
      y: 320,
      width: 60,
      height: 60,
      useForeignObject: false,
      component: () => {
        return  <circle stroke="red" cx="30" cy="30" r="30"/>
      },
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
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
