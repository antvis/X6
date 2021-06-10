import { Dom } from '../../dom'
import { Point } from '../../struct/point'
import { Matrix } from '../../struct/matrix'
import { BaseAnimator } from '../base'
import { Morpher } from '../../animating/morpher/morpher'
import { MorphableMatrix } from '../../animating/morpher/matrix'
import { MorphableTransform } from '../../animating/morpher/transform'
import { getTransformOrigin } from '../../dom/transform/util'
import * as Util from './util'

export class TransformAnimator<
  TElement extends Element = Element,
  TOwner extends Dom<TElement> = Dom<TElement>,
> extends BaseAnimator<TElement, TOwner> {
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

    Util.prepareTransform(this.element())

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
    let element: TOwner
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
          getTransformOrigin(transforms as Matrix.TransformOptions, element)

        startTransformMatrix = new Matrix(relative ? undefined : element)

        // add the animator to the element so it can merge transformations
        Util.addAnimator(element, animator)

        // Deactivate all transforms that have run so far if we are absolute
        if (!relative) {
          Util.clearAnimatorsBefore(element, animator).forEach((animator) => {
            if (animator instanceof BaseAnimator) {
              if (!animator.done) {
                const timeline = animator.scheduler()
                if (timeline == null || !timeline.has(animator)) {
                  const a = animator as any as TransformAnimator
                  a.clearTransformExecutors()
                }
              }
            }
          })
        }
      },

      // run
      (animator, pos) => {
        if (!relative) {
          Util.clearTransform(animator)
        }

        const ctm = Util.getCurrentTransform(element, animator)
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

        Util.addTransform(animator, currentTransformMatrix)
        Util.addAnimator(element, animator)

        return morpher.done()
      },

      // retarget
      (animator, newTransforms) => {
        const prev = (transforms as Matrix.TransformOptions).origin || 'center'
        const next = (newTransforms.origin || 'center').toString()

        // only get a new origin if it changed since the last call
        if (prev.toString() !== next.toString()) {
          origin = getTransformOrigin(newTransforms, element)
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

  protected clearTransformExecutors() {
    const executors = this.executors
    for (let i = executors.length - 1; i >= 0; i -= 1) {
      if (executors[i].isTransform) {
        executors.splice(i, 1)
      }
    }
  }
}
