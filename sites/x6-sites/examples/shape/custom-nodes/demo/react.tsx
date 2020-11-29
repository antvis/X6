import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'

export class MyComponent extends React.Component<{
  node?: ReactShape
  text: string
}> {
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
          color: '#fff',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '40px',
          background: color,
        }}
      >
        {this.props.text}
      </div>
    )
  }
}

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
})

const source = graph.addNode({
  x: 140,
  y: 40,
  width: 100,
  height: 40,
  shape: 'react-shape',
  component: <MyComponent text="Hello" />,
})

const target = graph.addNode({
  shape: 'react-shape',
  x: 280,
  y: 190,
  width: 100,
  height: 40,
  component(node: Node) {
    const color = node.attr('body/fill') as string
    return (
      <div
        style={{
          color: '#fff',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '40px',
          backgroundColor: color,
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
