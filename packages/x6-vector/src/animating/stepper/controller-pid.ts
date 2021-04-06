import { Stepper } from './stepper'

export class PIDController extends Stepper {
  private p: number
  private i: number
  private d: number
  private windup: number | false

  constructor(p = 0.1, i = 0.01, d = 0, windup = 1000) {
    super()
    this.p = p
    this.i = i
    this.d = d
    this.windup = windup
  }

  step(
    from: string,
    to: string,
    delta: number,
    context: PIDController.Context,
  ): string
  step(
    from: number,
    to: number,
    delta: number,
    context: PIDController.Context,
  ): number
  step(
    from: string | number,
    to: string | number,
    delta: number,
    context: PIDController.Context,
  ) {
    if (typeof from === 'string') {
      return from
    }

    context.done = delta === Infinity

    const origin = from as number
    const target = to as number

    if (delta === Infinity) {
      return target
    }

    if (delta === 0) {
      return origin
    }

    const p = target - origin
    let i = (context.integral || 0) + p * delta
    const d = (p - (context.error || 0)) / delta
    const windup = this.windup

    // antiwindup
    if (windup !== false) {
      i = Math.max(-windup, Math.min(i, windup))
    }

    context.error = p
    context.integral = i
    context.done = Math.abs(p) < 0.001

    return context.done
      ? target
      : origin + (this.p * p + this.i * i + this.d * d)
  }
}

export namespace PIDController {
  export interface Context extends Stepper.Context {
    error: number
    integral: number
  }
}
