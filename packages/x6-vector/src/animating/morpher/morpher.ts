import { Easing } from '../stepper/easing'
import { Stepper } from '../stepper/stepper'
import { Util } from './morphable-util'
import { Morphable } from './morphable'

export class Morpher<TArray extends any[], TInput, TValue> {
  protected Type: typeof Morphable | null = null
  protected stepper: Stepper
  protected source: TArray = [] as any
  protected target: TArray = [] as any
  protected contexts: Stepper.Context[]
  protected instance: Morphable<TArray, TValue>

  constructor(stepper?: Stepper) {
    this.stepper = stepper || new Easing()
  }

  ease(): Stepper
  ease(stepper: Stepper): this
  ease(stepper?: Stepper) {
    if (stepper == null) {
      return this.stepper
    }

    this.stepper = stepper
    return this
  }

  at(pos: number): TValue {
    const current = this.source.map((val, index) =>
      this.stepper.step(
        val,
        this.target[index],
        pos,
        this.contexts[index],
        this.contexts,
      ),
    )

    return this.instance.fromArray(current as TArray).valueOf()
  }

  done(): boolean {
    return this.contexts
      .map((context) => this.stepper.done(context))
      .reduce((memo, curr) => memo && curr, true)
  }

  from(): TArray
  from(val: TInput): this
  from(val?: TInput) {
    if (val == null) {
      return this.source
    }

    this.source = this.set(val)
    return this
  }

  to(): TArray
  to(val: TInput): this
  to(val?: TInput) {
    if (val == null) {
      return this.target
    }

    this.target = this.set(val)
    return this
  }

  type(): typeof Morphable
  type(t: typeof Morphable): this
  type(t?: typeof Morphable) {
    if (t == null) {
      return this.Type
    }

    this.Type = t

    return this
  }

  protected set(value: TInput): TArray {
    if (this.Type == null) {
      this.type(Util.getClassForType(value))
    }

    const Ctor = this.type()
    const morphable = new Ctor<TArray, TValue>(value)

    const arr = morphable.toArray()

    if (this.instance == null) {
      this.instance = new Ctor()
    }

    if (this.contexts == null) {
      this.contexts = arr.map(() => ({ done: true }))
    }

    return arr
  }
}
