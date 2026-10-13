import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, Selection } from '@antv/x6'
import { Settings, State } from './settings.tsx'

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
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
    )

    this.graph.addNode({
      x: 320,
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
      x: 80,
      y: 50,
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
      x: 240,
      y: 200,
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

  onSettingChanged = (options: State) => {
    this.graph.toggleMultipleSelection(options.multiple)
    this.graph.toggleSelectionMovable(options.movable)
    this.graph.toggleRubberband(options.rubberband)
    this.graph.toggleStrictRubberband(options.strict)
    this.graph.setSelectionFilter(options.filter)
    this.graph.setRubberbandModifiers(options.modifiers as any)
    this.graph.setSelectionDisplayContent(
      options.content
        ? (selection) => {
            return `${selection.length} node${
              selection.length > 1 ? 's' : ''
            } selected.`
          }
        : null,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="selection-app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
.selection-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.selection-app .app-side {
  bottom: 0;
  padding: 0 8px;
}
.selection-app .app-content {
  flex: 1;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.selection-app .ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.selection-app .ant-card-head-title {
  text-align: center;
}
.selection-app .ant-row {
  margin: 16px 0;
  text-align: left;
}
.selection-app .x6-widget-selection-box {
  border: 2px dashed #239edd;
}
.selection-app .x6-widget-selection-inner {
  border: 1px solid #239edd;
}

@media (max-width: 640px) {
  .selection-app {
    flex-wrap: wrap;
    height: auto;
  }
  .selection-app .app-side {
    width: 100%;
    max-width: 100%;
  }
  .selection-app .app-content {
    flex-basis: 100%;
    min-height: 280px;
    min-width: 0;
  }
}
`)
