import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { MyComponent } from './component'
import '@antv/x6-react-shape'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      shape: 'react-shape',
      component: <MyComponent text="Hello" />,
    })

    const target = graph.addNode({
      shape: 'react-shape',
      x: 140,
      y: 160,
      width: 100,
      height: 40,
      component(node: Node) {
        const color = node.attr('body/fill') as string
        return (
          <div
            style={{
              color: Color.invert(color, true),
              width: '100%',
              height: '100%',
              textAlign: 'center',
              lineHeight: '40px',
              background: color,
            }}
          >
            {color}
          </div>
        )
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
