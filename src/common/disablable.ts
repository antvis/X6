import { Primer } from './primer'

export class Disablable extends Primer {
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
    return !this.disabled
  }

  setEnadled(enabled: boolean) {
    this.disabled = !enabled
  }

  toggleEnadled() {
    this.disabled = !this.disabled
  }
}
