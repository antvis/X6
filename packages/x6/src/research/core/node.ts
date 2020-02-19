import cloneDeep from 'lodash/cloneDeep'
import { Cell } from './cell'
import { View } from './view'
import { Size } from '../../types'
import { Point, Rectangle, Angle } from '../../geometry'
import { PortData } from './port-data'
import { StringExt, ObjectExt } from '../../util'

export class Node extends Cell {
  protected collapsed: boolean
  protected collapsedSize: Size | null
  protected edges: Cell[] | null
  public portData: PortData

  constructor(options: Node.CreateNodeOptions = {}) {
    super(options)
  }

  isNode() {
    return true
  }

  get size() {
    return { ...this.store.get<Size>('size')! }
  }

  set size(size: Size) {
    this.setSize(size)
  }

  getSize() {
    return this.size
  }

  setSize(size: Size, options?: Node.ResizeOptions): this
  setSize(width: number, height: number, options?: Node.ResizeOptions): this
  setSize(
    width: number | Size,
    height?: number | Node.ResizeOptions,
    options?: Node.ResizeOptions,
  ) {
    let w: number
    let h: number
    let opts: Node.ResizeOptions

    if (typeof width === 'object') {
      w = width.width
      h = width.height
      opts = height as Node.ResizeOptions
    } else {
      w = width
      h = height as number
      opts = options as Node.ResizeOptions
    }

    this.resize(w, h, opts)
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

      const angle = Angle.normalize(this.rotation || 0)

      let quadrant = {
        'top-right': 0,
        right: 0,
        'top-left': 1,
        top: 1,
        'bottom-left': 2,
        left: 2,
        'bottom-right': 3,
        bottom: 3,
      }[options.direction]

      if (options.absolute) {
        // We are taking the element's rotation into account
        quadrant += Math.floor((angle + 45) / 90)
        quadrant %= 4
      }

      // This is a rectangle in size of the un-rotated element.
      const bbox = this.getBBox()

      // Pick the corner point on the element, which meant to stay on its
      // place before and after the rotation.
      let fixedPoint: Point
      if (quadrant === 0) {
        fixedPoint = bbox.bottomLeft
      } else if (quadrant === 1) {
        fixedPoint = bbox.corner
      } else if (quadrant === 2) {
        fixedPoint = bbox.topRight
      } else {
        fixedPoint = bbox.origin
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

  get position() {
    return { ...this.store.get<Point.PointLike>('position')! }
  }

  set position(pos: Point | Point.PointLike) {
    this.setPosition(pos.x, pos.y)
  }

  getPosition(options: { relative?: boolean } = {}) {
    if (options.relative) {
      const parent = this.getParent() as Node
      if (parent != null && parent.isNode()) {
        const currentPosition = this.position
        const parentPosition = parent.position

        return {
          x: currentPosition.x - parentPosition.x,
          y: currentPosition.y - parentPosition.y,
        }
      }
    }

    return this.position
  }

  setPosition(x: number, y: number, options: Node.PositionOptions = {}) {
    if (options.relative) {
      const parent = this.getParent() as Node
      if (parent != null && parent.isNode()) {
        const parentPosition = parent.position
        x += parentPosition.x // tslint:disable-line
        y += parentPosition.y // tslint:disable-line
      }
    }

    if (options.deep) {
      const currentPosition = this.position
      this.translate(x - currentPosition.x, y - currentPosition.y, options)
    } else {
      this.store.set('position', { x, y }, options)
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

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike,
    options: any = {},
  ) {
    const scaledBBox = this.getBBox().scale(sx, sy, origin)
    this.startBatch('scale', options)
    this.setPosition(scaledBBox.x, scaledBBox.y, options)
    this.resize(scaledBBox.width, scaledBBox.height, options)
    this.stopBatch('scale')
    return this
  }

  get rotation() {
    return this.store.get<number>('rotation') || 0
  }

  rotate(
    angle: number,
    absolute: boolean,
    origin?: Point | Point.PointLike,
    options: any = {},
  ) {
    if (origin) {
      const center = this.getBBox().getCenter()
      const size = this.size
      const position = this.position
      center.rotate(this.rotation - angle, origin)
      const dx = center.x - size.width / 2 - position.x
      const dy = center.y - size.height / 2 - position.y
      this.startBatch('rotate', {
        angle,
        absolute,
        origin,
      })
      this.setPosition(position.x + dx, position.y + dy, options)
      this.rotate(angle, absolute, undefined, options)
      this.stopBatch('rotate')
    } else {
      this.store.set(
        'rotation',
        absolute ? angle : (this.rotation + angle) % 360,
        options,
      )
    }

    return this
  }

  getBBox(options: { deep?: boolean } = {}) {
    if (options.deep) {
      const cells = this.getDescendants({ deep: true, breadthFirst: true })
      cells.push(this)
      return Cell.getCellsBBox(cells)
    }

    const size = this.size
    const position = this.position
    return new Rectangle(position.x, position.y, size.width, size.height)
  }

  // getPointFromConnectedLink(link, endType) {
  //   // Center of the model
  //   const bbox = this.getBBox()
  //   const center = bbox.center()
  //   // Center of a port
  //   const endDef = link.get(endType)
  //   if (!endDef) return center
  //   const portId = endDef.port
  //   if (!portId || !this.hasPort(portId)) return center
  //   const portGroup = this.portProp(portId, ['group'])
  //   const portsPositions = this.getPortsPositions(portGroup)
  //   const portCenter = new Point(portsPositions[portId]).offset(bbox.origin())
  //   const angle = this.angle()
  //   if (angle) portCenter.rotate(center, -angle)
  //   return portCenter
  // }

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

  get ports() {
    return this.store.get<PortData.Metadata>('ports') || { items: [] }
  }

  get portContainerMarkup() {
    return this.store.get<View.Markup>('portContainerMarkup')
  }

  get portMarkup() {
    return this.store.get<View.Markup>('portMarkup')
  }

  get portLabelMarkup() {
    return this.store.get<View.Markup>('portLabelMarkup')
  }

  getPorts() {
    return cloneDeep(this.ports.items)
  }

  getPort(id: string) {
    return cloneDeep(this.ports.items.find(port => port.id && port.id === id))
  }

  hasPorts() {
    return this.ports.items.length > 0
  }

  hasPort(id: string) {
    return this.getPortIndex(id) !== -1
  }

  getPortIndex(port: PortData.PortMetadata | string) {
    const id = typeof port === 'string' ? port : port.id
    return id != null ? this.ports.items.findIndex(item => item.id === id) : -1
  }

  getPortsPositions(groupName: string) {
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

  addPort(port: PortData.PortMetadata, options?: Cell.SetPropByPathOptions) {
    const ports = [...this.ports.items]
    ports.push(port)
    this.setPropByPath('ports/items', ports, options)
    return this
  }

  addPorts(
    ports: PortData.PortMetadata[],
    options?: Cell.SetPropByPathOptions,
  ) {
    this.setPropByPath('ports/items', [...this.ports.items, ...ports], options)
    return this
  }

  removePort(
    port: PortData.PortMetadata | string,
    options: Cell.SetPropByPathOptions = {},
  ) {
    const ports = [...this.ports.items]
    const index = this.getPortIndex(port)

    if (index !== -1) {
      ports.splice(index, 1)
      options.rewrite = true
      this.setPropByPath('ports/items', ports, options)
    }

    return this
  }

  removePorts(options?: Cell.SetPropByPathOptions): this
  removePorts(
    portsForRemoval: (PortData.PortMetadata | string)[],
    options?: Cell.SetPropByPathOptions,
  ): this
  removePorts(
    portsForRemoval?:
      | (PortData.PortMetadata | string)[]
      | Cell.SetPropByPathOptions,
    opt?: Cell.SetPropByPathOptions,
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
        this.setPropByPath('ports/items', remainingPorts, options)
      }
    } else {
      options = portsForRemoval || {}
      options.rewrite = true
      this.setPropByPath('ports/items', [], options)
    }

    return this
  }

  protected initializePorts() {
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
        errors.push('Invalid port ', p)
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
      this.store.set('ports', this.store.getPrevious('ports'))
      throw new Error(err.join(' '))
    }

    const prevPorts = this.portData ? this.portData.getPorts() : null
    this.portData = new PortData(this.ports)
    const curPorts = this.portData.getPorts()

    if (prevPorts) {
      const added = curPorts.filter(item => {
        if (!prevPorts.find(prevPort => prevPort.id === item.id)) {
          return item
        }
      })

      const removed = prevPorts.filter(item => {
        if (!curPorts.find(curPort => curPort.id === item.id)) {
          return item
        }
      })

      if (removed.length > 0) {
        this.trigger('ports:remove', this, removed)
      }

      if (added.length > 0) {
        this.trigger('ports:add', this, added)
      }
    }
  }

  // #endregion
}

Node.config({
  position: { x: 0, y: 0 },
  size: { width: 1, height: 1 },
  rotation: 0,
})

export namespace Node {
  export interface CreateNodeOptions extends Cell.CreateCellOptions {
    size?: { width: number; height: number }
    position?: { x: number; y: number }
    rotation?: number
  }

  export interface Data extends Cell.StoreData, CreateNodeOptions {}

  export interface PositionOptions extends Cell.SetOptions {
    deep?: boolean
    relative?: boolean
  }

  export interface TranslateOptions extends Cell.SetOptions {
    translateBy?: string | number
    transition?: boolean
    restrictedArea?: Rectangle.RectangleLike
  }

  export interface ResizeOptions extends Cell.SetOptions {
    direction?:
      | 'left'
      | 'right'
      | 'top'
      | 'top-left'
      | 'top-right'
      | 'bottom'
      | 'bottom-left'
      | 'bottom-right'
  }
}
