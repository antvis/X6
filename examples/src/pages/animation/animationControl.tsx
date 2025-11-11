import { Graph, type Node } from '@antv/x6'
import { Button, Space } from 'antd'
import React from 'react'
import '../index.less'

export class AnimationControlExample extends React.Component {
  private container!: HTMLDivElement
  private nodeAnimation!: ReturnType<Node['animate']>

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 650,
      height: 400,
      background: {
        // color: '#F2F7FA',
      },
    })

    const node = graph.addNode({
      width: 100,
      height: 60,
      x: 100,
      y: 180,
      label: '节点',
      attrs: {
        body: {
          rx: 10,
          fill: '#10B981',
          stroke: '#fff',
        },
        text: {
          fill: '#fff',
        },
      },
    })

    this.nodeAnimation = node.animate(
      [
        // 动画开始时节点位置将在 0s ～ 0.8s 内从 x: 100 的位置
        // 通过 ease-out-sine 的缓动形式移动到 x: 300 的位置，并且旋转180度
        // 再在 0.8s ～ 1s 的时间内再次移动到 x: 400 的位置并且旋转为 360 度
        // { 'position/x': 100, angle: 0 },
        // { 'position/x': 300, angle: 180, offset: 0.8 },
        { 'position/x': 400, angle: 360 },
      ],
      {
        // 将延迟 1s 再开始动画
        delay: 1000,
        // 延迟 1s 后动画将执行 1s
        duration: 1000,
        // 动画结束后将停留在最后结束时的位置
        fill: 'forwards',
        // 动画总共将执行 10 次
        iterations: 3,
        // 动画方向将交替执行
        direction: 'alternate',
      },
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <Space>
          <Button type="primary" onClick={() => this.nodeAnimation.play()}>
            开始
          </Button>
          <Button type="primary" onClick={() => this.nodeAnimation.pause()}>
            暂停
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.nodeAnimation.currentTime = 1200
            }}
          >
            设置动画时间:1000
          </Button>
          <Button onClick={() => this.nodeAnimation.cancel()}>取消</Button>
        </Space>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
