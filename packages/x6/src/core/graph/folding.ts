import { GraphBase } from './base'
import { Image } from '../../struct'

export interface FoldingOptions {
  /**
   * If folding (collapse and expand) via an image icon
   * in the graph should be enabled.
   *
   * Default is `true`.
   */
  enabled: boolean
  collapsedImage: Image
  expandedImage: Image
}

export class GraphFolding extends GraphBase {
  isCellsFoldable() {
    return this.options.folding.enabled
  }

  enableCellsFolding() {
    this.options.folding.enabled = true
    this.view.validate()
    return this
  }

  disableCellsFolding() {
    this.options.folding.enabled = false
    this.view.validate()
    return this
  }

  setCellsFoldable(foldable: boolean) {
    if (foldable) {
      this.enableCellsFolding()
    } else {
      this.disableCellsFolding()
    }
  }

  toggleFolding() {
    if (this.isCellsFoldable()) {
      this.disableCellsFolding()
    } else {
      this.enableCellsFolding()
    }
    return this
  }

  get cellsFoldable() {
    return this.isCellsFoldable()
  }

  set cellsFoldable(foldable: boolean) {
    this.setCellsFoldable(foldable)
  }

  getExpandedImage() {
    return this.options.folding.expandedImage
  }

  setExpandedImage(image: Image) {
    this.options.folding.expandedImage = image
    this.view.validate()
    return this
  }

  get expandedImage() {
    return this.getExpandedImage()
  }

  set expandedImage(image: Image) {
    this.setExpandedImage(image)
  }

  getCollapsedImage() {
    return this.options.folding.collapsedImage
  }

  setCollapsedImage(image: Image) {
    this.options.folding.collapsedImage = image
    this.view.validate()
    return this
  }

  get collapsedImage() {
    return this.getCollapsedImage()
  }

  set collapsedImage(image: Image) {
    this.setCollapsedImage(image)
  }
}
