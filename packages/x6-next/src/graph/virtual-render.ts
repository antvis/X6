import { Base } from './base'

export class VirtualRenderManager extends Base {
  protected init() {
    this.resetRenderArea()
    this.startListening()
  }

  protected startListening() {
    this.graph.on('translate', this.resetRenderArea, this)
    this.graph.on('scale', this.resetRenderArea, this)
    this.graph.on('resize', this.resetRenderArea, this)
  }

  protected stopListening() {
    this.graph.off('translate', this.resetRenderArea, this)
    this.graph.off('scale', this.resetRenderArea, this)
    this.graph.off('resize', this.resetRenderArea, this)
  }

  resetRenderArea() {
    const renderArea = this.graph.getGraphArea()
    this.graph.renderer.setRenderArea(renderArea)
  }

  dispose() {
    this.stopListening()
  }
}
