import type { Dom } from '../../element'
import type { Attrs, CSSKeys } from '../../types'
import { Point } from '../../struct/point'
import { Matrix } from '../../struct/matrix'
import { Util } from '../../element/dom/transform-util'
import { Animator } from '../animator'
import { Morpher } from '../morpher/morpher'
import { MorphableObject } from '../morpher/morphable-object'
import { MorphableMatrix } from '../morpher/morphable-matrix'
import { MorphableTransform } from '../morpher/morphable-transform'
import { AnimatorHelper, ElementHelper } from './util'

@HTMLAnimator.register('HTML')
export class HTMLAnimator<
  TNode extends Node = Node,
  TTarget extends Dom<TNode> = Dom<TNode>
> extends Animator<TNode, TTarget> {
  element(): TTarget
  element(elem: TTarget): this
  element(elem?: TTarget) {
    if (elem == null) {
      return super.element()
    }

    super.element(elem)
    ElementHelper.prepareAnimator(elem)
    return this
  }

  attr(attrs: Attrs): this
  attr(name: string, value: string | number): this
  attr(name: string | Attrs, value?: string | number) {
    return this.animateStyleOrAttr('attr', name, value)
  }

  css(style: CSSStyleDeclaration | Record<string, string>): this
  css(name: CSSKeys, value: string): this
  css(
    name: CSSKeys | CSSStyleDeclaration | Record<string, string>,
    value?: string,
  ) {
    return this.animateStyleOrAttr('css', name, value)
  }

  protected animateStyleOrAttr(
    method: 'attr' | 'css',
    name: string | Record<string, any>,
    value?: string | number,
  ): this {
    if (typeof name === 'string') {
      return this.animateStyleOrAttr(method, { [name]: value })
    }

    let attrs = name
    if (this.retarget(method, attrs)) {
      return this
    }

    const morpher = new Morpher<
      any[],
      Record<string, any>,
      Record<string, any>
    >(this.stepper).to(attrs)

    let keys = Object.keys(attrs)

    this.queue<Record<string, any>>(
      // prepare
      (animator) => {
        const origin = animator.element()[method](keys)
        morpher.from(origin)
      },

      // run
      (animator, pos) => {
        const val = morpher.at(pos)
        animator.element()[method](val)
        return morpher.done()
      },

      // retarget
      (animator, newToAttrs) => {
        // Check if any new keys were added
        const newKeys = Object.keys(newToAttrs)
        const diff = (a: string[], b: string[]) =>
          a.filter((x) => !b.includes(x))
        const differences = diff(newKeys, keys)

        // If their are new keys, initialize them and add them to morpher
        if (differences.length) {
          const addedFromAttrs = animator.element()[method](differences)
          const oldFromAttrs = new MorphableObject(morpher.from()).valueOf()
          morpher.from({
            ...oldFromAttrs,
            ...addedFromAttrs,
          })
        }

        const oldToAttrs = new MorphableObject(morpher.to()).valueOf()
        morpher.to({
          ...oldToAttrs,
          ...newToAttrs,
        })

        // Save the work we did so we don't need it to do again
        keys = newKeys
        attrs = newToAttrs
      },
    )

    this.remember(method, morpher)

    return this
  }

  transform(
    transforms: Matrix.MatrixLike | Matrix.TransformOptions,
    relative?: boolean,
    affine?: boolean,
  ) {
    //
    // M v -----|-----(D M v = F v)------|----->  T v
    //
    // 1. define the final state (T) and decompose it (once)
    //    t = [tx, ty, the, lam, sy, sx]
    // 2. on every frame: pull the current state of all previous transforms
    //    (M - m can change)
    //    and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
    // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
    //      - Note F(0) = M
    //      - Note F(1) = T
    // 4. Now you get the delta matrix as a result: D = F * inv(M)

    const method = 'transform'

    // If we have a declarative function, we should retarget it if possible
    if (this.declarative && !relative) {
      if (this.retarget(method, transforms)) {
        return this
      }
    }

    const isMatrix = MorphableMatrix.isMatrixLike(transforms)
    // eslint-disable-next-line no-param-reassign
    affine = affine != null ? affine : !isMatrix

    const morpher = new Morpher<
      Matrix.MatrixArray,
      Matrix.TransformOptions,
      Matrix.TransformOptions
    >(this.stepper).type(affine ? MorphableTransform : MorphableMatrix)

    let origin: [number, number]
    let element: TTarget
    let startTransformMatrix: Matrix
    let currentTransformMatrix: Matrix
    let currentAngle: number

    this.queue<Matrix.TransformOptions>(
      // prepare
      (animator) => {
        // make sure element and origin is defined
        element = element || animator.element()
        origin =
          origin ||
          Util.getTransformOrigin(
            transforms as Matrix.TransformOptions,
            element,
          )

        startTransformMatrix = new Matrix(relative ? undefined : element)

        // add the animator to the element so it can merge transformations
        ElementHelper.addAnimator(element, animator as HTMLAnimator)

        // Deactivate all transforms that have run so far if we are absolute
        if (!relative) {
          ElementHelper.clearAnimatorsBefore(element, animator).forEach((a) => {
            if (a instanceof HTMLAnimator) {
              if (!a.done) {
                const timeline = a.timeline()
                if (timeline == null || !timeline.has(a)) {
                  const exections = a.executors
                  for (let i = exections.length - 1; i >= 0; i -= 1) {
                    if (exections[i].isTransform) {
                      exections.splice(i, 1)
                    }
                  }
                }
              }
            }
          })
        }
      },

      // run
      (animator, pos) => {
        if (!relative) {
          AnimatorHelper.clearTransform(animator)
        }

        const ctm = ElementHelper.getCurrentTransform(element, animator)
        const { x, y } = new Point(origin[0], origin[1]).transform(ctm)
        const target = new Matrix({ ...transforms, origin: [x, y] })
        const source =
          animator.declarative && currentTransformMatrix
            ? currentTransformMatrix
            : startTransformMatrix

        const t = target.decompose(x, y)
        const s = source.decompose(x, y)

        if (affine) {
          // Get the current and target angle as it was set
          const rt = t.rotate
          const rs = s.rotate

          // Figure out the shortest path to rotate directly
          const possibilities = [rt - 360, rt, rt + 360]
          const distances = possibilities.map((a) => Math.abs(a - rs))
          const shortest = Math.min(...distances)
          const index = distances.indexOf(shortest)
          t.rotate = possibilities[index]
        }

        if (relative) {
          // we have to be careful here not to overwrite the rotation
          // with the rotate method of Matrix
          if (!isMatrix) {
            t.rotate = (transforms as Matrix.TransformOptions).rotate || 0
          }
          if (this.declarative && currentAngle) {
            s.rotate = currentAngle
          }
        }

        morpher.from(s)
        morpher.to(t)

        const affineParameters = morpher.at(pos)
        currentAngle = affineParameters.rotate!
        currentTransformMatrix = new Matrix(affineParameters)

        AnimatorHelper.addTransform(animator, currentTransformMatrix)
        ElementHelper.addAnimator(element, animator)

        return morpher.done()
      },

      // retarget
      (animator, newTransforms) => {
        const prev = (transforms as Matrix.TransformOptions).origin || 'center'
        const next = (newTransforms.origin || 'center').toString()

        // only get a new origin if it changed since the last call
        if (prev.toString() !== next.toString()) {
          origin = Util.getTransformOrigin(newTransforms, element)
        }

        // overwrite the old transformations with the new ones
        // eslint-disable-next-line no-param-reassign
        transforms = { ...newTransforms, origin }
      },

      true,
    )

    if (this.declarative) {
      this.remember(method, morpher)
    }

    return this
  }
}
