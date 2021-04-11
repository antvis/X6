import { Global } from '../global'
import { createSVGNode } from './dom'

export function withSvgContext<T>(callback: (svg: SVGSVGElement) => T) {
  const svg = createSVGNode<SVGSVGElement>('svg')

  svg.setAttribute('width', '2')
  svg.setAttribute('height', '0')
  svg.setAttribute('focusable', 'false')
  svg.setAttribute('aria-hidden', 'true')

  const style = svg.style
  style.opacity = '0'
  style.position = 'absolute'
  style.left = '-100%'
  style.top = '-100%'
  style.overflow = 'hidden'

  const wrap = Global.document.body || Global.document.documentElement
  wrap.appendChild(svg)
  const ret = callback(svg)
  wrap.removeChild(svg)
  return ret
}

export function withPathContext<T>(callback: (path: SVGPathElement) => T) {
  return withSvgContext<T>((svg) => {
    const path = createSVGNode<SVGPathElement>('path')
    svg.appendChild(path)
    return callback(path)
  })
}
