import React from 'react'
import { Button } from 'antd'
import { Graph, Node, Util, Dom, Rectangle } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container!: HTMLDivElement
  private graph: Graph
  private source: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
      mousewheel: true,
    })

    this.source = this.graph.addNode({
      shape: 'rect',
      x: 80,
      y: 80,
      width: 160,
      height: 160,
      markup: [
        {
          tagName: 'rect',
          selector: 'shape1',
        },
        {
          tagName: 'rect',
          selector: 'shape2',
        },
        {
          tagName: 'rect',
          selector: 'shape3',
        },
        {
          tagName: 'circle',
          selector: 'shape4',
        },
        {
          tagName: 'circle',
          selector: 'shape5',
        },
        {
          tagName: 'text',
          selector: 'shape6',
        },
        {
          tagName: 'g',
          selector: 'g1',
          children: [
            {
              tagName: 'g',
              selector: 'g2',
              children: [
                {
                  tagName: 'rect',
                  selector: 'shape7',
                },
              ],
            },
          ],
        },
      ],
      attrs: {
        shape1: {
          id: 's1',
          refWidth: '100%',
          refHeight: '100%',
          stroke: 'black',
        },
        shape2: {
          id: 's2',
          x: 10,
          y: 100,
          width: 50,
          height: 50,
          stroke: 'green',
          fill: 'transparent',
        },
        shape3: {
          id: 's3',
          refX: '50%',
          refY: '50%',
          refWidth: '50%',
          refHeight: '50%',
          stroke: 'green',
          fill: 'transparent',
        },
        shape4: {
          id: 's4',
          cx: 40,
          cy: 40,
          r: 40,
          stroke: 'red',
          fill: 'white',
        },
        shape5: {
          id: 's5',
          refCx: '50%',
          refCy: '50%',
          refR: '20%',
          stroke: 'red',
          fill: 'white',
        },
        shape6: {
          id: 's6',
          text: 'text',
        },
        g1: {
          transform: 'matrix(1.2,0,0,1.2,80,80)',
        },
        g2: {
          transform: 'matrix(1,0,0,1,100,100)',
        },
        shape7: {
          id: 's7',
          x: 30,
          y: 30,
          width: 50,
          height: 50,
          fill: 'yellow',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: 10,
                dy: -10,
                angle: 20,
              },
            },
            attrs: {
              circle: {
                r: 8,
                magnet: true,
                stroke: 'red',
                strokeWidth: 2,
                fill: '#fff',
                id: 's8',
              },
            },
          },
          right: {
            position: {
              name: 'absolute',
              args: { x: 50, y: 50 },
            },
            markup: {
              tagName: 'rect',
              selector: 'shape9',
              attrs: {
                x: 50,
                y: 50,
                width: 30,
                height: 30,
                fill: '#fff',
                stroke: 'blue',
                id: 's9',
              },
            },
          },
          bottom: {
            position: {
              name: 'line',
              args: {
                start: { x: 10, y: 10 },
                end: { x: 210, y: 10 },
              },
            },
            attrs: {
              circle: {
                id: 's10',
              },
            },
          },
        },
        items: [
          {
            id: '1',
            group: 'top',
          },
          {
            id: '2',
            group: 'right',
          },
          {
            id: '3',
            group: 'bottom',
          },
        ],
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  test = () => {
    const view = this.graph.findViewByCell(this.source)
    const container = view?.container
    const q = [
      container?.querySelector('#s1')!,
      container?.querySelector('#s2')!,
      container?.querySelector('#s3')!,
      container?.querySelector('#s4')!,
      container?.querySelector('#s5')!,
      container?.querySelector('#s6')!,
      container?.querySelector('#s7')!,
      container?.querySelector('#s8')!,
      container?.querySelector('#s9')!,
      container?.querySelector('#s10')!,
    ]
    const fix = (num: number) => num.toFixed(1)
    const isSameMatrix = (matrix1: DOMMatrix, matrix2: DOMMatrix) => {
      return (
        fix(matrix1.a) === fix(matrix2.a) &&
        fix(matrix1.b) === fix(matrix2.b) &&
        fix(matrix1.c) === fix(matrix2.c) &&
        fix(matrix1.d) === fix(matrix2.d) &&
        fix(matrix1.e) === fix(matrix2.e) &&
        fix(matrix1.f) === fix(matrix2.f)
      )
    }
    const isSameBounding = (rect1: Rectangle, rect2: Rectangle) => {
      return (
        fix(rect1.x) === fix(rect2.x) &&
        fix(rect1.y) === fix(rect2.y) &&
        fix(rect1.width) === fix(rect2.width) &&
        fix(rect1.height) === fix(rect2.height)
      )
    }

    // matrix
    let s = performance.now()
    const oldMatrixList = q.map((item) =>
      Dom.getTransformToElement(item as any, container as SVGElement),
    )
    console.log('old getMatrixOfElement spend:', performance.now() - s)

    s = performance.now()
    const newMatrixList = q.map((item) =>
      Dom.getTransformToParentElement(
        item as SVGElement,
        container as SVGElement,
      ),
    )
    console.log('new getMatrixOfElement spend:', performance.now() - s)

    let isSame = oldMatrixList.every((item, index) => {
      const martix = newMatrixList[index]
      if (item && martix) {
        return isSameMatrix(item, martix)
      }
      return true
    })
    console.log(`getMatrixOfElement test ${isSame ? 'success' : 'failed'}`)

    // bbox
    s = performance.now()
    const oldBoundingList = q.map((item) => Util.getBBox(item as SVGElement))
    console.log('old getBoundingRectOfElement spend:', performance.now() - s)

    s = performance.now()
    const newBoundingList = q.map((item) => Util.getBBoxV2(item as SVGElement))
    console.log('new getBoundingRectOfElement spend:', performance.now() - s)

    isSame = oldBoundingList.every((item, index) => {
      const bounding = newBoundingList[index]
      if (item && bounding) {
        return isSameBounding(item, bounding)
      }
      return true
    })
    console.log(
      `getBoundingRectOfElement test ${isSame ? 'success' : 'failed'}`,
    )
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <Button onClick={this.test}>Test</Button>
      </div>
    )
  }
}
