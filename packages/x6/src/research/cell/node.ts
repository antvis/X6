/* tslint:disable:variable-name */

import { Size } from '../../types'
import { Cell } from './cell'
import { Point, Rectangle, Angle } from '../../geometry'
import { PositionChange, SizeChange } from '../change'
import { RotationChange } from '../change/rotation-change'

export class Node extends Cell {
  _size: Size = { width: 1, height: 1 }
  _position: Point.PointLike = { x: 0, y: 0 }
  _rotation: number = 0

  get size() {
    return { ...this._size }
  }

  get rotation() {
    return Angle.normalize(this._rotation || 0)
  }

  get position() {
    return { ...this._position }
  }

  isNode() {
    return true
  }

  getPosition(options: { relative?: boolean } = {}) {
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

    return this.position
  }

  setPosition(x: number, y: number, options: Node.PositionOptions = {}) {
    if (options.relative) {
      const parent = this.getParent()
      if (parent != null && parent.isNode()) {
        const parentPosition = parent.position
        x += parentPosition.x // tslint:disable-line
        y += parentPosition.y // tslint:disable-line
      }
    }

    if (options.deep) {
      const pos = this.position
      this.translate(x - pos.x, y - pos.y, options)
    } else {
      if (options.silent) {
        this._position = { x, y }
      } else {
        this.execute(new PositionChange(this, { x, y }), 'position', options)
      }
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

    const position = this.position

    if (options.restrictedArea != null) {
      // We are restricting the translation for the node itself only. We get
      // the bounding box of the node including all its children.
      // All children have to be translated the exact same way as the node.
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
      //         <-width->        |   ░ translated node
      //   <- - bbox.width - ->       ▓ child node
      const dx = position.x - bbox.x
      const dy = position.y - bbox.y

      // Finds the maximal/minimal coordinates that the node can be
      // translated while complies the restrictions.
      const x = Math.max(
        ra.x + dx,
        Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx),
      )
      const y = Math.max(
        ra.y + dy,
        Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty),
      )

      // Recalculates the translation taking the restrictions into account.
      tx = x - position.x // tslint:disable-line
      ty = y - position.y // tslint:disable-line
    }

    const translatedPosition = {
      x: position.x + tx,
      y: position.y + ty,
    }

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
    // this.startBatch('translate', options)
    // this.store.set('position', translatedPosition, options)
    // this.eachChild(child => (child as Node).translate(tx, ty, options))
    // this.stopBatch('translate', options)
    // }

    if (options.silent) {
      this._position = translatedPosition
      this.eachChild(child => {
        if (child.isNode()) {
          child.translate(tx, ty, options)
        }
      })
    } else {
      this.batchUpdate('translate', () => {
        this.execute(
          new PositionChange(this, { ...translatedPosition }),
          'translate',
          options,
        )
        this.eachChild(child => {
          if (child.isNode()) {
            child.translate(tx, ty, options)
          }
        })
      })
    }

