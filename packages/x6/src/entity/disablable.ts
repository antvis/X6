import { Basecoat } from './basecoat'

export interface IDisablable {
  readonly enabled: boolean

  enable(): void
  disable(): void
}

export abstract class Disablable<EventArgs = any> extends Basecoat<EventArgs>
  implements IDisablable {
  private disabled: boolean = false

  get enabled() {
    return !this.disabled
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }

  isEnabled() {
    return this.enabled
  }

  setEnadled(enabled: boolean) {
    if (enabled) {
      this.enable()
    } else {
      this.disable()
    }

    return this
  }

  toggleEnadled() {
    if (this.enabled) {
      this.disable()
    } else {
      this.enable()
    }

    return this
  }
}
