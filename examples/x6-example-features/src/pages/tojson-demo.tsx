import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Graph, Cell } from '@antv/x6'
import './index.less'

export default class Example extends Component {
  private container: HTMLDivElement

  componentDidMount() {
    // this.renderTest1()
    // this.renderTest2()
    this.renderTest3()
    // this.renderTest4()
  }

  // 普通的节点、连线
  renderTest1 = () => {
    const graph = new Graph(this.container, {
      rubberband: {
        enabled: true,
      },
      allowDanglingEdges: false,
    })
    graph.render({
      nodes: [
        {
          id: 'node-0',
          x: 60,
          y: 60,
          width: 80,
          height: 30,
          label: 'Node0',
        },
        {
          id: 'node-1',
          x: 240,
          y: 240,
          width: 80,
          height: 30,
          label: 'Node1',
        },
      ],
      edges: [
        {
          id: 'edge-0',
          source: 'node-0',
          target: 'node-1',
          label: 'Label',
        },
      ],
    })

    // 模拟落库并取出数据重新渲染的操作
    setTimeout(() => {
      const result = graph.toJSON()
      console.log('看看返回的JSON数据:', result)

      const resultString = JSON.stringify(result)
      console.log('看看stringify的数据:', resultString)

      graph.render(JSON.parse(resultString))
    }, 3000)
  }

  // html自定义节点
  renderTest2 = () => {
    const graph = new Graph(this.container, {
      allowDanglingEdges: false,
      rubberband: {
        enabled: true,
      },
      getLabel: cell => {
        if (cell.isEdge()) {
          const div = document.createElement('div')
          ;(div.style.width = '160px'),
            (div.style.height = '20px'),
            (div.style.background = '#0000ff'),
            ReactDom.render(<div>自定义连线钩子</div>, div)
          return div
        }
        return null
      },
      // 如果在配置项里定义了getHtml方法, 那么节点中html就不生效了
      getHtml: cell => {
        const div = document.createElement('div')
        div.appendChild(document.createTextNode('HTML 钩子'))
        div.style.width = '100%'
        div.style.height = '100%'
        div.style.display = 'flex'
        div.style.alignItems = 'center'
        div.style.justifyContent = 'center'
        div.style.color = '#ff0000'
        div.style.background = '#00ff00'
        return div
      },
    })

    const div = document.createElement('div')
    div.appendChild(document.createTextNode('HTML Component 1'))
    div.style.width = '100%'
    div.style.height = '100%'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.justifyContent = 'center'
    div.style.color = '#00ff00'
    div.style.background = '#ff0000'

    const node1 = graph.addNode({
      id: 'node1',
      x: 48,
      y: 48,
      width: 180,
      height: 40,
      shape: 'html',
      // 如果有钩子, 优先走钩子
      html: div,
    })

    const node2 = graph.addNode({
      id: 'node2',
      x: 100,
      y: 200,
      width: 180,
      height: 40,
      shape: 'html',
      // 如果有钩子, 优先走钩子
      html: '<div>211</div>',
    })

    const edge = graph.addEdge({
      id: 'edge1',
      source: node1,
      target: node2,
      curved: true,
      rounded: true,
      data: {
        edge: '1111',
      },
      // 如果有钩子, 优先走钩子
      label: (cell: Cell) => {
        const div = document.createElement('div')
        ;(div.style.width = '160px'),
          (div.style.height = '20px'),
          (div.style.background = '#00ff00'),
          ReactDom.render(<div>这里可以是一个react组件</div>, div)
        return div
      },
    })

    setTimeout(() => {
      const result = graph.toJSON()
      console.log('看看返回的画布JSON数据:', result)

      const resultToString = JSON.stringify(result)
      console.log('看看画布JSON转换为string:', resultToString)

      graph.render(JSON.parse(resultToString))
    }, 3000)
  }