    return this
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
    if (options.direction) {
      const currentSize = this.size
      const angle = Angle.normalize(this.rotation || 0)

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

      let fixedPoint: Point
      const bbox = this.getBBox()
      if (quadrant === 0) {
        fixedPoint = bbox.getBottomLeft()
      } else if (quadrant === 1) {
        fixedPoint = bbox.getCorner()
      } else if (quadrant === 2) {
        fixedPoint = bbox.getTopRight()
      } else if (quadrant === 3) {
        fixedPoint = bbox.getOrigin()
      }

      // Find an image of the previous indent point. This is the position,
      // where is the point actually located on the screen.
      const imageFixedPoint = fixedPoint!
        .clone()
        .rotate(-angle, bbox.getCenter())

      // Every point on the element rotates around a circle with the centre of
      // rotation in the middle of the element while the whole element is being
      // rotated. That means that the distance from a point in the corner of
      // the element (supposed its always rect) to the center of the element
      // doesn't change during the rotation and therefore it equals to a
      // distance on un-rotated element. We can find the distance as
      // DISTANCE = (WIDTH/2)^2 + (HEIGHT/2)^2)^0.5.
      const radius = Math.sqrt(width * width + height * height) / 2

      // Now we are looking for an angle between x-axis and the line starting
      // at image of fixed point and ending at the center of the element. We
      // call this angle `alpha`.

      // The image of a fixed point is located in n-th quadrant. For each
      // quadrant passed going anti-clockwise we have to add 90 degrees.
      // Note that the first quadrant has index 0.
      //
      // 3 | 2
      // --c-- Quadrant positions around the element's center `c`
      // 0 | 1
      //
      let alpha = (quadrant * Math.PI) / 2

      // Add an angle between the beginning of the current quadrant (line parallel with x-axis or y-axis
      // going through the center of the element) and line crossing the indent of the fixed point and the center
      // of the element. This is the angle we need but on the un-rotated element.
      alpha += Math.atan(quadrant % 2 === 0 ? height / width : width / height)

      // Lastly we have to deduct the original angle the element was rotated by and that's it.
      alpha -= Angle.toRad(angle)

      // With this angle and distance we can easily calculate the centre of the un-rotated element.
      // Note that fromPolar constructor accepts an angle in radians.
      const center = Point.fromPolar(radius, alpha, imageFixedPoint)

      // The top left corner on the un-rotated element has to be half a width
      // on the left and half a height to the top from the center. This will
      // be the origin of rectangle we were looking for.
      const origin = center.clone().translate(width / -2, height / -2)

      if (options.silent) {
        this._size = { width, height }
        this._position = origin
      } else {
        const name = 'resize'
        this.batchUpdate(name, () => {
          this.execute(new SizeChange(this, { width, height }), name, options)
          this.execute(new PositionChange(this, origin), name, options)
        })
      }
    } else {
      if (options.silent) {
        this._size = { width, height }
      } else {
        this.execute(new SizeChange(this, { width, height }), 'resize', options)
      }
    }

    return this
  }

  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike,
    options: Node.ScaleOptions = {},
  ) {
    this.batchUpdate('scale', () => {
      const bbox = this.getBBox().scale(sx, sy, origin)
      this.setPosition(bbox.x, bbox.y, options)
      this.resize(bbox.width, bbox.height, options)
    })
    return this
  }

  rotate(
    angle: number,
    origin?: Point | Point.PointLike,
    options: Node.RorateOptions = {},
  ) {
    if (origin != null) {
      const size = this.size
      const position = this.position
      const center = this.getBBox().getCenter()
      center.rotate(this.rotation - angle, origin)
      const dx = center.x - size.width / 2 - position.x
      const dy = center.y - size.height / 2 - position.y
      this.batchUpdate('rotate', () => {
        this.setPosition(position.x + dx, position.y + dy, options)
        this.rotate(angle, undefined, options)
      })
    } else {
      const rotation = options.relative ? (this.rotation + angle) % 360 : angle
      if (options.silent) {
        this._rotation = rotation
      } else {
        this.execute(new RotationChange(this, rotation), 'rotate', options)
      }
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
}

export namespace Node {
  export interface PositionOptions extends Cell.SetOptions {
    deep?: boolean
    relative?: boolean
  }

  export interface TranslateOptions extends Cell.SetOptions {
    transition?: boolean
    restrictedArea?: Rectangle.RectangleLike
  }

  export interface ResizeOptions extends Cell.SetOptions {
    absolute?: boolean
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

  export interface RorateOptions extends Cell.SetOptions {
    relative?: boolean
  }

  export interface ScaleOptions extends Cell.SetOptions {}
}

export namespace Node {
  const options = { force: true, silent: true }

  export function executePositionChange(node: Node, position: Point.PointLike) {
    const previous = node.position
    node.setPosition(position.x, position.y, { ...options })
    return previous
  }

  export function executeSizeChange(node: Node, size: Size) {
    const previous = node.size
    node.setSize(size, { ...options })
    return previous
  }

  export function executeRotationChange(node: Node, rotation: number) {
    const previous = node.rotation
    node.rotate(rotation, undefined, { ...options })
    return previous
  }
}
