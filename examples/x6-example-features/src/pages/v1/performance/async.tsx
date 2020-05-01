import React from 'react'
import { Checkbox, InputNumber, Button } from 'antd'
import { v1, Rectangle } from '@antv/x6'
import { View } from '@antv/x6/es/v1/core/view'
import { Rect, Edge } from '@antv/x6/es/v1/shape/standard'
import '../../index.less'
import '../index.less'

function random(max: number, min: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

const viewportTemplate = new Rect({
  zIndex: 3,
  size: { width: 200, height: 200 },
  position: { x: 100, y: 100 },
  attrs: {
    body: {
      fill: 'rgba(255,255,255,0.35)',
      stroke: 'rgba(255,0,0,0.8)',
      strokeWidth: 10,
      pointerEvents: 'all',
    },
  },
})

class Loader extends View {
  bar: HTMLDivElement
  constructor() {
    super()
    this.container = document.createElement('div')
    this.$(this.container).css({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 20,
      background: 'white',
      border: '1px solid black',
      padding: 2,
    })
    this.bar = document.createElement('div')
    this.$(this.bar).css({
      height: '100%',
      width: '0%',
      background: 'blue',
      transition: 'width 0.2s',
    })
  }

  progress(value: number) {
    this.bar.style.width = Math.min(Math.max(value, 0), 1) * 100 + '%'
  }
}

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private graph: v1.Graph
  private loader: Loader = new Loader()
  private windowBBox: Rectangle
  private viewport: v1.Node

  state: Example.State = {
    customViewport: true,
    padding: 100,
    keepRendered: false,
    keepDragged: false,
    count: 1000,
    columns: 40,
    batch: 1000,
  }

  componentDidMount() {
    const graph = (this.graph = new v1.Graph({
      container: this.container,
      width: 1000,
      height: 600,
      gridSize: 1,
      async: true,
      frozen: true,
      sorting: 'sorting-approximate',
      defaultAnchor: { name: 'nodeCenter' },
      defaultConnectionPoint: { name: 'boundary' },
      viewport: (view: v1.CellView, isInViewport: boolean) => {
        if (this.state.keepDragged && view.cid === draggedCid) {
          return true
        }
        if (this.state.keepRendered && isInViewport) {
          return true
        }

        if (this.state.customViewport) {
          var viewportBBox = this.viewport.getBBox()
          return viewportBBox.intersect(
            view.cell.getBBox().inflate(this.state.padding),
          )
        } else {
          if (view.cell === this.viewport) {
            return false
          }
          return this.windowBBox.intersect(
            view.cell.getBBox().inflate(this.state.padding),
          )
        }
      },
    }))

    graph.on('render:done', ({ stats }) => {
      console.table(stats)
    })

    // Dragged view is always visible
    let draggedCid: string | null = null
    graph.on({
      'cell:mousedown': function({ view }) {
        draggedCid = view.cid
      },
      'cell:mouseup': function() {
        draggedCid = null
      },
    })

    window.onscroll = () => {
      this.setWindowBBox()
    }
    window.onresize = () => {
      this.setWindowBBox()
    }

    this.setWindowBBox()
    this.restart()
  }

  randomColor() {
    return (
      'hsl(' +
      random(171, 181) +
      ',' +
      random(58, 72) +
      '%,' +
      random(45, 55) +
      '%)'
    )
  }

  restart() {
    this.loader.progress(0)
    document.body.appendChild(this.loader.container)
    console.time('perf-all')

    var count = this.state.count
    var columnCount = this.state.columns

    var nodes = Array.from({ length: count }, (_, index) => {
      var row = Math.floor(index / columnCount)
      var column = index % columnCount
      return new Rect({
        zIndex: 2,
        size: { width: 30, height: 20 },
        position: { x: column * 50, y: row * 50 },
        attrs: {
          body: { fill: this.randomColor() },
          label: { text: index },
        },
      })
    })

    var edges = nodes.map((target, index) => {
      if (index === 0) {
        return null
      }
      var source = nodes[index - 1]
      return new Edge({
        zIndex: 1,
        source: { cell: source.id },
        target: { cell: target.id },
      })
    })

    edges.shift()

    this.viewport = (viewportTemplate.clone() as any) as v1.Node

    console.time('perf-reset')

    this.graph.freeze()
    const cells = [...nodes, ...edges, this.viewport] as v1.Cell
    this.graph.model.resetCells(cells)
    this.graph.fitToContent({ useModelGeometry: true, padding: 10 })

    console.timeEnd('perf-reset')

    console.time('perf-dump')

    this.graph.unfreeze({
      batchSize: this.state.batch,
      progress: (done: boolean, current: number, total: number) => {
        var progress = current / total
        console.log(Math.round(progress * 100) + '%')
        if (done) {
          console.timeEnd('perf-dump')
          console.timeEnd('perf-all')
          this.graph.unfreeze()
          this.loader.remove()
        } else {
          this.loader.progress(progress)
        }
      },
    })
  }

  setWindowBBox() {
    this.windowBBox = this.graph.pageToLocalRect(
      window.scrollX,
      window.scrollY,
      window.innerWidth,
      window.innerHeight,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCountChange = count => this.setState({ count })
  onColumnsChange = columns => this.setState({ columns })
  onBatchChange = batch => this.setState({ batch })
  onRestartClick = () => this.restart()
  onCustomViewport = e => this.setState({ customViewport: e.target.checked })
  onPaddingChange = e => this.setState({ padding: e.target.checked ? 100 : 1 })
  onKeepRenderedChange = e => this.setState({ keepRendered: e.target.checked })
  onKeepDraggedChange = e => this.setState({ keepDragged: e.target.checked })

  render() {
    return (
      <div
        className="x6-graph-wrap"
        style={{
          padding: 24,
        }}
      >
        <div
          className="x6-graph-tools"
          style={{ width: '100%', userSelect: 'none' }}
        >
          <Checkbox
            checked={this.state.customViewport}
            onChange={this.onCustomViewport}
          >
            Custom Viewport
          </Checkbox>
          <Checkbox
            checked={this.state.padding > 1}
            onChange={this.onPaddingChange}
          >
            Padding
          </Checkbox>
          <Checkbox
            checked={this.state.keepRendered}
            onChange={this.onKeepRenderedChange}
          >
            Keep Rendered
          </Checkbox>
          <Checkbox
            checked={this.state.keepDragged}
            onChange={this.onKeepDraggedChange}
            style={{ marginRight: 32 }}
          >
            Keep Dragged
          </Checkbox>
          Count
          <InputNumber
            value={this.state.count}
            onChange={this.onCountChange}
            style={{ marginLeft: 4, marginRight: 16 }}
          />
          Columns
          <InputNumber
            value={this.state.columns}
            onChange={this.onColumnsChange}
            style={{ marginLeft: 4, marginRight: 16 }}
          />
          Batch Size
          <InputNumber
            value={this.state.batch}
            onChange={this.onBatchChange}
            style={{ marginLeft: 4, marginRight: 16 }}
          />
          <Button onClick={this.onRestartClick}>Restart</Button>
        </div>
        <div
          ref={this.refContainer}
          className="x6-graph"
          style={{
            border: '1px solid #000',
            boxShadow: 'none',
          }}
        />
      </div>
    )
  }
}

export namespace Example {
  export interface Props {}

  export interface State {
    customViewport: boolean
    padding: number
    keepRendered: boolean
    keepDragged: boolean
    count: number
    columns: number
    batch: number
  }
}
