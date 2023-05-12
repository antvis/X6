import { Vector, EdgeView, NodeView, Dom } from '@antv/x6'

const animateToken: SVGElement[] = []

export const removeAnimationElem = (elem: SVGElement) => {
  const index = animateToken.findIndex((token) => token === elem)
  if (index) {
    animateToken.splice(index, 1)
  }
  Dom.remove(elem)
}

export const animateAlongEdge = (
  edgeView: EdgeView,
  compelete?: () => void,
) => {
  const token = Vector.create('circle', { r: 4, fill: 'red' })
  const path = edgeView.container.querySelector('path')
  const animate = Dom.createSvgElement<SVGAnimateMotionElement>('animateMotion')
  const mpath = Dom.createSvgElement('mpath')

  const attrs = {
    dur: '1000ms',
    repeatCount: '1',
    calcMode: 'linear',
    fill: 'freeze',
  }

  const id = Dom.ensureId(path!)
  animate.appendChild(mpath)
  token.node.appendChild(animate)
  token.appendTo(edgeView.container)
  Dom.attr(mpath, { 'xlink:href': `#${id}` })
  Dom.attr(animate, attrs)

  animateToken.push(token.node)
  animate.addEventListener('endEvent', () => {
    removeAnimationElem(token.node)
    if (compelete) {
      compelete()
    }
  })

  const ani = animate as any

  setTimeout(() => {
    ani.beginElement()
  })
}

export const animateAlongNode = (
  nodeView: NodeView,
  path: string,
  compelete?: () => void,
) => {
  const token = Vector.create('circle', { r: 4, fill: 'red' })
  const animate = Dom.createSvgElement<SVGAnimateMotionElement>('animateMotion')

  const attrs = {
    dur: '2000ms',
    repeatCount: '1',
    calcMode: 'linear',
    fill: 'freeze',
  }

  Dom.attr(animate, {
    ...attrs,
    path,
  })

  token.append(animate)
  nodeView.container.appendChild(token.node)
  animateToken.push(token.node)

  animate.addEventListener('endEvent', () => {
    removeAnimationElem(token.node)
    if (compelete) {
      compelete()
    }
  })

  const ani = animate as any

  setTimeout(() => {
    ani.beginElement()
  })
}

export const clearAnimation = () => {
  const animations = [...animateToken]
  animations.forEach((item) => {
    removeAnimationElem(item)
  })
}
