import { ArrayExt } from '../../util'
import { Rectangle } from '../../geometry'
import { v } from '../../v'
import { Attr } from '../attr'
import { View } from './view'
import { Node } from './node'
import { CellView } from './cell-view'
import { Globals } from './globals'
import { PortData } from './port-data'
import { Markup } from './markup'
import { CellViewAttr } from './cell-view-attr'

export class NodeView<
  C extends Node = Node,
  Options extends NodeView.Options = NodeView.Options
> extends CellView<C, Options> {
  protected readonly portMarkup = Markup.portMarkup
  protected readonly portLabelMarkup = Markup.portLabelMarkup
  protected readonly portContainerMarkup = Markup.portContainerMarkup
  protected readonly rotatableSelector: string = 'rotatable'
  protected readonly scalableSelector: string = 'scalable'
  public scalableNode: Element | null = null
  public rotatableNode: Element | null = null

  protected portsCache: { [id: string]: NodeView.PortCache } = {}

  confirmUpdate(flag: number, options: any = {}) {
    let ref = flag
    if (this.hasAction(ref, 'ports')) {
      this.removePorts()
      this.cleanPortsCache()
    }

    if (this.hasAction(ref, 'render')) {
      this.render()
      // this.updateTools(opt)
      ref = this.removeAction(ref, [
        'render',
        'update',
        'resize',
        'translate',
        'rotate',
        'ports',
      ])
    } else {
      ref = this.handleAction(
        ref,
        'resize',
        () => this.resize(options),
        'update', // Resize method is calling `update()` internally
      )

      ref = this.handleAction(
        ref,
        'update',
        () => this.update(),
        // `update()` will render ports when useCSSSelectors are enabled
        Globals.useCSSSelector ? 'ports' : null,
      )

      ref = this.handleAction(ref, 'translate', () => this.translate())
      ref = this.handleAction(ref, 'rotate', () => this.rotate())
      ref = this.handleAction(ref, 'ports', () => this.renderPorts())
    }

    if (this.hasAction(ref, 'tools')) {
      // this.updateTools(options)
      ref = this.removeAction(ref, 'tools')
    }

    return ref
  }

  update(partialAttrs?: Attr.CellAttrs) {
    this.cleanCache()

    // When CSS selector strings are used, make sure no rule matches port nodes.
    if (Globals.useCSSSelector) {
      this.removePorts()
    }

    const node = this.cell
    const size = node.size
    const attrs = node.attrs || {}
    this.updateAttrs(this.container, attrs, {
      attrs: partialAttrs === attrs ? null : partialAttrs,
      rootBBox: new Rectangle(0, 0, size.width, size.height),
      selectors: this.selectors,
      scalableNode: this.scalableNode,
      rotatableNode: this.rotatableNode,
    })

    if (Globals.useCSSSelector) {
      this.renderPorts()
    }
  }

  protected renderMarkup() {
    const markup = this.cell.markup
    if (markup) {
      if (typeof markup === 'string') {
        return this.renderStringMarkup(markup)
      }

      return this.renderJSONMarkup(markup)
    }

    throw new TypeError('Invalid node markup.')
  }

  protected renderJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[]) {
    const ret = this.parseJSONMarkup(markup, this.container)
    const one = (elems: Element | Element[] | null) =>
      Array.isArray(elems) ? elems[0] : elems
    this.selectors = ret.selectors
    this.rotatableNode = one(this.selectors[this.rotatableSelector])
    this.scalableNode = one(this.selectors[this.scalableSelector])
    this.container.appendChild(ret.fragment)
  }

  protected renderStringMarkup(markup: string) {
    v.append(this.container, v.batch(markup))
    this.rotatableNode = v.findOne(this.container, `.${this.rotatableSelector}`)
    this.scalableNode = v.findOne(this.container, `.${this.scalableSelector}`)
    this.selectors = {}
    if (this.rootSelector) {
      this.selectors[this.rootSelector] = this.container
    }
  }

  render() {
    this.empty()
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
      this.updateTransform()
    }

    if (!Globals.useCSSSelector) {
      this.renderPorts()
    }

    return this
  }

  resize(opt: any = {}) {
    if (this.scalableNode) {
      return this.updateSize(opt)
    }

    if (this.cell.rotation) {
      this.rotate()
    }

    this.update()
  }

  translate() {
    if (this.rotatableNode) {
      return this.updateTranslation()
    }

    this.updateTransform()
  }

  rotate() {
    if (this.rotatableNode) {
      this.updateRotation()
      // It's necessary to call the update for the nodes outside
      // the rotatable group referencing nodes inside the group
      this.update()
      return
    }

    this.updateTransform()
  }

  protected getTranslationString() {
    const position = this.cell.position
    return `translate(${position.x},${position.y})`
  }

  protected getRotationString() {
    const rotation = this.cell.rotation
    if (rotation) {
      const size = this.cell.size
      return `rotate(${rotation},${size.width / 2},${size.height / 2})`
    }
  }

  protected updateTransform() {
    let transform = this.getTranslationString()
    const rot = this.getRotationString()
    if (rot) {
      transform += ` ${rot}`
    }
    this.container.setAttribute('transform', transform)
  }

  protected updateRotation() {
    if (this.rotatableNode != null) {
      const transform = this.getRotationString()
      if (transform != null) {
        this.rotatableNode.setAttribute('transform', transform)
      } else {
        this.rotatableNode.removeAttribute('transform')
      }
    }
  }

  protected updateTranslation() {
    this.container.setAttribute('transform', this.getTranslationString())
  }

  protected updateSize(opt: any = {}) {
    const cell = this.cell
    const size = cell.size
    const angle = cell.rotation
    const scalableNode = this.scalableNode!

    // Getting scalable group's bbox.
    // Due to a bug in webkit's native SVG .getBBox implementation, the
    // bbox of groups with path children includes the paths' control points.
    // To work around the issue, we need to check whether there are any path
    // elements inside the scalable group.
    let recursive = false
    if (scalableNode.getElementsByTagName('path').length > 0) {
      // If scalable has at least one descendant that is a path, we need
      // toswitch to recursive bbox calculation. Otherwise, group bbox
      // calculation works and so we can use the (faster) native function.
      recursive = true
    }
    const scalableBBox = v.getBBox(scalableNode as SVGElement, { recursive })

    // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero
    // which can happen if the element does not have any content.
    const sx = size.width / (scalableBBox.width || 1)
    const sy = size.height / (scalableBBox.height || 1)
    scalableNode.setAttribute('transform', `scale(${sx},${sy})`)

    // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
    // Order of transformations is significant but we want to reconstruct the object always in the order:
    // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
    // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
    // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
    // around the center of the resized object (which is a different origin then the origin of the previous rotation)
    // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.

    // Cancel the rotation but now around a different origin, which is the center of the scaled object.
    const rotatableNode = this.rotatableNode
    if (rotatableNode != null) {
      const transform = rotatableNode.getAttribute('transform')
      if (transform) {
        rotatableNode.setAttribute(
          'transform',
          `${transform} rotate(${-angle},${size.width / 2},${size.height / 2})`,
        )
        const rotatableBBox = v.getBBox(scalableNode as SVGElement, {
          target: this.graph.drawPane,
        })

        // Store new x, y and perform rotate() again against the new rotation origin.
        cell.store.set(
          'position',
          { x: rotatableBBox.x, y: rotatableBBox.y },
          { updated: true, ...opt },
        )
        this.translate()
        this.rotate()
      }
    }

    // Update must always be called on non-rotated element. Otherwise,
    // relative positioning would work with wrong (rotated) bounding boxes.
    this.update()
  }

  // #region ports

  // fineElemInPort
  findPortNode(portId: string, selector?: string) {
    const cache = this.portsCache[portId]
    if (!cache) {
      return null
    }
    const portRoot = cache.portContentElement
    const portSelectors = cache.portContentSelectors || {}
    return this.findOne(selector, portRoot, portSelectors)
  }

  protected initializePorts() {
    this.cleanPortsCache()
  }

  protected refreshPorts() {
    this.removePorts()
    this.cleanPortsCache()
    this.renderPorts()
  }

  protected cleanPortsCache() {
    this.portsCache = {}
  }

  protected removePorts() {
    Object.keys(this.portsCache).forEach(portId => {
      const cached = this.portsCache[portId]
      v.remove(cached.portElement)
    })
  }

  protected renderPorts() {
    const container = this.getPortsContainer()

    // references to rendered elements without z-index
    const references: Element[] = []
    container.childNodes.forEach(child => {
      references.push(child as Element)
    })

    const portsGropsByZ = ArrayExt.groupBy(
      this.cell.portData.getPorts(),
      'zIndex',
    )

    const autoZIndexKey = 'auto'
    // render non-z first
    if (portsGropsByZ[autoZIndexKey]) {
      portsGropsByZ[autoZIndexKey].forEach(port => {
        const portElement = this.getPortElement(port)
        container.append(portElement)
        references.push(portElement)
      })
    }

    Object.keys(portsGropsByZ).forEach(key => {
      if (key !== autoZIndexKey) {
        const zIndex = parseInt(key, 10)
        this.appendPorts(portsGropsByZ[key], zIndex, references)
      }
    })

    this.updatePorts()
  }

  protected getPortsContainer() {
    return this.rotatableNode || this.container
  }

  protected appendPorts(
    ports: PortData.Port[],
    zIndex: number,
    refs: Element[],
  ) {
    const elems = ports.map(p => this.getPortElement(p))
    if (refs[zIndex] || zIndex < 0) {
      v.before(refs[Math.max(zIndex, 0)], elems)
    } else {
      v.append(this.getPortsContainer(), elems)
    }
  }

  protected getPortElement(port: PortData.Port) {
    const cached = this.portsCache[port.id]
    if (cached) {
      return cached.portElement
    }
    return this.createPortElement(port)
  }

  protected createPortElement(port: PortData.Port) {
    let renderResult = Markup.renderMarkup(this.getPortContainerMarkup())
    const portElement = renderResult.elem
    if (portElement == null) {
      throw new Error('Invalid port container markup.')
    }

    renderResult = Markup.renderMarkup(this.getPortMarkup(port))
    const portContentElement = renderResult.elem
    const portContentSelectors = renderResult.selectors

    if (portContentElement == null) {
      throw new Error('Invalid port markup.')
    }

    this.setAttrs(
      {
        port: port.id,
        'port-group': port.group,
      },
      portContentElement,
    )

    renderResult = Markup.renderMarkup(this.getPortLabelMarkup(port.label))
    const portLabelElement = renderResult.elem
    const portLabelSelectors = renderResult.selectors

    if (portLabelElement == null) {
      throw new Error('Invalid port label markup.')
    }

    let portSelectors: Markup.Selectors | undefined
    if (portContentSelectors && portLabelSelectors) {
      for (const key in portLabelSelectors) {
        if (portContentSelectors[key] && key !== this.rootSelector) {
          throw new Error('Selectors within port must be unique.')
        }
      }
      portSelectors = {
        ...portContentSelectors,
        ...portLabelSelectors,
      }
    } else {
      portSelectors = portContentSelectors || portLabelSelectors
    }

    v.addClass(portElement, 'x6-port')
    v.addClass(portContentElement, 'x6-port-body')
    v.addClass(portLabelElement, 'x6-port-label')

    portElement.appendChild(portContentElement)
    portElement.appendChild(portLabelElement)

    this.portsCache[port.id] = {
      portElement,
      portSelectors,
      portLabelElement,
      portLabelSelectors,
      portContentElement,
      portContentSelectors,
    }

    return portElement
  }

  protected updatePorts() {
    // layout ports without group
    this.updatePortGroup()
    // layout ports with explicit group
    Object.keys(this.cell.portData.groups).forEach(groupName =>
      this.updatePortGroup(groupName),
    )
  }

  protected updatePortGroup(groupName?: string) {
    const bbox = Rectangle.fromSize(this.cell.size)
    const portsMetrics = this.cell.portData.getPortsLayoutByGroup(
      groupName,
      bbox,
    )

    for (let i = 0, n = portsMetrics.length; i < n; i += 1) {
      const metrics = portsMetrics[i]
      const portId = metrics.portId
      const cached = this.portsCache[portId] || {}
      const portLayout = metrics.portLayout
      this.applyPortTransform(cached.portElement, portLayout)
      if (metrics.portAttrs != null) {
        const options: Partial<CellViewAttr.UpdateAttrsOptions> = {
          selectors: cached.portSelectors || {},
        }

        if (metrics.portSize) {
          options.rootBBox = Rectangle.fromSize(metrics.portSize)
        }

        this.updateAttrs(cached.portElement, metrics.portAttrs, options)
      }

      const portLabelLayout = metrics.portLabelLayout
      if (portLabelLayout) {
        this.applyPortTransform(
          cached.portLabelElement,
          portLabelLayout,
          -portLayout.angle || 0,
        )

        if (portLabelLayout.attrs) {
          const options: Partial<CellViewAttr.UpdateAttrsOptions> = {
            selectors: cached.portLabelSelectors || {},
          }

          if (metrics.labelSize) {
            options.rootBBox = Rectangle.fromSize(metrics.labelSize)
          }

          this.updateAttrs(
            cached.portLabelElement,
            portLabelLayout.attrs,
            options,
          )
        }
      }
    }
  }

  protected applyPortTransform(
    element: Element,
    transformData: View.TransformData,
    initialAngle: number = 0,
  ) {
    const matrix = v
      .createSVGMatrix()
      .rotate(initialAngle)
      .translate(transformData.x || 0, transformData.y || 0)
      .rotate(transformData.angle || 0)

    v.transform(element as SVGElement, matrix, { absolute: true })
  }

  protected getPortContainerMarkup() {
    return this.cell.portContainerMarkup || this.portContainerMarkup
  }

  protected getPortMarkup(port: PortData.Port) {
    return port.markup || this.cell.portMarkup || this.portMarkup
  }

  protected getPortLabelMarkup(label: PortData.Label) {
    return label.markup || this.cell.portLabelMarkup || this.portLabelMarkup
  }

  // #endregion
}

export namespace NodeView {
  export interface Options extends CellView.Options {}

  export interface PortCache {
    portElement: Element
    portSelectors?: Markup.Selectors | null
    portLabelElement: Element
    portLabelSelectors?: Markup.Selectors | null
    portContentElement: Element
    portContentSelectors?: Markup.Selectors | null
  }
}

NodeView.setDefaults({
  isSvgElement: true,
  priority: 0,
  bootstrap: ['render'],
  actions: {
    markup: ['render'],
    attrs: ['update'],
    size: ['resize', 'ports', 'tools'],
    rotation: ['rotate', 'tools'],
    position: ['translate', 'tools'],
    ports: ['ports'],
  },
})
