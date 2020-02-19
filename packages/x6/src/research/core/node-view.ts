import { CellView } from './cell-view'
import { BaseView } from './base-view'
import { config } from './config'
import { v } from '../../v'
import { Node } from './node'
import { Rectangle } from '../../geometry'
import { Attribute } from '../attr'
import { PortData } from './port-data'
import { ArrayExt } from '../../util'

export class NodeView extends CellView<Node> {
  protected readonly rotatableSelector: string = 'rotatable'
  protected readonly scalableSelector: string = 'scalable'
  public scalableNode: Element | null = null
  public rotatableNode: Element | null = null

  protected portsCache: { [id: string]: NodeView.PortCache } = {}
  protected portContainerMarkup: BaseView.Markup = 'g'
  protected portMarkup: BaseView.Markup = {
    tagName: 'circle',
    selector: 'circle',
    attrs: {
      r: 10,
      fill: '#FFFFFF',
      stroke: '#000000',
    },
  }
  protected portLabelMarkup: BaseView.Markup = {
    tagName: 'text',
    selector: 'text',
    attrs: {
      fill: '#000000',
    },
  }

  configure() {
    return {
      UPDATE_PRIORITY: 0,
      initFlag: [NodeView.Flag.render],
      presentationAttributes: {
        markup: [NodeView.Flag.render],
        attrs: [NodeView.Flag.update],
        ports: [NodeView.Flag.ports],
        size: [NodeView.Flag.resize, NodeView.Flag.ports, NodeView.Flag.tools],
        rotation: [NodeView.Flag.rotate, NodeView.Flag.tools],
        position: [NodeView.Flag.translate, NodeView.Flag.tools],
      },
    }
  }

  confirmUpdate(flag: number, options: any = {}) {
    let sub = flag
    if (this.hasFlag(sub, NodeView.Flag.ports)) {
      this.removePorts()
      this.cleanPortsCache()
    }

    if (this.hasFlag(sub, NodeView.Flag.render)) {
      this.render()
      // this.updateTools(opt)
      sub = this.removeFlag(sub, [
        NodeView.Flag.render,
        NodeView.Flag.update,
        NodeView.Flag.resize,
        NodeView.Flag.translate,
        NodeView.Flag.rotate,
        NodeView.Flag.ports,
      ])
    } else {
      // Skip this branch if render is required
      if (this.hasFlag(sub, NodeView.Flag.resize)) {
        this.resize(options)
        // Resize method is calling `update()` internally
        sub = this.removeFlag(sub, [NodeView.Flag.resize, NodeView.Flag.update])
      }

      if (this.hasFlag(sub, NodeView.Flag.update)) {
        this.update()
        sub = this.removeFlag(sub, NodeView.Flag.update)
        if (config.useCSSSelector) {
          // `update()` will render ports when useCSSSelectors are enabled
          sub = this.removeFlag(sub, NodeView.Flag.ports)
        }
      }

      if (this.hasFlag(sub, NodeView.Flag.translate)) {
        this.translate()
        sub = this.removeFlag(sub, NodeView.Flag.translate)
      }

      if (this.hasFlag(sub, NodeView.Flag.rotate)) {
        this.rotate()
        sub = this.removeFlag(sub, NodeView.Flag.rotate)
      }

      if (this.hasFlag(sub, NodeView.Flag.ports)) {
        this.renderPorts()
        sub = this.removeFlag(sub, NodeView.Flag.ports)
      }
    }

    if (this.hasFlag(sub, NodeView.Flag.tools)) {
      // this.updateTools(options)
      sub = this.removeFlag(sub, NodeView.Flag.tools)
    }

    return sub
  }

  update(partialAttrs?: Attribute.CellAttributes) {
    this.cleanCache()

    // When CSS selector strings are used, make sure no rule matches port nodes.
    const { useCSSSelector: useCSSSelectors } = config
    if (useCSSSelectors) {
      this.removePorts()
    }

    const node = this.cell
    const size = node.size
    const attrs = node.attrs
    this.updateDOMSubtreeAttributes(this.container, attrs, {
      attrs: partialAttrs === attrs ? null : partialAttrs,
      rootBBox: new Rectangle(0, 0, size.width, size.height),
      selectors: this.selectors,
      scalableNode: this.scalableNode,
      rotatableNode: this.rotatableNode,
    })

    if (useCSSSelectors) {
      this.renderPorts()
    }
  }

