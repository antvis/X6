import React from 'react'
import { Button } from 'antd'
import { Graph, $ } from '@antv/x6'
import { Dnd } from '@antv/x6/es/addon/dnd'
import { Rect, Circle } from '@antv/x6/es/shape/standard'
import '../index.less'

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement
  private stencilContainer: HTMLDivElement

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 800,
      history: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      grid: {
        visible: true,
      },
      scroller: {
        enabled: true,
        width: 600,
        height: 400,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      },
    }))

    graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'rect',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    graph.centerContent()

    const dnd = new Dnd({ target: graph })

    this.stencilContainer.childNodes.forEach((elem: HTMLElement) => {
      const type = elem.getAttribute('data-type')
      const node =
        type === 'rect'
          ? new Rect({
              width: 100,
              height: 40,
              attrs: {
                label: {
                  text: 'Rect',
                  fill: '#6a6c8a',
                },
                body: {
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                },
              },
            })
          : new Circle({
              width: 60,
              height: 60,
              attrs: {
                label: {
                  text: 'Circle',
                  fill: '#6a6c8a',
                },
                body: {
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                },
              },
            })

      $(elem).on('mousedown', (e) => {
        dnd.start(node, e)
      })
    })

    // const history = graph.history
    // history.on('change', () => {})
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

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Dnd</h1>
        <div
          ref={this.refStencil}
          style={{
            position: 'absolute',
            left: 32,
            top: 40,
            width: 200,
            height: 300,
            padding: 16,
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          <div
            data-type="rect"
            style={{
              width: 100,
              height: 40,
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '40px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Rect
          </div>
          <div
            data-type="circle"
            style={{
              width: 60,
              height: 60,
              borderRadius: '100%',
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '60px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Circle
          </div>
        </div>
        <div className="x6-graph-tools">
          <Button.Group>
            <Button onClick={this.onUndo}>Undo</Button>
            <Button onClick={this.onRedo}>Redo</Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
