import { Graph } from '@antv/x6'
import React from 'react'
import '../index.less'

Graph.registerNode(
  'animated-rect',
  {
    inherit: 'rect',
    angle: 0,
    width: 80,
    height: 80,
    animation: [
      [
        { angle: 360 },
        {
          duration: 4000,
          iterations: Infinity,
        },
      ],
    ],
  },
  true,
)

export class AnimationConfExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 650,
      height: 400,
      background: {
        color: '#F2F7FA',
      },
    })

    // 配置形式的动画
    graph.addNode({
      width: 100,
      height: 60,
      x: 100,
      y: 100,
      label: '配置形式动画',
      animation: [
        [
          {
            'position/x': 400,
          },
          {
            duration: 2000,
            iterations: Infinity,
            direction: 'alternate',
          },
        ],
      ],
    })

    const node2 = graph.addNode({
      width: 100,
      height: 60,
      x: 100,
      y: 180,
      label: '指令形式动画',
    })

    // api指令形式的动画
    node2.animate(
      { 'position/x': 400 },
      {
        duration: 2000,
        iterations: 2,
        direction: 'alternate',
      },
    )

    // 自定义shape的动画
    graph.addNode({
      shape: 'animated-rect',
      x: 100,
      y: 280,
      label: '动画shape',
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
