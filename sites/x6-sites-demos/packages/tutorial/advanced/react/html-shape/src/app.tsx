import React from 'react'
import { Graph } from '@antv/x6'
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
      shape: 'html',
      html() {
        const wrap = document.createElement('div')
        wrap.style.width = '100%'
        wrap.style.height = '100%'
        wrap.style.background = '#f0f0f0'
        wrap.style.display = 'flex'
        wrap.style.justifyContent = 'center'
        wrap.style.alignItems = 'center'

        wrap.innerText = 'Hello'

        return wrap
      },
    })

    const wrap = document.createElement('div')
    wrap.style.width = '100%'
    wrap.style.height = '100%'
    wrap.style.background = '#f0f0f0'
    wrap.style.display = 'flex'
    wrap.style.justifyContent = 'center'
    wrap.style.alignItems = 'center'
    wrap.innerText = 'World'

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      shape: 'html',
      html: wrap,
    })

    graph.addEdge({
      source,
      target,
    })

    // 增加一个原生html的组件
    const target1 = graph.addNode({
      x: 280,
      y: 100,
      width: 100,
      height: 40,
      shape: 'html',
      html: {
        mount: async (props: any) => {
          console.log('mount', props)
          const { node } = props
          // 生成新的节点
          const wrap1 = wrap.cloneNode() as HTMLDivElement
          wrap1.innerText = '+'
          // 监听data变化
          node.on('change:data', () => {
            wrap1.innerText = node.getData().num
          })
          // 增加交互，点击后更新data
          wrap1.addEventListener(
            'click',
            () => {
              const { num = 0 } = node.getData() || {}
              console.log('inc num', num)
              node.setData({ num: num + 1 })
            },
            false,
          )
          // 这里可以直接添加到container或者返回后由x6内置的view添加到container内部
          // props.container.appendChild(wrap1)
          return wrap1
        },
        unmount: async (props: any) => {
          console.log('unmount', props)
        },
      },
    })
    console.log('target1', target1)
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
