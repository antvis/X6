import React from 'react'
import { Graph, Cell, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import '../../../index.less'

type Result = { [key: string]: number[] }

const MAX_NODE_NUM = 5000 // 最大节点数量
const ITERATIONS = 5 // 迭代 5 次求平均数
const STEP = 500 // 每次增加 500 节点
const ASYNC = true
const result: Result = {} as any

class MyComponent extends React.Component<{ node?: Node; text: string }> {
  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          borderRadius: 12,
          backgroundColor: '#855af2',
        }}
      >
        {this.props.text}
      </div>
    )
  }
}

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
      const cells: Cell[] = []
      Array.from({ length: num }).forEach((_, n) => {
        const x = Math.round(Math.random() * 900) + 50
        const y = Math.round(Math.random() * 900) + 50
        const a = graph.createNode({
          shape: 'react-shape',
          x,
          y,
          width: 24,
          height: 24,
          component: <MyComponent text={`${n}`} />,
        })
        cells.push(a)
      })
      return cells
    }

    function test(num: number, iterations: number) {
      const cells = mockCells(num)

      const startTime = new Date().getTime()
      graph.model.resetCells(cells)

      if (ASYNC) {
        graph.once('render:done', recordResult)
      } else {
        recordResult()
      }

      function recordResult() {
        const duration = (new Date().getTime() - startTime) / 1000
        if (result[num]) {
          result[num].push(duration)
        } else {
          result[num] = [duration]
        }
        if (iterations < ITERATIONS) {
          test(num, iterations + 1)
        } else if (num < MAX_NODE_NUM) {
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

    test(500, 0)
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
