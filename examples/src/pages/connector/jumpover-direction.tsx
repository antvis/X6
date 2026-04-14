import React, { useEffect, useRef, useState } from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

type JumpDirection = 'both' | 'horizontal' | 'vertical'

export const JumpoverDirectionExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const [direction, setDirection] = useState<JumpDirection>('both')

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      grid: true,
      width: 800,
      height: 500,
    })
    graphRef.current = graph

    // 四个节点，使水平线和垂直线互相交叉
    const a = graph.addNode({
      x: 50,
      y: 220,
      width: 80,
      height: 40,
      label: 'A',
    })
    const b = graph.addNode({
      x: 680,
      y: 220,
      width: 80,
      height: 40,
      label: 'B',
    })
    const c = graph.addNode({
      x: 380,
      y: 50,
      width: 80,
      height: 40,
      label: 'C',
    })
    const d = graph.addNode({
      x: 380,
      y: 410,
      width: 80,
      height: 40,
      label: 'D',
    })

    // 水平线：A → B（穿越垂直线）
    graph.addEdge({
      source: a,
      target: b,
      connector: { name: 'jumpover', args: { jumpDirection: direction } },
      attrs: { line: { stroke: '#1890ff', strokeWidth: 2 } },
      labels: [{ attrs: { label: { text: '水平线 A→B', fill: '#1890ff' } } }],
    })

    // 垂直线：C → D（穿越水平线）
    graph.addEdge({
      source: c,
      target: d,
      connector: { name: 'jumpover', args: { jumpDirection: direction } },
      attrs: { line: { stroke: '#f5222d', strokeWidth: 2 } },
      labels: [{ attrs: { label: { text: '垂直线 C→D', fill: '#f5222d' } } }],
    })

    return () => {
      graph.dispose()
      graphRef.current = null
    }
    // 每次 direction 变化时重建画布
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction])

  return (
    <div className="x6-graph-wrap">
      <h1>jumpover — jumpDirection 演示</h1>
      <div
        className="x6-graph-tools"
        style={{ display: 'flex', gap: 12, alignItems: 'center' }}
      >
        <span style={{ fontWeight: 600 }}>jumpDirection：</span>
        {(['both', 'horizontal', 'vertical'] as JumpDirection[]).map((v) => (
          <label
            key={v}
            style={{
              cursor: 'pointer',
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <input
              type="radio"
              name="jumpDirection"
              value={v}
              checked={direction === v}
              onChange={() => setDirection(v)}
            />
            {v}
          </label>
        ))}
      </div>
      <div
        style={{
          marginBottom: 12,
          paddingLeft: 16,
          color: '#666',
          fontSize: 13,
        }}
      >
        {direction === 'both' &&
          '两条线交叉时，先绘制的那条（水平/垂直均可）会产生跳弧。'}
        {direction === 'horizontal' &&
          '只有水平线（A→B，蓝色）在交叉处产生跳弧；垂直线（C→D，红色）直线穿过。'}
        {direction === 'vertical' &&
          '只有垂直线（C→D，红色）在交叉处产生跳弧；水平线（A→B，蓝色）直线穿过。'}
      </div>
      <div
        ref={containerRef}
        className="x6-graph"
        style={{ width: 800, height: 500 }}
      />
    </div>
  )
}

export default JumpoverDirectionExample
