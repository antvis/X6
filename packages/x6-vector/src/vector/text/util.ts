import { Global } from '../../global'

export function getFontSize(node: Element) {
  const style = Global.window.getComputedStyle(node)
  const fontSize = style.getPropertyValue('font-size') || '14px'
  return parseFloat(fontSize)
}
