import { NodeView, Markup } from '@antv/x6'

export class SimpleNodeView extends NodeView {
  protected readonly markup: Markup.JSONMarkup = {
    tagName: 'rect',
    selector: 'body',
    attrs: {
      fill: '#873bf4',
    },
  }

  protected body: SVGRectElement

  render() {
    this.empty()
    const doc = this.parseJSONMarkup(this.markup, this.container)
    this.body = doc.selectors.body as SVGRectElement
    this.container.append(doc.fragment)
    this.updateNodeSize()
    this.updateTransform()
    return this
  }

  updateNodeSize() {
    var size = this.cell.getSize()
    this.setAttrs(size, this.body)
  }
}
