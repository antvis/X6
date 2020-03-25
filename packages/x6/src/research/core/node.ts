import { StringExt, ObjectExt } from '../../util'
import { Point, Rectangle, Angle } from '../../geometry'
import { Size, KeyValue } from '../../types'
import { Cell } from './cell'
import { PortData } from './port-data'
import { Markup } from './markup'
import { Edge } from './edge'
import { Store } from './store'

export class Node extends Cell {
  protected static defaults: Node.Defaults = {
    rotation: 0,
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
  }
  // Define the store type
  public readonly store: Store<Node.Properties>
  protected readonly defaultPortMarkup = Markup.portMarkup
  protected readonly defaultPortLabelMarkup = Markup.portLabelMarkup
  protected readonly defaultPortContainerMarkup = Markup.portContainerMarkup

  public portData: PortData

  constructor(options: Node.Options = {}) {
    super(options)
    this.initPorts()
  }

  protected setup() {
    super.setup()
    this.store.on('mutated', metadata => {
      const key = metadata.key
      if (key === 'size') {
        this.trigger('change:size', this.getChangeEventArgs<Size>(metadata))
      } else if (key === 'position') {
        this.trigger(
          'change:position',
          this.getChangeEventArgs<Point.PointLike>(metadata),
        )
      } else if (key === 'rotation') {
        this.trigger(
          'change:rotation',
          this.getChangeEventArgs<number>(metadata),
        )
      } else if (key === 'ports') {
        this.trigger(
          'change:ports',
          this.getChangeEventArgs<PortData.Port[]>(metadata),
        )
      } else if (key === 'portMarkup') {
        this.trigger(
          'change:portMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'portLabelMarkup') {
        this.trigger(
          'change:portLabelMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'portContainerMarkup') {
        this.trigger(
          'change:portContainerMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      }
    })
  }

  isNode(): this is Node {
    return true
  }

  // #region size

  get size() {
    return this.getSize()
  }

  set size(size: Size) {
    this.setSize(size)
  }

  getSize() {
    const size = this.store.get('size')
    return size ? { ...size } : { width: 1, height: 1 }
  }

  setSize(size: Size, options?: Node.ResizeOptions): this
  setSize(width: number, height: number, options?: Node.ResizeOptions): this
  setSize(
    width: number | Size,
    height?: number | Node.ResizeOptions,
    options?: Node.ResizeOptions,
  ) {
    if (typeof width === 'object') {
      this.resize(width.width, width.height, height as Node.ResizeOptions)
    } else {
      this.resize(width, height as number, options)
    }

    return this
  }

  resize(width: number, height: number, options: Node.ResizeOptions = {}) {
    this.startBatch('resize', options)

    if (options.direction) {
      const currentSize = this.size

      switch (options.direction) {
        case 'left':
        case 'right':
          // Don't change height when resizing horizontally.
          height = currentSize.height // tslint:disable-line
          break
        case 'top':
        case 'bottom':
          // Don't change width when resizing vertically.
          width = currentSize.width // tslint:disable-line
          break
      }

      let quadrant = {
        topRight: 0,
        right: 0,
        topLeft: 1,
        top: 1,
        bottomLeft: 2,
        left: 2,
        bottomRight: 3,
        bottom: 3,
      }[options.direction]

      const angle = Angle.normalize(this.rotation || 0)

      if (options.absolute) {
        // We are taking the node's rotation into account
        quadrant += Math.floor((angle + 45) / 90)
        quadrant %= 4
      }

      // This is a rectangle in size of the un-rotated node.
      const bbox = this.getBBox()

      // Pick the corner point on the node, which meant to stay on its
      // place before and after the rotation.
      let fixedPoint: Point
      if (quadrant === 0) {
        fixedPoint = bbox.getBottomLeft()
      } else if (quadrant === 1) {
        fixedPoint = bbox.getCorner()
      } else if (quadrant === 2) {
        fixedPoint = bbox.getTopRight()
      } else {
        fixedPoint = bbox.getOrigin()
      }

      // Find an image of the previous indent point. This is the position,
      // where is the point actually located on the screen.
      const imageFixedPoint = fixedPoint
        .clone()
        .rotate(-angle, bbox.getCenter())

      // Every point on the element rotates around a circle with the centre of
      // rotation in the middle of the element while the whole element is being
      // rotated. That means that the distance from a point in the corner of
      // the element (supposed its always rect) to the center of the element
      // doesn't change during the rotation and therefore it equals to a
      // distance on un-rotated element.
      // We can find the distance as DISTANCE = (ELEMENTWIDTH/2)^2 + (ELEMENTHEIGHT/2)^2)^0.5.
      const radius = Math.sqrt(width * width + height * height) / 2

      // Now we are looking for an angle between x-axis and the line starting
      // at image of fixed point and ending at the center of the element.
      // We call this angle `alpha`.

      // The image of a fixed point is located in n-th quadrant. For each
      // quadrant passed going anti-clockwise we have to add 90 degrees.
      // Note that the first quadrant has index 0.
      //
      // 3 | 2
      // --c-- Quadrant positions around the element's center `c`
      // 0 | 1
      //
      let alpha = (quadrant * Math.PI) / 2

      // Add an angle between the beginning of the current quadrant (line
      // parallel with x-axis or y-axis going through the center of the
      // element) and line crossing the indent of the fixed point and the
      // center of the element. This is the angle we need but on the
      // un-rotated element.
      alpha += Math.atan(quadrant % 2 === 0 ? height / width : width / height)

      // Lastly we have to deduct the original angle the element was rotated
      // by and that's it.
      alpha -= Angle.toRad(angle)

      // With this angle and distance we can easily calculate the centre of
      // the un-rotated element.
      // Note that fromPolar constructor accepts an angle in radians.
      const center = Point.fromPolar(radius, alpha, imageFixedPoint)

      // The top left corner on the un-rotated element has to be half a width
      // on the left and half a height to the top from the center. This will
      // be the origin of rectangle we were looking for.
      const origin = center.clone().translate(width / -2, height / -2)

      this.store.set('size', { width, height }, options)
      this.setPosition(origin.x, origin.y, options)
    } else {
      this.store.set('size', { width, height }, options)
    }

    this.stopBatch('resize', options)

    return this
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike,
    options: Node.SetOptions = {},
  ) {
    const scaledBBox = this.getBBox().scale(sx, sy, origin)
    this.startBatch('scale', options)
    this.setPosition(scaledBBox.x, scaledBBox.y, options)
    this.resize(scaledBBox.width, scaledBBox.height, options)
    this.stopBatch('scale')
    return this
  }

  // #endregion

  // #region position

  get position() {
    return this.getPosition()
  }

  set position(pos: Point | Point.PointLike) {
    this.setPosition(pos.x, pos.y)
  }

  getPosition(options: { relative?: boolean } = {}): Point.PointLike {
    if (options.relative) {
      const parent = this.getParent()
      if (parent != null && parent.isNode()) {
        const currentPosition = this.position
        const parentPosition = parent.position

        return {
          x: currentPosition.x - parentPosition.x,
          y: currentPosition.y - parentPosition.y,
        }
      }
    }

    const pos = this.store.get('position')
    return pos ? { ...pos } : { x: 0, y: 0 }
  }

  setPosition(
    p: Point | Point.PointLike,
    options?: Node.SetPositionOptions,
  ): this
  setPosition(x: number, y: number, options?: Node.SetPositionOptions): this
  setPosition(
    x: number | Point | Point.PointLike,
    y?: number | Node.SetPositionOptions,
    options: Node.SetPositionOptions = {},
  ) {
    let xx: number
    let yy: number
    let opts: Node.SetPositionOptions

    if (typeof x === 'object') {
      xx = x.x
      yy = x.y
      opts = (y as Node.SetPositionOptions) || {}
    } else {
      xx = x
      yy = y as number
      opts = options || {}
    }

    if (opts.relative) {
      const parent = this.getParent() as Node
      if (parent != null && parent.isNode()) {
        const parentPosition = parent.position
        xx += parentPosition.x
        yy += parentPosition.y
      }
    }

    if (opts.deep) {
      const currentPosition = this.position
      this.translate(xx - currentPosition.x, yy - currentPosition.y, opts)
    } else {
      this.store.set('position', { x: xx, y: yy }, opts)
    }

    return this
  }

  translate(
    tx: number = 0,
    ty: number = 0,
    options: Node.TranslateOptions = {},
  ) {
    if (tx === 0 && ty === 0) {
      return this
    }

    // Pass the initiator of the translation.
    options.translateBy = options.translateBy || this.id

    const position = this.position

    if (options.restrictedArea != null && options.translateBy === this.id) {
      // We are restricting the translation for the element itself only. We get
      // the bounding box of the element including all its embeds.
      // All embeds have to be translated the exact same way as the element.
      const bbox = this.getBBox({ deep: true })
      const ra = options.restrictedArea
      // - - - - - - - - - - - - -> ra.x + ra.width
      // - - - -> position.x      |
      // -> bbox.x
      //                ▓▓▓▓▓▓▓   |
      //         ░░░░░░░▓▓▓▓▓▓▓
      //         ░░░░░░░░░        |
      //   ▓▓▓▓▓▓▓▓░░░░░░░
      //   ▓▓▓▓▓▓▓▓               |
      //   <-dx->                     | restricted area right border
      //         <-width->        |   ░ translated element
      //   <- - bbox.width - ->       ▓ embedded element
      const dx = position.x - bbox.x
      const dy = position.y - bbox.y
      // Find the maximal/minimal coordinates that the element can be translated
      // while complies the restrictions.
      const x = Math.max(
        ra.x + dx,
        Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx),
      )
      const y = Math.max(
        ra.y + dy,
        Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty),
      )

      // recalculate the translation taking the restrictions into account.
      tx = x - position.x // tslint:disable-line
      ty = y - position.y // tslint:disable-line
    }

    const translatedPosition = {
      x: position.x + tx,
      y: position.y + ty,
    }

    // To find out by how much an element was translated in event
    // 'change:position' handlers.
    options.tx = tx
    options.ty = ty

    // if (options.transition) {
    //   if (!isObject(options.transition)) options.transition = {}

    //   this.transition(
    //     'position',
    //     translatedPosition,
    //     assign({}, options.transition, {
    //       valueFunction: interpolate.object,
    //     }),
    //   )

    //   // Recursively call `translate()` on all the embeds cells.
    //   this.eachChild(child => child.translate(tx, ty, options))
    // } else {
    this.startBatch('translate', options)
    this.store.set('position', translatedPosition, options)
    this.eachChild(child => (child as Node).translate(tx, ty, options))
    this.stopBatch('translate', options)
    // }

    return this
  }

  // #endregion

  // #region rotation

  get rotation() {
    return this.getRotation()
  }

  set rotation(angle: number) {
    this.rotate(angle, true)
  }

  getRotation() {
    return this.store.get('rotation', 0)
  }

  rotate(
    angle: number,
    absolute: boolean,
    origin?: Point | Point.PointLike,
    options: Node.RotateOptions = {},
  ) {
    const currentAngle = this.getRotation()
    if (origin) {
      const size = this.getSize()
      const position = this.getPosition()
      const center = this.getBBox().getCenter()
      center.rotate(currentAngle - angle, origin)
      const dx = center.x - size.width / 2 - position.x
      const dy = center.y - size.height / 2 - position.y
      this.startBatch('rotate', { angle, absolute, origin })
      this.setPosition(position.x + dx, position.y + dy, options)
      this.rotate(angle, absolute, undefined, options)
      this.stopBatch('rotate')
    } else {
      this.store.set(
        'rotation',
        absolute ? angle : (currentAngle + angle) % 360,
        options,
      )
    }

    return this
  }

  // #endregion

  getBBox(options: { deep?: boolean } = {}) {
    if (options.deep) {
      const cells = this.getDescendants({ deep: true, breadthFirst: true })
      cells.push(this)
      return Cell.getCellsBBox(cells)!
    }

    return Rectangle.fromPositionAndSize(this.getPosition(), this.getSize())
  }

  getConnectionPoint(edge: Edge, type: Edge.TerminalType) {
    const bbox = this.getBBox()
    const center = bbox.getCenter()
    const terminal = edge.getTerminal(type) as Edge.TerminalCellData
    if (terminal == null) {
      return center
    }

    const portId = terminal.portId
    if (!portId || !this.hasPort(portId)) {
      return center
    }

    const port = this.getPort(portId)
    if (!port || !port.group) {
      return center
    }

    const portsPositions = this.getPortsPosition(port.group)
    const portCenter = Point.create(portsPositions[portId]).translate(
      bbox.getOrigin(),
    )

    const angle = this.getRotation()
    if (angle) {
      portCenter.rotate(-angle, center)
    }

    return portCenter
  }

  // fitEmbeds(options = {}) {
  //   // Getting the children's size and position requires the collection.
  //   // Cell.get('embeds') helds an array of cell ids only.
  //   const { graph } = this
  //   if (!graph) throw new Error('Element must be part of a graph.')

  //   const embeddedCells = this.getChildren().filter(cell => cell.isNode())
  //   if (embeddedCells.length === 0) {
  //     return this
  //   }

  //   this.startBatch('fit-embeds', options)

  //   if (options.deep) {
  //     // Recursively apply fitEmbeds on all embeds first.
  //     invoke(embeddedCells, 'fitEmbeds', options)
  //   }

  //   // Compute cell's size and position based on the children bbox
  //   // and given padding.
  //   const { left, right, top, bottom } = normalizeSides(options.padding)
  //   let { x, y, width, height } = graph.getCellsBBox(embeddedCells)
  //   // Apply padding computed above to the bbox.
  //   x -= left
  //   y -= top
  //   width += left + right
  //   height += bottom + top

  //   // Set new element dimensions finally.
  //   this.store.set(
  //     {
  //       position: { x, y },
  //       size: { width, height },
  //     },
  //     options,
  //   )

  //   this.stopBatch('fit-embeds')

  //   return this
  // }

  // #region ports

  get portContainerMarkup() {
    return this.getPortContainerMarkup()
  }

  set portContainerMarkup(markup: Markup) {
    this.setPortContainerMarkup(markup)
  }

  getPortContainerMarkup() {
    return (
      this.store.get('portContainerMarkup') || this.defaultPortContainerMarkup
    )
  }

  setPortContainerMarkup(markup?: Markup, options: Node.SetOptions = {}) {
    this.store.set('portContainerMarkup', Markup.clone(markup), options)
    return this
  }

  get portMarkup() {
    return this.getPortMarkup()
  }

  set portMarkup(markup: Markup) {
    this.setPortMarkup(markup)
  }

  getPortMarkup() {
    return this.store.get('portMarkup') || this.defaultPortMarkup
  }

  setPortMarkup(markup?: Markup, options: Node.SetOptions = {}) {
    this.store.set('portMarkup', Markup.clone(markup), options)
    return this
  }

  get portLabelMarkup() {
    return this.getPortLabelMarkup()
  }

  set portLabelMarkup(markup: Markup) {
    this.setPortLabelMarkup(markup)
  }

  getPortLabelMarkup() {
    return this.store.get('portLabelMarkup') || this.defaultPortLabelMarkup
  }

  setPortLabelMarkup(markup?: Markup, options: Node.SetOptions = {}) {
    this.store.set('portLabelMarkup', Markup.clone(markup), options)
    return this
  }

  get ports() {
    return this.store.get('ports', { items: [] })
  }

  getPorts() {
    return ObjectExt.cloneDeep(this.ports.items)
  }

  getPort(portId: string) {
    return ObjectExt.cloneDeep(
      this.ports.items.find(port => port.id && port.id === portId),
    )
  }

  hasPorts() {
    return this.ports.items.length > 0
  }

  hasPort(portId: string) {
    return this.getPortIndex(portId) !== -1
  }

  getPortIndex(port: PortData.PortMetadata | string) {
    const portId = typeof port === 'string' ? port : port.id
    return portId != null
      ? this.ports.items.findIndex(item => item.id === portId)
      : -1
  }

  getPortsPosition(groupName: string) {
    const size = this.size
    const layouts = this.portData.getPortsLayoutByGroup(
      groupName,
      new Rectangle(0, 0, size.width, size.height),
    )

    const positions: {
      [id: string]: {
        x: number
        y: number
        angle: number
      }
    } = {}

    return layouts.reduce((memo, item) => {
      const transformation = item.portLayout
      memo[item.portId] = {
        x: transformation.x,
        y: transformation.y,
        angle: transformation.angle,
      }
      return memo
    }, positions)
  }

  addPort(port: PortData.PortMetadata, options?: Cell.SetByPathOptions) {
    const ports = [...this.ports.items]
    ports.push(port)
    this.setByPath('ports/items', ports, options)
    return this
  }

  addPorts(ports: PortData.PortMetadata[], options?: Cell.SetByPathOptions) {
    this.setByPath('ports/items', [...this.ports.items, ...ports], options)
    return this
  }

  removePort(
    port: PortData.PortMetadata | string,
    options: Cell.SetByPathOptions = {},
  ) {
    const ports = [...this.ports.items]
    const index = this.getPortIndex(port)

    if (index !== -1) {
      ports.splice(index, 1)
      options.rewrite = true
      this.setByPath('ports/items', ports, options)
    }

    return this
  }

  removePorts(options?: Cell.SetByPathOptions): this
  removePorts(
    portsForRemoval: (PortData.PortMetadata | string)[],
    options?: Cell.SetByPathOptions,
  ): this
  removePorts(
    portsForRemoval?:
      | (PortData.PortMetadata | string)[]
      | Cell.SetByPathOptions,
    opt?: Cell.SetByPathOptions,
  ) {
    let options

    if (Array.isArray(portsForRemoval)) {
      options = opt || {}
      if (portsForRemoval.length) {
        options.rewrite = true
        const currentPorts = [...this.ports.items]
        const remainingPorts = currentPorts.filter(
          cp =>
            !portsForRemoval.some(p => {
              const id = typeof p === 'string' ? p : p.id
              return cp.id === id
            }),
        )
        this.setByPath('ports/items', remainingPorts, options)
      }
    } else {
      options = portsForRemoval || {}
      options.rewrite = true
      this.setByPath('ports/items', [], options)
    }

    return this
  }

  protected initPorts() {
    this.createPortData()
    this.on('change:ports', () => {
      this.processRemovedPort()
      this.createPortData()
    })
  }

  protected processRemovedPort() {
    const current = this.ports
    const currentItemsMap: { [id: string]: boolean } = {}

    current.items.forEach(item => {
      if (item.id) {
        currentItemsMap[item.id] = true
      }
    })

    const removed: { [id: string]: boolean } = {}
    const previous = this.store.getPrevious<PortData.Metadata>('ports') || {
      items: [],
    }

    previous.items.forEach(item => {
      if (item.id && !currentItemsMap[item.id]) {
        removed[item.id] = true
      }
    })

    const model = this.model
    if (model && !ObjectExt.isEmpty(removed)) {
      // const inboundLinks = model.getConnectedLinks(this, { inbound: true })
      // inboundLinks.forEach(link => {
      //   if (removed[link.get('target').port]) {
      //     link.remove()
      //   }
      // })
      // const outboundLinks = model.getConnectedLinks(this, { outbound: true })
      // outboundLinks.forEach(link => {
      //   if (removed[link.get('source').port]) {
      //     link.remove()
      //   }
      // })
    }
  }

  protected validatePorts() {
    const ids: { [id: string]: boolean } = {}
    const errors: string[] = []
    this.ports.items.forEach(p => {
      if (typeof p !== 'object') {
        errors.push(`Invalid port ${p}.`)
      }

      if (p.id == null) {
        p.id = this.generatePortId()
      }

      if (ids[p.id]) {
        errors.push('Duplicitied port id.')
      }

      ids[p.id] = true
    })

    return errors
  }

  protected generatePortId() {
    return StringExt.uuid()
  }

  protected createPortData() {
    const err = this.validatePorts()

    if (err.length > 0) {
      this.store.set(
        'ports',
        this.store.getPrevious<PortData.Metadata>('ports'),
      )
      throw new Error(err.join(' '))
    }

    const prevPorts = this.portData ? this.portData.getPorts() : null
    this.portData = new PortData(this.ports)
    const curPorts = this.portData.getPorts()

    const added = prevPorts
      ? curPorts.filter(item => {
          if (!prevPorts.find(prevPort => prevPort.id === item.id)) {
            return item
          }
        })
      : [...curPorts]

    const removed = prevPorts
      ? prevPorts.filter(item => {
          if (!curPorts.find(curPort => curPort.id === item.id)) {
            return item
          }
        })
      : []

    if (added.length > 0) {
      this.trigger('ports:added', { added, node: this })
    }

    if (removed.length > 0) {
      this.trigger('ports:removed', { removed, node: this })
    }
  }

  // #endregion
}

export namespace Node {
  interface Common extends Cell.Common {
    size?: { width: number; height: number }
    position?: { x: number; y: number }
    rotation?: number
    ports?: PortData.Metadata
    portContainerMarkup?: Markup
    portMarkup?: Markup
    portLabelMarkup?: Markup
  }

  export interface Options extends Common, Cell.Options {}
  export interface Defaults extends Common, Cell.Defaults {}
  export interface Properties extends Cell.Properties, Options {}

  /**
   * The metadata used creating a node instance.
   */
  export interface Metadata extends Options, KeyValue {
    type?: string
  }
}

export namespace Node {
  export interface SetOptions extends Cell.SetOptions {}

  export interface SetPositionOptions extends SetOptions {
    deep?: boolean
    relative?: boolean
  }

  export interface TranslateOptions extends Cell.TranslateOptions {
    transition?: boolean
    restrictedArea?: Rectangle.RectangleLike
  }

  export interface RotateOptions extends SetOptions {}

  export interface ResizeOptions extends SetOptions {
    absolute?: boolean
    direction?:
      | 'left'
      | 'top'
      | 'right'
      | 'bottom'
      | 'topLeft'
      | 'topRight'
      | 'bottomLeft'
      | 'bottomRight'
  }
}

export namespace Node {
  export type Defintion = typeof Node

  export interface DefintionOptions extends Defaults, Cell.DefintionOptions {}

  let counter = 0
  function getClassName(name?: string) {
    if (name) {
      return StringExt.pascalCase(name)
    }
    counter += 1
    return `CustomNode${counter}`
  }

  export function define(options: DefintionOptions) {
    const { name, attrDefinitions, ...defaults } = options
    const className = getClassName(name)
    const base = this as Defintion
    const shape = ObjectExt.createClass<Defintion>(className, base)

    shape.config(defaults, attrDefinitions)

    return shape
  }
}
