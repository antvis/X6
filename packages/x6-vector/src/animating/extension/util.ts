import { Dom } from '../../element'
import { Matrix } from '../../struct/matrix'
import { Queue } from '../scheduler/queue'
import { Timing } from '../scheduler/timing'
import { Animator } from '../animator'
import { HTMLAnimator } from './html'

class Mock {
  constructor(public id = -1, public done = true) {}
  timeline() {}
}

function createMockAnimator(matrix?: Matrix, id?: number) {
  const mock = new Mock(id)
  AnimatorHelper.addTransform(mock, matrix)
  return mock
}

function mergeAnimators(a1: Animator | Mock, a2: Animator | Mock) {
  const m1 = AnimatorHelper.getTransform(a1)!
  const m2 = AnimatorHelper.getTransform(a2)!
  AnimatorHelper.clearTransform(a2)
  return createMockAnimator(m2.lmultiply(m1), a2.id)
}

class AnimatorArray {
  public readonly ids: number[] = []
  public readonly animators: (Animator | Mock)[] = []

  add(animator: Animator | Mock) {
    if (this.animators.includes(animator)) {
      return this
    }

    this.ids.push(animator.id)
    this.animators.push(animator)

    return this
  }

  remove(id: number) {
    const index = this.ids.indexOf(id)
    this.ids.splice(index, 1)
    this.animators.splice(index, 1)
    return this
  }

  replace(id: number, animator: Animator | Mock) {
    const index = this.ids.indexOf(id)
    this.ids.splice(index, 1, id)
    this.animators.splice(index, 1, animator)
    return this
  }

  get(id: number) {
    return this.animators[this.ids.indexOf(id)]
  }

  length() {
    return this.ids.length
  }

  clearBefore(id: number) {
    const deleteCnt = this.ids.indexOf(id) || 1
    this.ids.splice(0, deleteCnt, 0)
    this.animators.splice(0, deleteCnt, new Mock())
    return this.animators
  }

  merge() {
    let last: Animator | Mock | null = null
    for (let i = 0; i < this.animators.length; i += 1) {
      const curr = this.animators[i]
      const currTimeline = curr.timeline()
      const lastTimeline = last && last.timeline()

      const condition =
        last != null &&
        last.done &&
        curr.done &&
        // don't merge runner when persisted on timeline
        (currTimeline == null || !currTimeline.has(curr.id)) &&
        (lastTimeline == null || !lastTimeline.has(last.id))

      if (condition) {
        this.remove(curr.id)
        const merged = mergeAnimators(curr, last!)
        this.replace(last!.id, merged)
        last = merged
        i -= 1
      } else {
        last = curr
      }
    }

    return this
  }
}

export namespace ElementHelper {
  const list: WeakMap<Dom<Node>, AnimatorArray> = new WeakMap()
  const frame: WeakMap<Dom<Node>, Queue.Item<Timing.Frame>> = new WeakMap()

  export function prepareAnimator(elem: Dom<Node>) {
    if (!frame.has(elem)) {
      const mock = createMockAnimator(new Matrix(elem))
      const arr = new AnimatorArray().add(mock)
      list.set(elem, arr)
    }
  }

  export function addAnimator(elem: Dom<Node>, animator: HTMLAnimator) {
    const arr = list.get(elem)!

    arr.add(animator)

    let frameId = frame.get(elem) || null

    // Make sure that the animator merge is executed at the very end of
    // all animation functions. Thats why we use immediate here to execute
    // the merge right after all frames are run
    Timing.cancelImmediate(frameId)

    frameId = Timing.immediate(() => {
      const arr = list.get(elem)!
      const next = arr.animators
        .map((animator) => AnimatorHelper.getTransform(animator)!)
        .reduce((memo, curr) => memo.lmultiplyO(curr), new Matrix())

      elem.transform(next)
      arr.merge()

      if (arr.length() === 1) {
        frame.delete(elem)
      }
    })

    frame.set(elem, frameId)
  }

  export function clearAnimatorsBefore(
    elem: Dom<Node>,
    animator: HTMLAnimator,
  ) {
    const cache = list.get(elem)!
    return cache.clearBefore(animator.id)
  }

  export function getCurrentTransform(elem: Dom<Node>, animator: HTMLAnimator) {
    const arr = list.get(elem)!

    return (
      arr.animators
        // we need the equal sign here to make sure, that also transformations
        // on the same runner which execute before the current transformation are
        // taken into account
        .filter((item) => item.id <= animator.id)
        .map((animator) => AnimatorHelper.getTransform(animator)!)
        .reduce((memo, curr) => memo.lmultiplyO(curr), new Matrix())
    )
  }
}

export namespace AnimatorHelper {
  const cache: WeakMap<Animator | Mock, Matrix> = new WeakMap()

  export function addTransform(
    animator: Animator | Mock,
    transform?: Matrix.Raw,
  ) {
    let ctm = cache.get(animator)
    if (ctm == null) {
      ctm = new Matrix()
    }
    if (transform) {
      ctm.lmultiplyO(transform)
    }
    cache.set(animator, ctm)
  }

  export function clearTransform(animator: Animator | Mock) {
    cache.set(animator, new Matrix())
  }

  export function getTransform(animator: Animator | Mock) {
    return cache.get(animator)
  }
}
