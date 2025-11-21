import { Graph } from '@antv/x6'
import React from 'react'
import '../index.less'

export class AnimateElementExample extends React.Component {
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

    const node1 = graph.addNode({
      shape: 'rect',
      x: 10,
      y: 10,
      width: 80,
      height: 40,
      label: 'rect',
    })
    const view1 = graph.findViewByCell(node1)

    view1?.once('view:render', ({ view }) => {
      // 可使用 animate、animateMotion、animateTransform 等原生svg动画元素来实现动画
      // 元素相关API可参考：https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animateMotion
      const animateEle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate',
      )
      animateEle.setAttribute('attributeType', 'CSS')
      animateEle.setAttribute('attributeName', 'fill')
      animateEle.setAttribute('from', 'red')
      animateEle.setAttribute('to', 'green')
      animateEle.setAttribute('dur', '2s')
      animateEle.setAttribute('repeatCount', 'indefinite')

      view?.container?.querySelector('rect')?.appendChild(animateEle)
    })

    const node2 = graph.addNode({
      shape: 'rect',
      x: 80,
      y: 120,
      width: 40,
      height: 40,
    })
    const view2 = graph.findViewByCell(node2)

    view2?.once('view:render', ({ view }) => {
      const animateEle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animateTransform',
      )
      animateEle.setAttribute('attributeType', 'XML')
      animateEle.setAttribute('attributeName', 'transform')
      animateEle.setAttribute('type', 'rotate')
      animateEle.setAttribute('from', '0 0 0')
      animateEle.setAttribute('to', '360 0 0')
      animateEle.setAttribute('dur', '3s')
      animateEle.setAttribute('repeatCount', 'indefinite')

      view?.container?.querySelector('rect')?.appendChild(animateEle)
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