  // 通过React方式自定义节点、连线
  renderTest3 = () => {
    const graph = new Graph(this.container, {
      rubberband: {
        enabled: true,
      },
      resize: false,
      connection: {
        enabled: true,
      },
      anchor: {
        size: 8,
        fill: '#3F4042',
        stroke: '#3895EB',
        strokeWidth: 1,
        opacity: 1,
      },
      getAnchors: (cell: Cell) => {
        return [
          [0.5, 0],
          [0, 0.5],
          [1, 0.5],
          [0.5, 1],
        ]
      },
      allowDanglingEdges: false,
      getLabel: cell => {
        if (cell.isEdge()) {
          const div = document.createElement('div')
          ;(div.style.width = '160px'),
            (div.style.height = '20px'),
            (div.style.background = '#00ff00'),
            ReactDom.render(<div>自定义连线钩子</div>, div)
          return div
        }
        return null
      },
      // 如果在配置项里定义了getReactComponent方法, 那么节点中component就不生效了
      getReactComponent: cell => {
        return (
          <div
            style={{
              color: '#00ff00',
              width: '100%',
              height: '100%',
              background: '#ff0000',
              textAlign: 'center',
              lineHeight: '40px',
            }}
            onClick={() => {
              console.log('打印cell的数据:', cell.data)
            }}
          >
            react钩子节点
          </div>
        )
      },
    })

    const node1 = graph.addNode({
      id: 'node1',
      x: 48,
      y: 48,
      width: 180,
      height: 40,
      shape: 'react',
      data: {
        x: 1,
        y: 2,
      },
      component: (cell: Cell) => {
        return (
          <div
            style={{
              color: '#ff0000',
              width: '100%',
              height: '100%',
              background: '#00ffff',
              textAlign: 'center',
              lineHeight: '40px',
            }}
            onClick={() => {
              console.log('节点被点击, 看看数据:', cell.data)
            }}
          >
            React Component 1
          </div>
        )
      },
    })

    const node2 = graph.addNode({
      id: 'node2',
      x: 100,
      y: 200,
      width: 180,
      height: 40,
      shape: 'react',
      label: false,
      data: {
        xx: 11,
        yy: 22,
      },
      component: (cell: Cell) => {
        return (
          <div
            style={{
              color: '#ff0000',
              width: '100%',
              height: '100%',
              background: '#00ffff',
              textAlign: 'center',
              lineHeight: '40px',
            }}
            onClick={() => {
              console.log('节点被点击, 看看数据:', cell.data)
            }}
          >
            React Component 2
          </div>
        )
      },
    })

    const edge = graph.addEdge({
      id: 'edge1',
      source: node1,
      target: node2,
      curved: true,
      rounded: true,
      data: {
        edge: '1111',
      },
      label: (cell: Cell) => {
        const div = document.createElement('div')
        ;(div.style.width = '160px'),
          (div.style.height = '20px'),
          (div.style.background = '#00ff00'),
          ReactDom.render(<div>这里可以是一个react组件</div>, div)
        return div
      },
    })

    setTimeout(() => {
      const result = graph.toJSON()
      console.log('看看返回的画布JSON数据:', result)

      const resultToString = JSON.stringify(result)
      console.log('看看画布JSON转换为string:', resultToString)

      graph.render(JSON.parse(resultToString))
    }, 10000)
  }

  // 有群组的情况
  renderTest4 = () => {
    const graph = new Graph(this.container, {
      rubberband: {
        enabled: true,
      },
      allowDanglingEdges: false,
    })

    const node1 = graph.addNode({
      id: 'node-1',
      x: 40,
      y: 40,
      width: 160,
      height: 120,
    })

    const node2 = graph.addNode({
      id: 'node-2',
      x: 40,
      y: 40,
      width: 80,
      height: 30,
      label: 'Child',
      parent: node1,
    })

    setTimeout(() => {
      const result = graph.toJSON()
      console.log('看看返回的画布JSON数据:', result)

      const resultToString = JSON.stringify(result)
      console.log('看看画布JSON转换为string:', resultToString)

      graph.render(JSON.parse(resultToString))
    }, 3000)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
