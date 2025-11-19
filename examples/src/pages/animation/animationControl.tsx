import { Graph, type Node } from '@antv/x6'
import { Button, Space } from 'antd'
import { useEffect, useRef } from 'react'
import '../index.less'

export const AnimationControlExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeAnimationRef = useRef<ReturnType<Node['animate']>>()

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 650,
      height: 400,
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

    nodeAnimationRef.current = node.animate(
      [
        { 'position/x': 100, angle: 0 },
        { 'position/x': 400, angle: 360 },
      ],
      {
        delay: 1000,
        duration: 1000,
        fill: 'forwards',
        iterations: 3,
        direction: 'alternate',
      },
    )

    nodeAnimationRef.current.onfinish = () => {
      console.log('动画结束')
    }

    return () => {
      graph.dispose()
    }
  }, [])

  return (
    <div className="x6-graph-wrap">
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => nodeAnimationRef.current?.play()}>
          开始
        </Button>
        <Button
          type="primary"
          onClick={() => nodeAnimationRef.current?.pause()}
        >
          暂停
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (nodeAnimationRef.current) {
              nodeAnimationRef.current.currentTime = 1200
            }
          }}
        >
          设置动画时间:1000
        </Button>
        <Button
          type="primary"
          onClick={() => {
            nodeAnimationRef.current?.updatePlaybackRate(2)
          }}
        >
          修改两倍速率
        </Button>
        <Button
          type="primary"
          onClick={() => {
            nodeAnimationRef.current?.reverse()
          }}
        >
          反向时间速率
        </Button>
        <Button onClick={() => nodeAnimationRef.current?.cancel()}>
          取消动画
        </Button>
      </Space>
      <div ref={containerRef} className="x6-graph" />
    </div>
  )
}
