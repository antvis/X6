import { Stepper } from './stepper'

export class Controller extends Stepper {
  stepper: typeof Stepper.prototype.step

  constructor(fn: typeof Stepper.prototype.step) {
    super()
    this.stepper = fn
  }

  step(
    from: string,
    to: string,
    delta: number,
    context: Stepper.Context,
    contexts: Stepper.Context[],
  ): string
  step(
    from: number,
    to: number,
    delta: number,
    context: Stepper.Context,
    contexts: Stepper.Context[],
  ): number
  step(
    from: string | number,
    to: string | number,
    delta: number,
    context: Stepper.Context,
    contexts: Stepper.Context[],
  ) {
    return this.stepper(from, to, delta, context, contexts)
  }
}