  protected renderMarkup() {
    const cell = this.cell
    const markup = cell.markup
    if (markup) {
      // if (Array.isArray(markup)) return this.renderJSONMarkup(markup)
      if (typeof markup === 'string') {
        return this.renderStringMarkup(markup)
      }
    }

    throw new TypeError('invalid markup')
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
    this.selectors[this.rootSelector] = this.container
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

    if (!config.useCSSSelector) {
      // this._renderPorts()
    }

    return this
  }

  resize(opt: any = {}) {
    if (this.scalableNode) {
      return this.resizeScalableNode(opt)
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

    this.updateTransform()
  }

  rotate() {
    if (this.rotatableNode) {
      this.rotateRotatableNode()
      // It's necessary to call the update for the nodes outside
      // the rotatable group referencing nodes inside the group
      this.update()
      return
    }

    this.updateTransform()
  }

  updateTransform() {
    let transform = this.getTranslateString()
    const rot = this.getRotateString()
    if (rot) {
      transform += ` ${rot}`
    }
    this.container.setAttribute('transform', transform)
  }

  getTranslateString() {
    const position = this.cell.position
    return `translate(${position.x},${position.y})`
  }

  getRotateString() {
    const rotation = this.cell.rotation
    if (rotation) {
      const size = this.cell.size
      return `rotate(${rotation},${size.width / 2},${size.height / 2})`
    }
  }

  rotateRotatableNode() {
    if (this.rotatableNode != null) {
      const transform = this.getRotateString()
      if (transform != null) {
        this.rotatableNode.setAttribute('transform', transform)
      } else {
        this.rotatableNode.removeAttribute('transform')
      }
    }
  }

  rgTranslate() {
    this.container.setAttribute('transform', this.getTranslateString())
  }

  resizeScalableNode(opt: any = {}) {
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

  findPortNode(portId: string, selector: string) {
    const cache = this.portsCache[portId]
    if (!cache) {
      return null
    }
    const portRoot = cache.portContentElement.node
    const portSelectors = cache.portContentSelectors
    return this.find(selector, portRoot, portSelectors)[0]
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

  protected renderPorts() {
    // references to rendered elements without z-index
    const elementReferences: Element[] = []
    const container = this.getPortsContainer()

    container.childNodes.forEach(child => {
      elementReferences.push(child as Element)
    })

    const portsGropsByZ = ArrayExt.groupBy(
      this.cell.portData.getPorts(),
      'zIndex',
    )

    const autoZIndexKey = 'auto'
    // render non-z first
    portsGropsByZ[autoZIndexKey].forEach(port => {
      const portElement = this.getPortElement(port)
      container.append(portElement)
      elementReferences.push(portElement)
    })

    Object.keys(portsGropsByZ).forEach(key => {
      if (key !== autoZIndexKey) {
        const z = parseInt(key, 10)
        this.appendPorts(portsGropsByZ[key], z, elementReferences)
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
    const container = this.getPortsContainer()
    const portElements = ports.map(p => this.getPortElement(p))
    if (refs[zIndex] || zIndex < 0) {
      v(refs[Math.max(zIndex, 0)] as SVGElement).before(portElements)
    } else {
      portElements.forEach(elem => container.appendChild(elem))
    }
  }

  protected getPortElement(port: PortData.Port) {
    const cache = this.portsCache[port.id]
    if (cache) {
      return cache.portElement
    }
    return this.createPortElement(port)
  }

  protected createPortElement(port: PortData.Port) {
    const portElement = v(this.portContainerMarkup).addClass('x6-port').node
    const portMarkup = this.getPortMarkup(port)
    let rendered = this.renderPortMarkup(portMarkup)
    const portContentElement = rendered.elem
    const portContentSelectors = rendered.selectors

    if (portContentElement == null) {
      throw new Error('Invalid port markup.')
    }

    this.setAttributes(
      {
        port: port.id,
        'port-group': port.group,
      },
      portContentElement,
    )

    const labelMarkup = this.getPortLabelMarkup(port.label)
    rendered = this.renderPortMarkup(labelMarkup)
    const portLabelElement = rendered.elem
    const portLabelSelectors = rendered.selectors

    if (portLabelElement == null) {
      throw new Error('Invalid port label markup.')
    }

    let portSelectors: CellView.Selectors | null
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

    portElement.append([
      portContentElement.addClass('joint-port-body'),
      portLabelElement.addClass('joint-port-label'),
    ])

    this.portsCache[port.id] = {
      portElement,
      portLabelElement,
      portSelectors,
      portLabelSelectors,
      portContentElement,
      portContentSelectors,
    }

    return portElement
  }

  protected renderPortMarkup(markup: BaseView.Markup) {
    let elem: Element | null = null
    let selectors: CellView.Selectors | null = null

    const createContainer = (child: Element) =>
      child instanceof SVGElement
        ? v.createSvgElement('g')
        : v.createElement('div')

    if (typeof markup === 'string') {
      const nodes = v.batch(markup)
      const count = nodes.length
      if (count === 1) {
        elem = nodes[0].node as Element
      } else if (count > 1) {
        elem = createContainer(nodes[0].node)
        nodes.forEach(node => {
          elem!.appendChild(node.node)
        })
      }

      elem = null
    } else {
      const ret = this.parseDOMJSON(markup)
      const fragment = ret.fragment
      if (fragment.childNodes.length > 1) {
        elem = createContainer(fragment.firstChild as Element)
        elem.appendChild(fragment)
      } else {
        elem = fragment.firstChild as Element
      }
      selectors = ret.selectors
    }

    return { elem, selectors }
  }

  protected updatePorts() {
    // layout ports without group
    this.updatePortGroup(undefined)
    // layout ports with explicit group
    Object.keys(this.cell.portData.groups).forEach(groupName =>
      this.updatePortGroup(groupName),
    )
  }

  protected removePorts() {
    Object.keys(this.portsCache).forEach(id => {
      const item = this.portsCache[id]
      v.remove(item.portElement)
    })
  }

  protected updatePortGroup(groupName?: string) {
    const size = this.cell.size
    const elementBBox = new Rectangle(0, 0, size.width, size.height)
    const portsMetrics = this.cell.portData.getPortsLayoutByGroup(
      groupName,
      elementBBox,
    )

    for (let i = 0, n = portsMetrics.length; i < n; i += 1) {
      const metrics = portsMetrics[i]
      const portId = metrics.portId
      const cached = this.portsCache[portId] || {}
      const portLayout = metrics.portLayout
      this.applyPortTransform(cached.portElement, portLayout)
      if (metrics.portAttrs != null) {
        const options: CellView.UpdateDOMSubtreeAttributesOptions = {
          selectors: cached.portSelectors || {},
        }

        if (metrics.portSize) {
          options.rootBBox = new Rectangle(
            0,
            0,
            metrics.portSize.width,
            metrics.portSize.height,
          )
        }

        this.updateDOMSubtreeAttributes(
          cached.portElement,
          metrics.portAttrs,
          options,
        )
      }

      const portLabelLayout = metrics.portLabelLayout
      if (portLabelLayout) {
        this.applyPortTransform(
          cached.portLabelElement,
          portLabelLayout,
          -portLayout.angle || 0,
        )

        if (portLabelLayout.attrs) {
          const options: CellView.UpdateDOMSubtreeAttributesOptions = {
            selectors: cached.portLabelSelectors || {},
          }

          if (metrics.labelSize) {
            options.rootBBox = new Rectangle(
              0,
              0,
              metrics.labelSize.width,
              metrics.labelSize.height,
            )
          }

          this.updateDOMSubtreeAttributes(
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
    transformData,
    initialAngle: number = 0,
  ) {
    const matrix = v
      .createSVGMatrix()
      .rotate(initialAngle)
      .translate(transformData.x || 0, transformData.y || 0)
      .rotate(transformData.angle || 0)

    v.transform(element as SVGElement, matrix, { absolute: true })
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
  export interface PortCache {
    portElement: Element
    portSelectors: CellView.Selectors | null
    portLabelElement: Element
    portLabelSelectors: CellView.Selectors | null
    portContentElement: Element
    portContentSelectors: CellView.Selectors | null
  }
}
