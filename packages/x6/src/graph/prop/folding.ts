import { GraphBase } from './base'
import { Image } from '../../struct'

export interface FoldingOptions {
  /**
   * Specifies if folding (collapse and expand) via an image icon
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

  enableCellsFolding(refresh: boolean = true) {
    if (!this.isCellsFoldable()) {
      this.options.folding.enabled = true
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  disableCellsFolding(refresh: boolean = true) {
    if (this.isCellsFoldable()) {
      this.options.folding.enabled = false
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  setCellsFoldable(foldable: boolean, refresh: boolean = true) {
    if (foldable) {
      this.enableCellsFolding(refresh)
    } else {
      this.disableCellsFolding(refresh)
    }
  }

  toggleFolding(refresh: boolean = true) {
    if (this.isCellsFoldable()) {
      this.disableCellsFolding(refresh)
    } else {
      this.enableCellsFolding(refresh)
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

  setExpandedImage(image: Image, refresh: boolean = true) {
    if (this.getExpandedImage() !== image) {
      this.options.folding.expandedImage = image
      if (refresh) {
        this.view.validate()
      }
    }
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

  setCollapsedImage(image: Image, refresh: boolean = true) {
    if (this.getCollapsedImage() !== image) {
      this.options.folding.collapsedImage = image
      if (refresh) {
        this.view.validate()
      }
    }
    return this
  }

  get collapsedImage() {
    return this.getCollapsedImage()
  }

  set collapsedImage(image: Image) {
    this.setCollapsedImage(image)
  }
}
