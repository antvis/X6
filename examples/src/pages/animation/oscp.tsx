import { Graph, Shape } from '@antv/x6'
import React from 'react'
import '../index.less'

Graph.registerNode(
  'custom-node',
  {
    width: 150,
    height: 60,
    attrs: {
      body: {
        stroke: '#000',
        strokeWidth: 2,
        fill: '#fff',
        refWidth: 1,
        refHeight: 1,
        rx: 10,
      },
      image: {
        width: 16,
        height: 16,
        ref: 'body',
      },
      icon: {
        ref: 'body',
        fill: '#fff',
      },
      icon2: {
        ref: 'body',
        fill: '#fff',
      },
      title: {
        text: 'Node',
        refX: 45,
        refY: 14,
        fill: '#fff',
        fontSize: 14,
        'text-anchor': 'start',
        fontWeight: 'bold',
      },
      text: {
        refX: 45,
        refY: 38,
        fontSize: 12,
        fill: '#fff',
        'text-anchor': 'start',
      },
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'image',
      },
      {
        tagName: 'text',
        selector: 'title',
      },
      {
        tagName: 'text',
        selector: 'text',
      },
      {
        tagName: 'path',
        selector: 'icon',
      },
      {
        tagName: 'path',
        selector: 'icon2',
      },
    ],
  },
  true,
)

