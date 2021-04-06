import { Stepper } from './stepper'

export class SpringController extends Stepper {
  protected d: number
  protected k: number
  protected readonly duration: number
  protected readonly overshoot: number

  constructor(duration = 500, overshoot = 0) {
    super()
    this.duration = duration
    this.overshoot = overshoot
  }

  step(
    from: string,
    to: string,
    delta: number,
    context: SpringController.Context,
  ): string
  step(
    from: number,
    to: number,
    delta: number,
    context: SpringController.Context,
  ): number
  step(
    from: string | number,
    to: string | number,
    delta: number,
    context: SpringController.Context,
  ) {
    if (typeof from === 'string') {
      return from
    }

    const origin = from as number
    const target = to as number

    context.done = delta === Infinity

    if (delta === Infinity) {
      return target
    }

    if (delta === 0) {
      return origin
    }

    if (delta > 100) {
      delta = 16 // eslint-disable-line
    }

    delta /= 1000 // eslint-disable-line

    // Get the previous velocity
    const velocity = context.velocity || 0

    // Apply the control to get the new position and store it
    const acceleration = -this.d * velocity - this.k * (origin - target)
    const newPosition =
      origin + velocity * delta + (acceleration * delta * delta) / 2

    // Store the velocity
    context.velocity = velocity + acceleration * delta

    // Figure out if we have converged, and if so, pass the value
    context.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002
    return context.done ? target : newPosition
  }

  protected recalculate() {
    // Apply the default parameters
    const duration = (this.duration || 500) / 1000
    const overshoot = this.overshoot || 0

    // Calculate the PID natural response
    const eps = 1e-10
    const pi = Math.PI
    const os = Math.log(overshoot / 100 + eps)
    const zeta = -os / Math.sqrt(pi * pi + os * os)
    const wn = 3.9 / (zeta * duration)

    // Calculate the Spring values
    this.d = 2 * zeta * wn
    this.k = wn * wn
  }
}

export namespace SpringController {
  export interface Context extends Stepper.Context {
    velocity: number
  }
}
