export abstract class Stepper {
  done(context: Stepper.Context) {
    return context.done
  }

  abstract step<T>(
    from: T,
    to: T,
    pos: number,
    context: Stepper.Context,
    contexts: Stepper.Context[],
  ): T
}

export namespace Stepper {
  export interface Context {
    done: boolean
  }
}
