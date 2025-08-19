import React from 'react'
import { Button, message } from 'antd'
import { Graph } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Settings, State } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private options: State

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      }),
    )

    this.graph.use(
      new Clipboard({
        enabled: true,
        useLocalStorage: true,
      }),
    )

    this.graph.addNode({
      x: 280,
      y: 80,
      width: 100,
      height: 40,
      label: 'Rect',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 180,
      y: 160,
      width: 60,
      height: 60,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
  }

  onSettingsChanged = (options: State) => {
    this.options = { ...options }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      message.success('复制成功')
    } else {
      message.info('请先选中节点再复制')
    }
  }

  onPaste = () => {
    if (this.graph.isClipboardEmpty()) {
      message.info('剪切板为空，不可粘贴')
    } else {
      const cells = this.graph.paste(this.options)
      this.graph.cleanSelection()
      this.graph.select(cells)
      message.success('粘贴成功')
    }
  }

  render() {
    return (
      <div className="clipboard-app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
          <div className="app-btns">
            <Button onClick={this.onCopy} type="primary">
              Copy Selected Cells
            </Button>
            <Button onClick={this.onPaste} type="ghost">
              Paste
            </Button>
          </div>
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
