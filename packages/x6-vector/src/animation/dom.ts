import { Morpher } from '../animating/morpher/morpher'
import { MorphableObject } from '../animating/morpher/object'
import { Dom } from '../dom'
import { AttributesMap } from '../dom/attributes'
import { CSSProperties } from '../dom/style'
import { BaseAnimator } from './base'
import { TransformAnimator } from './transform'

@DomAnimator.register('HTML')
@DomAnimator.mixin(TransformAnimator)
export class DomAnimator<
  TElement extends Element = Element,
  TOwner extends Dom<TElement> = Dom<TElement>,
> extends BaseAnimator<TElement, TOwner> {
  attr<T extends AttributesMap<TElement>>(attrs: T): this
  attr<T extends AttributesMap<TElement>, K extends keyof T>(
    name: K,
    value: T[K],
  ): this
  attr<T extends AttributesMap<TElement>, K extends keyof T>(
    name: K | T,
    value?: T[K],
  ) {
    return this.queueAttrOrCSS('attr', name, value)
  }

  css<T extends CSSProperties>(style: T): this
  css<T extends CSSProperties, K extends keyof T>(name: K, value: T[K]): this
  css<T extends CSSProperties, K extends keyof T>(name: K | T, value?: T[K]) {
    return this.queueAttrOrCSS('css', name, value)
  }

  protected queueAttrOrCSS<
    M extends 'attr' | 'css',
    T extends M extends 'attr' ? AttributesMap<TElement> : CSSProperties,
    K extends keyof T,
  >(method: M, name: K | T, value?: T[K]): this {
    if (typeof name === 'string') {
      return this.queueAttrOrCSS(method, { [name]: value } as T)
    }

    let attrs = name as T
    if (this.retarget(method, attrs)) {
      return this
    }

    const morpher = new Morpher<any[], T, T>(this.stepper).to(attrs)

    let keys = Object.keys(attrs)

    this.queue<T>(
      // prepare
      (animator) => {
        const origin = animator.element()[method](keys as any)
        morpher.from(origin as T)
      },

      // run
      (animator, pos) => {
        const val = morpher.at(pos)
        animator.element()[method](val as any)
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
          const addedFromAttrs = animator
            .element()
            [method](differences as any) as T
          const oldFromAttrs = new MorphableObject<T>(morpher.from()).toValue()
          morpher.from({
            ...oldFromAttrs,
            ...addedFromAttrs,
          })
        }

        const oldToAttrs = new MorphableObject<T>(morpher.to()).toValue()
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
}

export interface DomAnimator<
  TElement extends Element = Element,
  TOwner extends Dom<TElement> = Dom<TElement>,
> extends TransformAnimator<TElement, TOwner> {}
