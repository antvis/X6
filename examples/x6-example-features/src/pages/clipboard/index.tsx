import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Selection } from '@antv/x6-plugin-selection'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private selection: Selection
  private clipboard: Clipboard

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })
    const clipboard = new Clipboard({
      enabled: true,
      useLocalStorage: true,
    })
    const selection = new Selection({
      enabled: true,
      rubberband: true,
      multiple: true,
      strict: true,
    })
    const keyboard = new Keyboard({
      enabled: true,
    })

    graph.use(clipboard)
    graph.use(selection)
    graph.use(keyboard)

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    keyboard.bindKey('meta+c', (e) => {
      e.preventDefault()
      this.onCopy()
    })

    keyboard.bindKey('meta+v', (e) => {
      e.preventDefault()
      this.onPaste()
    })

    clipboard.on('clipboard:changed', ({ cells }) => {
      console.log(cells)
    })

    this.selection = selection
    this.clipboard = clipboard
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.selection.getSelectedCells()
    if (cells && cells.length) {
      this.clipboard.copy(cells)
    }
  }

  onPaste = () => {
    if (!this.clipboard.isEmpty()) {
      this.clipboard.paste()
    }
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Button onClick={this.onCopy} style={{ marginRight: 8 }}>
            Copy
          </Button>
          <Button onClick={this.onPaste}>Paste</Button>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
