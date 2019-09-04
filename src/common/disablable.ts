import { Primer } from './primer'

export class Disablable extends Primer {
  private flag: boolean = true

  get enabled() {
    return this.flag
  }

  isEnabled() {
    return this.flag
  }

  enable() {
    this.flag = true
  }

  disable() {
    this.flag = false
  }
}
