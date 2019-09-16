import { Primer } from './primer'

export class Disablable extends Primer {
  private disabled: boolean = false

  get enabled() {
    return !this.disabled
  }

  isEnabled() {
    return !this.disabled
  }

  setEnadled(enabled: boolean) {
    this.disabled = !enabled
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }
}
