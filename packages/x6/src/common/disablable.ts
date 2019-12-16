import { Primer } from './primer'

export abstract class Disablable<M = any> extends Primer<M> {
  private disabled: boolean = false

  get enabled() {
    return this.isEnabled()
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }

  isEnabled() {
    return !this.disabled
  }

  setEnadled(enabled: boolean) {
    if (enabled) {
      this.enable()
    } else {
      this.disable()
    }
  }

  toggleEnadled() {
    if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }
  }
}
