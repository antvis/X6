import React from 'react'
import ReactDOM from 'react-dom'
import { Graph, CellView } from '@antv/x6'
import { Switch } from 'antd'

const interactingLabel = {
  magnetConnectable: '连接连接桩',
  edgeMovable: '移动边',
  edgeLabelMovable: '移动标签',
  arrowheadMovable: '移动箭头',
  vertexAddable: '添加顶点',
  vertexDeletable: '删除顶点',
  vertexMovable: '移动顶点',
}

class Example extends React.Component {
  private container: HTMLDivElement

  state = {
    interactingMap: {
      nodeMovable: (view: CellView) => {
        const cell = view.cell
        return cell.prop('movable') === true
      },
      magnetConnectable: true,
      edgeMovable: true,
      edgeLabelMovable: true,
      arrowheadMovable: true,
      vertexMovable: true,
      vertexAddable: true,
      vertexDeletable: true,
    },
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      width: 760,
      height: 380,
      interacting: () => this.state.interactingMap,
    })

    graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 80,
      height: 40,
      label: 'A',
      attrs: {
        body: {
          stroke: '#9254de',
          fill: '#efdbff',
          rx: 2,
          ry: 2,
        },
      },
      ports: [
        {
          attrs: {
            circle: {
              magnet: true,
              r: 5,
              stroke: '#9254de',
            },
          },
        },
      ],
    })

    graph.addNode({
      shape: 'rect',
      x: 80,
      y: 180,
      width: 80,
      height: 40,
      label: 'B',
      attrs: {
        body: {
          stroke: '#9254de',
          fill: '#efdbff',
          rx: 2,
          ry: 2,
        },
      },
      movable: true,
    })

    graph.addEdge({
      source: [280, 80],
      target: [480, 80],
      label: 'Move Me',
    })

    graph.addEdge({
      source: [280, 150],
      target: [480, 150],
      label: 'arrowhead',
      tools: ['target-arrowhead'],
    })

    graph.addEdge({
      source: [280, 220],
      target: [480, 220],
      label: 'vertices',
      tools: ['vertices'],
    })
  }

  onChange = (key: string, val: boolean) => {
    this.setState((prevState: any) => ({
      ...prevState.interactingMap,
      [key]: val,
    }))
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ width: '100%', height: '100%' }}>
        <div ref={this.refContainer} className="x6-graph" />
        <div
          style={{
            position: 'absolute',
            top: 116,
            right: 16,
            lineHeight: 3,
            textAlign: 'right',
          }}
        >
          {Object.keys(interactingLabel).map(
            (item: keyof typeof interactingLabel) => (
              <div key={item}>
                <span>{interactingLabel[item]}：</span>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={this.state.interactingMap[item]}
                  onChange={(val) => this.onChange(item, val)}
                />
              </div>
            ),
          )}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('container'))
