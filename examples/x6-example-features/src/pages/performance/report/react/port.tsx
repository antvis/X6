import React from 'react'
import ReactDOM from 'react-dom'
import { Graph, Cell, Node as N, Markup } from '@antv/x6'
import '../../../index.less'

type Result = { [key: string]: number[] }

const MAX_NODE_NUM = 5000 // 最大节点数量
const ITERATIONS = 5 // 迭代 5 次求平均数
const STEP = 500 // 每次增加 500 节点
const ASYNC = false
const result: Result = {} as any

const Node = N.registry.register(
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
    portMarkup: [Markup.getForeignObjectMarkup()],
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
          },
        },
        right: {
          position: 'right',
          attrs: {
            fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
          },
        },
        left: {
          position: 'left',
          attrs: {
            fo: {
                width: 10,
                height: 10,
                x: -5,
                y: -5,
                magnet: 'true',
              },
          },
        },
      },
      items: [
        {
          group: 'top',
        },
        {
          group: 'right',
        },
        {
          group: 'bottom',
        },
        {
          group: 'left',
        },
      ],
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
      onPortRendered(args) {
        const selectors = args.contentSelectors
        const container = selectors && selectors.foContent
        if (container) {
          ReactDOM.render(
            (
              <div style={{
                width: '100%',
                height: '100%',
                border: '1px solid #808080',
                borderRadius: '100%',
                background: '#eee',
              }} />
            ),
            container as HTMLElement,
          )
        }
      },
    })

    function mockCells(num: number) {
      const node = new Node()
      const cells: Cell[] = []
      Array.from({ length: num }).forEach((_, n) => {
        const x = Math.round(Math.random() * 900) + 50
        const y = Math.round(Math.random() * 900) + 50
        const a = node
          .clone()
          .position(x, y)
          .attr('label/text', n + 1)
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
