/* eslint-disable @typescript-eslint/no-unused-vars */

export class Stepper {
  done(context: Stepper.Context) {
    return context.done
  }

  step<T>(
    from: T,
    to: T,
    pos: number,
    context: Stepper.Context,
    contexts: Stepper.Context[],
  ): T {
    return from
  }
}

export namespace Stepper {
  export interface Context {
    done: boolean
  }
}
