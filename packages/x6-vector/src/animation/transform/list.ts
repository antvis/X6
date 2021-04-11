import { DomAnimator } from '../dom'
import { MockedAnimator } from './mock'

export class AnimatorList {
  public readonly ids: number[] = []
  public readonly animators: (DomAnimator | MockedAnimator)[] = []

  add(animator: DomAnimator | MockedAnimator) {
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

  replace(id: number, animator: DomAnimator | MockedAnimator) {
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
    const deleteCount = this.ids.indexOf(id) || 1
    this.ids.splice(0, deleteCount, 0)
    this.animators.splice(0, deleteCount, new MockedAnimator())
    return this.animators
  }

  merge(
    mergeFn: (
      a1: DomAnimator | MockedAnimator,
      a2: DomAnimator | MockedAnimator,
    ) => MockedAnimator,
  ) {
    let prev: DomAnimator | MockedAnimator | null = null
    for (let i = 0; i < this.animators.length; i += 1) {
      const curr = this.animators[i]
      const currs = curr.scheduler()
      const prevs = prev && prev.scheduler()

      const needMerge =
        prev != null &&
        prev.done &&
        curr.done &&
        // don't merge animator when persisted on timeline
        (currs == null || !currs.has(curr.id)) &&
        (prevs == null || !prevs.has(prev.id))

      if (needMerge) {
        this.remove(curr.id)
        const merged = mergeFn(curr, prev!)
        this.replace(prev!.id, merged)
        prev = merged
        i -= 1
      } else {
        prev = curr
      }
    }

    return this
  }
}
