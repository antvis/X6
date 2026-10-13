import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Button, message } from 'antd'
import { Graph, Clipboard, Selection } from '@antv/x6'
import { Settings, State } from './settings.tsx'

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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.clipboard-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.clipboard-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.clipboard-app .app-side .slider-value {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 7px;
  color: #333;
  font-size: 12px;
  line-height: 1.25;
  background: #eee;
  border-radius: 10px;
}
.clipboard-app .app-side .app-btns {
  display: flex;
  margin-top: 16px;
}
.clipboard-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.clipboard-app .ant-btn {
  flex: 1;
  margin-right: 8px;
}
.clipboard-app .ant-btn:last-child {
  margin-right: 0;
}
.clipboard-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.clipboard-app .ant-card-head-title {
  text-align: center;
}
.clipboard-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.clipboard-app .x6-widget-selection-box {
  border: 2px dashed #239edd;
}
.clipboard-app .x6-widget-selection-inner {
  border: 1px solid #239edd;
}

@media (max-width: 640px) {
  .clipboard-app {
    flex-wrap: wrap;
    height: auto;
  }
  .clipboard-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .clipboard-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
