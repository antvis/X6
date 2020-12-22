import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      // background: {
      //   color: '#fcfcfc',
      //   image:
      //     'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
      //   opacity: 0.2,
      //   repeat: 'watermark',
      //   angle: 30,
      // },
      panning: true,
    })

    // const data = [
    //   {
    //     id: 'node1',
    //     shape: 'rect',
    //     x: 100,
    //     y: 100,
    //     width: 80,
    //     height: 40,
    //     label: 'hello',
    //   },
    //   {
    //     id: 'node2',
    //     shape: 'rect',
    //     x: 240,
    //     y: 300,
    //     width: 80,
    //     height: 40,
    //     label: 'world',
    //   },
    //   {
    //     shape: 'edge',
    //     source: 'node1',
    //     target: 'node2',
    //   },
    // ]

    const data = {
      // 节点
      nodes: [
        {
          id: 'node1',
          shape: 'rect',
          x: 120,
          y: 100,
          width: 80,
          height: 40,
          label: 'Hello',
          attrs: {
            body: {
              strokeWidth: 1,
            },
          },
        },
        {
          id: 'node2',
          x: 120,
          y: 240,
          width: 80,
          height: 40,
          label: 'World',
          attrs: {
            body: {
              strokeWidth: 1,
            },
          },
        },
      ],
      // 边
      edges: [
        {
          source: 'node1',
          target: 'node2',
          attrs: {
            line: {
              sourceMarker: 'classic',
              targetMarker: 'classic',
              strokeWidth: 2,
            },
          },
        },
      ],
    }

    graph.fromJSON(data)
    // console.log(graph.toJSON())
    // graph.scaleContentToFit()

    const node = graph.getCellById('node2')
    node.transition('attrs/body/strokeWidth', 10, {
      duration: 3000,
      complete() {},
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
