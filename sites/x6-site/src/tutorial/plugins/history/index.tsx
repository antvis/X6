import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { History } from '@antv/x6-plugin-history'
import styles from './index.less'

interface Props {}

interface State {
  canUndo: boolean
  canRedo: boolean
}

export default class App extends React.Component<Props, State> {
  private container: HTMLDivElement
  private graph: Graph

  state: State = {
    canRedo: false,
    canUndo: false,
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.use(
      new History({
        enabled: true,
      }),
    )

    graph.addNode({
      x: 100,
      y: 60,
      width: 100,
      height: 40,
      label: 'Drag Me',
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

    graph.on('history:change', () => {
      this.setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      })
    })

    this.graph = graph
  }

  onUndo = () => {
    this.graph.undo()
  }

  onRedo = () => {
    this.graph.redo()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles['app-btns']}>
          <Button.Group>
            <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
              Undo
            </Button>
            <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
              Redo
            </Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className={styles['app-content']} />
      </div>
    )
  }
}
