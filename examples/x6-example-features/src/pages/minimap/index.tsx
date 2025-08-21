import * as React from 'react'
import { Graph, MiniMap } from '@antv/x6'
import { Scroller } from '@antv/x6-plugin-scroller'
import { Radio } from 'antd'
import { SimpleNodeView } from './simple-view'
import './index.less'

const options = [
  { label: '简单视图', value: 'simple' },
  { label: '详细视图', value: 'detailed' },
]

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 600,
      height: 320,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Scroller({
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      }),
    )
    this.graph.use(
      new MiniMap({
        container: this.minimapContainer,
        width: 200,
        height: 160,
        padding: 10,
      }),
    )

    this.graph.addNode({
      x: 200,
      y: 100,
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
      x: 160,
      y: 180,
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

  onMinimapViewChange = (val: string) => {
    this.graph.disposePlugins('minimap')
    if (val === 'simple') {
      this.graph.use(
        new MiniMap({
          container: this.minimapContainer,
          width: 200,
          height: 160,
          padding: 10,
          graphOptions: {
            createCellView(cell) {
              // 可以返回三种类型数据
              // 1. null: 不渲染
              // 2. undefined: 使用 X6 默认渲染方式
              // 3. CellView: 自定义渲染
              if (cell.isEdge()) {
                return null
              }
              if (cell.isNode()) {
                return SimpleNodeView
              }
            },
          },
        }),
      )
    } else {
      this.graph.use(
        new MiniMap({
          container: this.minimapContainer,
          width: 200,
          height: 160,
          padding: 10,
        }),
      )
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div className="minimap-app">
        <div className="app-btns">
          <Radio.Group
            options={options}
            onChange={(e) => this.onMinimapViewChange(e.target.value)}
            defaultValue={'detailed'}
            optionType="button"
          />
        </div>
        <div className="app-content" ref={this.refContainer} />
        <div className="app-minimap" ref={this.refMiniMapContainer} />
      </div>
    )
  }
}
