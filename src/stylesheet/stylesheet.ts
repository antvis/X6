import { Perimeter } from './perimeter'
import { Style } from '../types'
import { Shapes } from '../struct'

export class StyleSheet {
  styles: {
    defaultNode: Style,
    defaultEdge: Style,
    [name: string]: Style,
  }

  constructor() {
    this.styles = {
      defaultNode: this.createDefaultNodeStyle(),
      defaultEdge: this.createDefaultEdgeStyle(),
    }
  }

  createDefaultNodeStyle(): Style {
    const style: Style = {
      shape: Shapes.rectangle,
      perimeter: Perimeter.rectangle,
      align: 'center',
      verticalAlign: 'middle',
      fill: '#f6edfc',
      stroke: '#712ed1',
      fontColor: 'rgba(0, 0, 0, 0.65)',
    }

    return style
  }

  createDefaultEdgeStyle(): Style {
    const style: Style = {
      shape: Shapes.connector,
      endArrow: Shapes.arrowClassic,
      align: 'center',
      verticalAlign: 'middle',
      stroke: '#8f8f8f',
      fontColor: 'rgba(0, 0, 0, 0.65)',
    }
    return style
  }

  setDefaultNodeStyle(style: Style) {
    this.styles.defaultNode = style
  }

  setDefaultEdgeStyle(style: Style) {
    this.styles.defaultEdge = style
  }

  getDefaultNodeStyle() {
    return this.styles.defaultNode
  }

  getDefaultEdgeStyle() {
    return this.styles.defaultEdge
  }

  setCellStyle(name: string, style: Style) {
    this.styles[name] = style
  }
}
