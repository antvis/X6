import { Graph, Primer } from '@antv/x6'

export class Command extends Primer {
  name: string
  handler: (graph: Graph, arg?: any) => void
  visible: boolean
  enabled: boolean
  shortcut?: string
  icon?: string
  isSwitch?: boolean
  isChecked?: (graph: Graph) => void

  constructor(options: Command.Options) {
    super()

    this.name = options.name
    this.handler = options.handler

    this.enabled = options.enabled != null ? options.enabled : true
    this.visible = options.visible != null ? options.visible : true

    this.icon = options.icon
    this.shortcut = options.shortcut

    this.isSwitch = options.isSwitch
    this.isChecked = options.isChecked
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
}

export namespace Command {
  export interface Options {
    name: string
    handler: (graph: Graph, arg?: any) => void
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