export class OSCPExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      height: 600,
      connecting: {
        snap: true,
        connector: { name: 'smooth' },
      },
      background: {
        color: '#fff',
      },
    })

    const mainNode = graph.addNode({
      shape: 'custom-node',
      x: 300,
      y: 100,
      width: 300,
      height: 150,
      attrs: {
        body: {
          fill: '#FBEAD4',
          stroke: '#D7CEA9',
          strokeWidth: 2,
          rx: 20,
        },
        image: {
          'xlink:href':
            'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*A-lcQbVTpjwAAAAAAAAAAAAADmJ7AQ/original',
          width: 100,
          height: 100,
          refX: 0.5,
          refX2: -50,
          y: 0,
        },
        title: {
          text: 'OSCP',
          fontSize: 20,
          refX: 0.5,
          refX2: -25,
          y: 90,
          fontWeight: 800,
          fill: 'rgba(0,0,0,0.85)',
        },
        text: {
          text: '',
        },
      },
    })

    const issueNode = graph.addNode({
      shape: 'custom-node',
      x: 800,
      y: 140,
      attrs: {
        body: {
          fill: '#4CAF50',
          stroke: '',
        },
        title: {
          text: '主线任务',
        },
        text: {
          text: 'issue修复',
        },
        icon: {
          d: 'M20 40 L20 30 L15 30 L20 25 L20 15 L30 15 L30 25 L35 30 L30 30 L30 40 ZM22 30 L28 30 M25 22 L25 28',
          refY: 0,
          refX: 0,
        },
      },
      animation: [
        [
          { 'attrs/icon/refY': -5 },
          {
            duration: 800,
            iterations: Infinity,
            direction: 'alternate',
          },
        ],
      ],
    })

    const docNode = graph.addNode({
      shape: 'custom-node',
      x: 650,
      y: 260,
      attrs: {
        body: {
          fill: '#4994EC',
          stroke: '',
        },
        title: {
          text: '支线任务',
        },
        text: {
          text: '文档捉"虫"',
        },
        icon: {
          d: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
          refX: 10,
          refY: 10,
        },
      },
      animation: [
        [
          { 'attrs/icon/refY': 15 },
          {
            duration: 600,
            iterations: Infinity,
            direction: 'alternate',
          },
        ],
        [
          { 'attrs/icon/refX': 20 },
          {
            duration: 700,
            iterations: Infinity,
            direction: 'alternate',
          },
        ],
      ],
    })

    const prNode = graph.addNode({
      shape: 'custom-node',
      x: 800,
      y: 400,
      attrs: {
        body: {
          fill: '#FF9800',
          stroke: '',
        },
        title: {
          text: '提交PR',
        },
        text: {
          text: '一对一指导',
        },
        icon: {
          d: 'M20 35 L25 30 L30 35 M25 30 L25 40',
          strokeWidth: 2,
          refY: -5,
        },
        icon2: {
          d: 'M15 25 L35 25 L35 15 L15 15 Z',
          opacity: 0.6,
        },
      },
      animation: [
        [
          { 'attrs/icon/refY': 0 },
          {
            duration: 600,
            iterations: Infinity,
            direction: 'alternate',
          },
        ],
      ],
    })

    const rewardNode = graph.addNode({
      shape: 'custom-node',
      x: 350,
      y: 400,
      attrs: {
        body: {
          fill: '#9C27B0',
          stroke: '',
          filter: {
            name: 'highlight',
            args: {
              color: '#9C27B0',
              blur: 1,
              width: 0,
              opacity: 0.7,
            },
          },
        },
        title: {
          text: '获得奖励',
        },
        text: {
          text: '各种精美奖品',
        },
        icon: {
          d: 'M20 35 L15 35 L15 25 L25 25 L25 35 L20 35 ZM18 25 L18 20 C18 18 19 16 20 16 C21 16 22 18 22 20 L22 25',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
      },
      animation: [
        [
          { 'attrs/body/filter/args/width': 8 },
          {
            duration: 1500,
            iterations: Infinity,
          },
        ],
        [
          { 'attrs/body/filter/args/opacity': 0.1 },
          {
            duration: 1500,
            iterations: Infinity,
          },
        ],
      ],
    })

    const chatNode = graph.addNode({
      shape: 'custom-node',
      x: 0,
      y: 240,
      attrs: {
        body: {
          fill: '#00BCD4',
          stroke: '',
        },
        title: {
          text: '加入交流群',
        },
        text: {
          text: '获取第一手资讯',
        },
        icon: {
          refX: 10,
          refY: 10,
          d: 'M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H12L16 22V18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
      },
    })

    const edges = [
      {
        source: mainNode,
        target: issueNode,
      },
      {
        source: mainNode,
        target: docNode,
        attrs: {
          line: {
            stroke: '#C7D5F6',
            strokeWidth: 2,
            strokeDasharray: 5,
            strokeDashoffset: 0,
          },
        },
      },
      {
        source: mainNode,
        target: chatNode,
        markup: [
          {
            tagName: 'circle',
            selector: 'marker',
            attrs: {
              stroke: 'none',
              r: 5,
            },
          },
          ...(Shape.Edge.getMarkup() as any[]),
        ],
        attrs: {
          line: {
            stroke: '#A3B1BF',
            strokeWidth: 2,
            strokeDasharray: 5,
            strokeDashoffset: 0,
          },
          marker: {
            fill: '#C7D5F6',
            atConnectionRatio: 0,
          },
        },
        animation: [
          [
            { 'attrs/marker/atConnectionRatio': 1 },
            {
              duration: 2000,
              iterations: Infinity,
            },
          ],
        ],
      },
      {
        source: issueNode,
        target: prNode,
      },
      {
        source: issueNode,
        target: prNode,
      },
      {
        source: docNode,
        target: prNode,
        attrs: {
          line: {
            stroke: '#C7D5F6',
            strokeWidth: 2,
            strokeDasharray: 5,
            strokeDashoffset: 0,
          },
        },
      },
      {
        source: prNode,
        target: rewardNode,
      },
    ]

    graph.addEdges(
      edges.map((edge) => {
        return {
          connector: { name: 'smooth' },
          attrs: {
            line: {
              stroke: '#A3B1BF',
              strokeWidth: 2,
              strokeDasharray: 5,
              strokeDashoffset: 0,
            },
          },
          animation: [
            [
              { 'attrs/line/strokeDashoffset': -20 },
              {
                duration: 600,
                iterations: Infinity,
              },
            ],
          ],
          ...edge,
        }
      }),
    )

    graph.centerContent()
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
