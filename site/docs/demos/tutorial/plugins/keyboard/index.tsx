import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Graph, Clipboard, Keyboard, Selection } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    this.graph.use(
      new Clipboard({
        enabled: true,
      }),
    )
    this.graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      }),
    )
    this.graph.use(
      new Keyboard({
        enabled: true,
        global: true,
      }),
    )

    this.graph.addNode({
      x: 280,
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

    this.graph.bindKey('ctrl+c', () => {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.copy(cells)
      }
      return false
    })

    this.graph.bindKey('ctrl+v', () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 })
        this.graph.cleanSelection()
        this.graph.select(cells)
      }
      return false
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="keyboard-app">
        <div className="app-info">
          <p>
            <span>Ctrl + C</span>Copy Cell
            <span style={{ marginLeft: 24 }}>Ctrl + V</span>Paste Cell
          </p>
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
.keyboard-app {
  padding: 0;
  font-family: sans-serif;
}
.keyboard-app .app-info {
  bottom: 0;
  margin: 0;
  padding: 0 8px;
}
.keyboard-app .app-info span {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 18px;
  background: #e9e9e9;
  border-radius: 4px;
}
.keyboard-app .app-content {
  width: 100%;
  height: 280px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.keyboard-app .x6-widget-selection-box {
  border: 2px dashed #239edd;
}
.keyboard-app .x6-widget-selection-inner {
  border: 1px solid #239edd;
}
`)
