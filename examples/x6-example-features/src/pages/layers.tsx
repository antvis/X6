import React from 'react'
import { Checkbox } from 'antd'
import { Graph, Cell } from '@antv/x6'
import styles from './index.less'

export default class Layers extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private layer0: Cell
  private layer1: Cell

  state = {
    layer0Visible: true,
    layer1Visible: true,
  }

  componentDidMount() {
    const graph = new Graph(this.container)
    const root = graph.model.createRoot()
    const layer0 = root.getChildAt(0)!
    const layer1 = graph.model.createLayer()

    root.insertChild(layer1)
    graph.model.setRoot(root)

    this.graph = graph
    this.layer0 = layer0
    this.layer1 = layer1

    graph.batchUpdate(() => {
      const hello1 = graph.addNode({
        parent: layer1,
        data: 'Hello,',
        x: 20,
        y: 20,
        width: 80,
        height: 30,
        style: {
          fill: '#c0c0c0',
        },
      })

      const hello2 = graph.addNode({
        parent: layer1,
        data: 'Hello,',
        x: 200,
        y: 20,
        width: 80,
        height: 30,
        style: {
          fill: '#c0c0c0',
        },
      })

      const world = graph.addNode({
        parent: layer0,
        data: 'World!',
        x: 110,
        y: 150,
        width: 80,
        height: 30,
      })

      graph.addEdge({
        parent: layer1,
        source: hello1,
        target: world,
        points: [{ x: 60, y: 165 }],
        style: {
          stroke: '#1890ff',
        },
      })

      graph.addEdge({
        parent: layer1,
        source: hello2,
        target: hello1,
        points: [{ x: 150, y: 40 }],
        style: {
          edge: 'topToBottom',
          stroke: '#1890ff',
        },
      })

      graph.addEdge({
        parent: layer0,
        source: hello2,
        target: world,
        points: [{ x: 240, y: 165 }],
      })

      graph.addEdge({
        parent: layer0,
        source: hello1,
        target: hello2,
        points: [[150, 30]],
        style: {
          edge: 'topToBottom',
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onLayer0Changed = (e: any) => {
    const checked = e.target.checked
    this.setState({ layer0Visible: checked })
    this.graph.model.setVisible(this.layer0, checked)
  }

  onLayer1Changed = (e: any) => {
    const checked = e.target.checked
    this.setState({ layer1Visible: checked })
    this.graph.model.setVisible(this.layer1, checked)
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div ref={this.refContainer} className={styles.graph} />
        <div style={{ marginTop: 24, fontSize: 12, userSelect: 'none' }}>
          <Checkbox
            checked={this.state.layer0Visible}
            onChange={this.onLayer0Changed}
          >
            Layer 0
          </Checkbox>
          <Checkbox
            checked={this.state.layer1Visible}
            onChange={this.onLayer1Changed}
          >
            Layer 1
          </Checkbox>
        </div>
      </div>
    )
  }
}
