import React from 'react'
import ReactDom from 'react-dom'
import { Dropdown, Menu, message } from 'antd'
import { Graph } from '@antv/x6'

class Example extends React.Component {
  private container: HTMLDivElement
  private contextMenuAnchor: HTMLSpanElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      width: 780,
      height: 520,
    })

    const source = graph.addNode({
      shape: 'rect',
      width: 120,
      height: 50,
      x: 120,
      y: 50,
      label: 'Hello',
      attrs: {
        body: {
          fill: '#efdbff',
          stroke: '#9254de',
          strokeWidth: 2,
        },
      },
    })

    const target = graph.addNode({
      shape: 'rect',
      width: 120,
      height: 50,
      x: 500,
      y: 250,
      label: 'World',
      attrs: {
        body: {
          fill: '#ffd591',
          stroke: '#ffa940',
          strokeWidth: 2,
        },
      },
    })

    graph.addEdge({
      source,
      target,
    })

    graph.on('cell:contextmenu', ({ e }) => {
      const { x, y } = graph.clientToLocal(e.clientX, e.clientY)
      this.contextMenuAnchor.style.display = 'inline-block'
      this.contextMenuAnchor.style.left = `${x}px`
      this.contextMenuAnchor.style.top = `${y}px`
      const clickEvent = document.createEvent('HTMLEvents')
      clickEvent.initEvent('click', true, true)
      this.contextMenuAnchor.dispatchEvent(clickEvent)
    })
  }

  renderContextMenu() {
    return (
      <Menu onClick={(e) => message.info(`select ${e.key}`)}>
        <Menu.Item key={0}>Menu Item 0</Menu.Item>
        <Menu.Item key={1}>Menu Item 1</Menu.Item>
        <Menu.Item key={2}>Menu Item 2</Menu.Item>
        <Menu.Item key={3}>Menu Item 3</Menu.Item>
        <Menu.Item key={4}>Menu Item 4</Menu.Item>
      </Menu>
    )
  }

  handleContextMenuVisibleChange = (visible: boolean) => {
    if (!visible) {
      this.contextMenuAnchor.style.display = 'none'
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refContextMenuAnchor = (anchor: HTMLSpanElement) => {
    this.contextMenuAnchor = anchor
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} />
        <Dropdown
          overlay={this.renderContextMenu()}
          trigger={['click']}
          onVisibleChange={this.handleContextMenuVisibleChange}
        >
          <span
            ref={this.refContextMenuAnchor}
            className="context-menu-anchor"
          />
        </Dropdown>
      </div>
    )
  }
}

ReactDom.render(<Example />, document.getElementById('container'))

// 我们用 insert-css 协助demo演示
// 实际项目中只要将下面样式添加到样式文件中
insertCss(`
  .x6-graph-wrap {
    position: relative;
  }
  .context-menu-anchor {
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    cursor: default;
    font-size: 1px;
    width: 1px;
    height: 1px;
  }
`)
