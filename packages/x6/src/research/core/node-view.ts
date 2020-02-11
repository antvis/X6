import { CellView } from './cell-view'
import { config } from './config'
import { v } from '../../v'
import { Node } from './node'

export class NodeView extends CellView<Node> {
  presentationAttributes = {
    attrs: ['UPDATE'],
    position: ['TRANSLATE', 'TOOLS'],
    size: ['RESIZE', 'PORTS', 'TOOLS'],
    angle: ['ROTATE', 'TOOLS'],
    markup: ['RENDER'],
    ports: ['PORTS'],
  }

  initFlag = ['RENDER']

  UPDATE_PRIORITY = 0

  rotatableSelector: string = 'rotatable'
  scalableSelector: string = 'scalable'
  scalableNode: Element | null = null
  rotatableNode: Element | null = null

  confirmUpdate(flag: number, options: any = {}) {
    let sub = flag
    if (this.hasFlag(sub, 'PORTS')) {
      // this._removePorts()
      // this._cleanPortsCache()
    }

    if (this.hasFlag(sub, 'RENDER')) {
      this.render()
      // this.updateTools(opt)
      sub = this.removeFlag(sub, [
        'RENDER',
        'UPDATE',
        'RESIZE',
        'TRANSLATE',
        'ROTATE',
        'PORTS',
      ])
    } else {
      // Skip this branch if render is required
      if (this.hasFlag(sub, 'RESIZE')) {
        this.resize(options)
        // Resize method is calling `update()` internally
        sub = this.removeFlag(sub, ['RESIZE', 'UPDATE'])
      }

      if (this.hasFlag(sub, 'UPDATE')) {
        this.update()
        sub = this.removeFlag(sub, 'UPDATE')
        if (config.useCSSSelectors) {
          // `update()` will render ports when useCSSSelectors are enabled
          sub = this.removeFlag(sub, 'PORTS')
        }
      }

      if (this.hasFlag(sub, 'TRANSLATE')) {
        this.translate()
        sub = this.removeFlag(sub, 'TRANSLATE')
      }

      if (this.hasFlag(sub, 'ROTATE')) {
        this.rotate()
        sub = this.removeFlag(sub, 'ROTATE')
      }

      if (this.hasFlag(sub, 'PORTS')) {
        // this._renderPorts()
        sub = this.removeFlag(sub, 'PORTS')
      }
    }

    if (this.hasFlag(sub, 'TOOLS')) {
      // this.updateTools(options)
      sub = this.removeFlag(sub, 'TOOLS')
    }

    return sub
  }

  update() {
    // update(_: any, renderingOnlyAttrs: Attributes) {
    this.cleanNodesCache()

    // When CSS selector strings are used, make sure no rule matches port nodes.
    // const { useCSSSelectors } = config
    // if (useCSSSelectors) this._removePorts()

    // const model = this.model
    // const modelAttrs = model.attr()
    // this.updateDOMSubtreeAttributes(this.el, modelAttrs, {
    //   rootBBox: new Rect(model.size()),
    //   selectors: this.selectors,
    //   scalableNode: this.scalableNode,
    //   rotatableNode: this.rotatableNode,
    //   // Use rendering only attributes if they differs from the model attributes
    //   roAttributes:
    //     renderingOnlyAttrs === modelAttrs ? null : renderingOnlyAttrs,
    // })

    // if (useCSSSelectors) this._renderPorts()
  }

  protected renderMarkup() {
    const element = this.cell
    const markup = element.markup
    if (!markup) throw new Error('dia.ElementView: markup required')
    // if (Array.isArray(markup)) return this.renderJSONMarkup(markup)
    if (typeof markup === 'string') return this.renderStringMarkup(markup)
    throw new Error('dia.ElementView: invalid markup')
  }

  // protected renderJSONMarkup(markup: CellView.JSONElement[]) {
  //   const doc = this.parseDOMJSON(markup, this.elem)
  //   this.selectors = doc.selectors
  //   this.rotatableNode = this.selectors[this.rotatableSelector] || null
  //   this.scalableNode = this.selectors[this.scalableSelector] || null
  //   // Fragment
  //   v.append(this.elem, doc.fragment)
  // }

