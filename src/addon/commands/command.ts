import { Primer } from '../../common'
import { Graph } from '../../core'

export class Command extends Primer {
  name: string
  visible: boolean
  enabled: boolean
  shortcut?: string

  constructor(options: Command.Options) {
    super()

    this.name = options.name
    this.enabled = options.enabled != null ? options.enabled : true
    this.visible = options.visible != null ? options.visible : true
    this.shortcut = options.shortcut
  }

  enable() {
    this.setEnabled(true)
  }

  disable() {
    this.setEnabled(false)
  }

  setEnabled(enabled: boolean) {
    if (this.enabled !== enabled) {
      this.enabled = enabled
      this.trigger(Command.events.stateChanged)
    }
  }

  isEnabled() {
    return this.enabled
  }

  toggleEnabled() {
    if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }
  }

  isChecked() {

  }
}

export namespace Command {
  export interface Options {
    name: string
    handler: (arg1?: any) => void
    icon?: string
    visible?: boolean
    enabled?: boolean
    shortcut?: string

    isSwitch?: boolean
    isChecked?: (graph: Graph) => boolean
  }

  export const events = {
    stateChanged: 'stateChanged',
  }
}
