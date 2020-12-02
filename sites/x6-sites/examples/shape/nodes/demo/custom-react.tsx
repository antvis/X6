import React from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'

// 使用教程：https://x6.antv.vision/zh/docs/tutorial/advanced/react#%E6%B8%B2%E6%9F%93-react-%E8%8A%82%E7%82%B9

class MyComponent extends React.Component<{
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
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '50px',
          border: '2px solid #9254de',
          borderRadius: 4,
          background: '#efdbff',
        }}
      >
        {this.props.text}
      </div>
    )
  }
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 50,
  width: 120,
  height: 50,
  shape: 'react-shape',
  component: <MyComponent text="Hello" />,
})

const target = graph.addNode({
  x: 320,
  y: 260,
  width: 120,
  height: 50,
  shape: 'react-shape',
  component(node: Node) {
    const color = node.prop<string>('color')
    return (
      <div
        style={{
          color: '#fff',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '50px',
          borderRadius: 4,
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
  target.prop('color', Color.randomHex())
  setTimeout(update, 1000)
}

update()
