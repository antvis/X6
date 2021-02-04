import React from 'react'
import { Graph, Cell, Node as N, Edge as E } from '@antv/x6'
import '../../index.less'

type Result = { [key: string]: number[] }

const NODE_NUM = 500 // 节点数量
const MAX_EDGE_NUM = 2000 // 最大边数量
const ITERATIONS = 5 // 迭代 5 次求平均数
const STEP = 200 // 每次增加 200 条边
const ASYNC = false
const result: Result = {} as any

N.registry.register(
  'performance_normal_node',
  {
    inherit: 'circle',
    size: {
      width: 24,
      height: 24,
    },
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      text: {
        fill: '#fff',
      },
    },
  },
  true,
)
E.registry.register(
  'performance_normal_edge',
  {
    attrs: {
      line: {
        stroke: '#ccc',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 1000,
      grid: 1,
      async: ASYNC,
    })

    function mockCells(num: number) {
      const nodes: Cell[] = []
      const edges: Cell[] = []

      Array.from({ length: NODE_NUM }).forEach((_, n) => {
        const x = Math.round(Math.random() * 900) + 50
        const y = Math.round(Math.random() * 900) + 50
        const a = graph.createNode({
          x,
          y,
          id: `${n}`,
          shape: 'performance_normal_node',
          label: `${n + 1}`,
        })
        nodes.push(a)
      })
      
      Array.from({ length: num }).forEach(() => {
        const a = graph.createEdge({
          shape: 'performance_normal_edge',
          source: `${Math.floor(Math.random() * 500)}`,
          target: `${Math.floor(Math.random() * 500)}`,
        })
        edges.push(a)
      })

      return {
        nodes,
        edges,
      }
    }

    function test(num: number, iterations: number) {
      const { nodes, edges } = mockCells(num)
      graph.model.resetCells(nodes)
      
      const startTime = new Date().getTime()
      graph.model.addCells(edges)
      if (ASYNC) {
        graph.once('render:done', showResult)
      } else {
        showResult()
      }

      function showResult() {
        const duration = (new Date().getTime() - startTime) / 1000
        if (result[num]) {
          result[num].push(duration)
        } else {
          result[num] = [duration]
        }
        if (iterations < ITERATIONS) {
          test(num, iterations + 1)
        } else if (num < MAX_EDGE_NUM) {
          test(num + STEP, 0)
        } else {
          output()
        }
      }
    }

    function output() {
      const res = Object.keys(result).map((key: string) => ({
        num: parseInt(key, 10),
        time: parseFloat((result[key].reduce((pre, cur) => pre + cur, 0) / ITERATIONS).toFixed(3)),
        type: ASYNC ? 'async' : 'sync',
      }))
      document.getElementById('result')!.innerText = JSON.stringify(res)
    }

    test(200, 0)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div id="result" style={{ paddingLeft: 8, paddingBottom: 8 }}/>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
