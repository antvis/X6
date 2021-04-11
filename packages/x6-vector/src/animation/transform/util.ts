import { Dom } from '../../dom'
import { Matrix } from '../../struct/matrix'
import { Queue } from '../../animating/scheduler/queue'
import { Timing } from '../../animating/scheduler/timing'
import { BaseAnimator } from '../base'
import { AnimatorList } from './list'
import { MockedAnimator } from './mock'

const animators: WeakMap<Dom, AnimatorList> = new WeakMap()
const frames: WeakMap<Dom, Queue.Item<Timing.Frame>> = new WeakMap()

export function prepareTransform(elem: Dom) {
  if (!frames.has(elem)) {
    const mock = createMockAnimator(new Matrix(elem))
    const list = new AnimatorList().add(mock)
    animators.set(elem, list)
  }
}

function createMockAnimator(matrix?: Matrix, id?: number) {
  const mock = new MockedAnimator(id)
  addTransform(mock, matrix)
  return mock
}

export function addAnimator(elem: Dom, animator: BaseAnimator) {
  animators.get(elem)!.add(animator)

  let frameId = frames.get(elem) || null

  // Make sure that the animator merge is executed at the very end of
  // all animation functions. Thats why we use immediate here to execute
  // the merge right after all frames are run
  Timing.cancelImmediate(frameId)

  frameId = Timing.immediate(() => {
    const list = animators.get(elem)!
    const next = list.animators
      .map((animator) => getTransform(animator)!)
      .reduce((memo, curr) => memo.lmultiplyO(curr), new Matrix())

    elem.transform(next)
    list.merge((a1, a2) => {
      const m1 = getTransform(a1)!
      const m2 = getTransform(a2)!
      clearTransform(a2)
      return createMockAnimator(m2.lmultiply(m1), a2.id)
    })

    if (list.length() === 1) {
      frames.delete(elem)
    }
  })

  frames.set(elem, frameId)
}

export function clearAnimatorsBefore(elem: Dom, animator: BaseAnimator) {
  const cache = animators.get(elem)!
  return cache.clearBefore(animator.id)
}

export function getCurrentTransform(elem: Dom, animator: BaseAnimator) {
  const arr = animators.get(elem)!

  return (
    arr.animators
      // we need the equal sign here to make sure, that also transformations
      // on the same runner which execute before the current transformation are
      // taken into account
      .filter((item) => item.id <= animator.id)
      .map((animator) => getTransform(animator)!)
      .reduce((memo, curr) => memo.lmultiplyO(curr), new Matrix())
  )
}

const transforms: WeakMap<BaseAnimator | MockedAnimator, Matrix> = new WeakMap()

export function addTransform(
  animator: BaseAnimator | MockedAnimator,
  transform?: Matrix.Raw,
) {
  let ctm = transforms.get(animator)
  if (ctm == null) {
    ctm = new Matrix()
  }

  if (transform) {
    ctm.lmultiplyO(transform)
  }

  transforms.set(animator, ctm)
}

export function clearTransform(animator: BaseAnimator | MockedAnimator) {
  transforms.set(animator, new Matrix())
}

export function getTransform(animator: BaseAnimator | MockedAnimator) {
  return transforms.get(animator)
}
