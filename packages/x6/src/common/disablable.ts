import { Base } from './base'

export abstract class Disablable extends Base {
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