  protected renderStringMarkup(markup: string) {
    v.append(this.container, v.batch(markup))
    // Cache transformation groups
    this.rotatableNode = v.findOne(this.container, '.rotatable')
    this.scalableNode = v.findOne(this.container, '.scalable')
    this.selectors = {}
    this.selectors[this.selector] = this.container
  }

  render() {
    v.empty(this.container)
    this.renderMarkup()
    if (this.scalableNode) {
      // Double update is necessary for elements with the scalable group only
      // Note the resize() triggers the other `update`.
      this.update()
    }

    this.resize()

    if (this.rotatableNode) {
      // Translate transformation is applied on `this.el` while the rotation
      // transformation on `this.rotatableNode`
      this.rotate()
      this.translate()
    } else {
      this.updateTransformation()
    }

    if (!config.useCSSSelectors) {
      // this._renderPorts()
    }

    return this
  }

  resize(opt: any = {}) {
    if (this.scalableNode) {
      return this.sgResize(opt)
    }

    if (this.cell.rotation) {
      this.rotate()
    }

    this.update()
  }

  translate() {
    if (this.rotatableNode) {
      return this.rgTranslate()
    }

    this.updateTransformation()
  }

  rotate() {
    if (this.rotatableNode) {
      this.rgRotate()
      // It's necessary to call the update for the nodes outside
      // the rotatable group referencing nodes inside the group
      this.update()
      return
    }

    this.updateTransformation()
  }

  updateTransformation() {
    let transformation = this.getTranslateString()
    const rotateString = this.getRotateString()
    if (rotateString) {
      transformation += ` ${rotateString}`
    }
    this.container.setAttribute('transform', transformation)
  }

  getTranslateString() {
    const position = this.cell.position
    return `translate(${position.x},${position.y})`
  }

  getRotateString() {
    const angle = this.cell.rotation
    if (!angle) {
      return ''
    }

    const size = this.cell.size
    return `rotate(${angle},${size.width / 2},${size.height / 2})`
  }

  rgRotate() {
    this.rotatableNode?.setAttribute('transform', this.getRotateString())
  }

  rgTranslate() {
    this.container.setAttribute('transform', this.getTranslateString())
  }

  sgResize(opt: any = {}) {
    const model = this.cell
    const size = model.size
    const angle = model.rotation
    const scalable = this.scalableNode!

    // Getting scalable group's bbox.
    // Due to a bug in webkit's native SVG .getBBox implementation, the bbox of groups with path children includes the paths' control points.
    // To work around the issue, we need to check whether there are any path elements inside the scalable group.
    let recursive = false
    if (scalable.getElementsByTagName('path').length > 0) {
      // If scalable has at least one descendant that is a path, we need to switch to recursive bbox calculation.
      // If there are no path descendants, group bbox calculation works and so we can use the (faster) native function directly.
      recursive = true
    }
    const scalableBBox = v.getBBox(scalable as any, { recursive })

    // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero which can happen if the element does not have any content. By making
    // the width/height 1, we prevent HTML errors of the type `scale(Infinity, Infinity)`.
    const sx = size.width / (scalableBBox.width || 1)
    const sy = size.height / (scalableBBox.height || 1)
    scalable?.setAttribute('transform', `scale(${sx},${sy})`)

    // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
    // Order of transformations is significant but we want to reconstruct the object always in the order:
    // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
    // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
    // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
    // around the center of the resized object (which is a different origin then the origin of the previous rotation)
    // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.

    // Cancel the rotation but now around a different origin, which is the center of the scaled object.
    const rotatable = this.rotatableNode
    const rotation = rotatable && rotatable.getAttribute('transform')
    if (rotation) {
      rotatable?.setAttribute(
        'transform',
        `${rotation} rotate(${-angle},${size.width / 2},${size.height / 2})`,
      )
      const rotatableBBox = v.getBBox(scalable as any, {
        target: this.paper.cells,
      })

      // Store new x, y and perform rotate() again against the new rotation origin.
      model.store.set(
        'position',
        { x: rotatableBBox.x, y: rotatableBBox.y },
        { updateHandled: true, ...opt },
      )
      this.translate()
      this.rotate()
    }

    // Update must always be called on non-rotated element. Otherwise, relative positioning
    // would work with wrong (rotated) bounding boxes.
    this.update()
  }
}
