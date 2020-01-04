import { Basecoat } from '../../entity'
import { Graph } from '../../graph'

export class Command extends Basecoat {
  name: string
  text?: string
  icon?: string
  tooltip?: string
  shortcut?: string
  visible: boolean
  enabled: boolean
  checked?: boolean
  handler: (graph: Graph, ...args: any[]) => void

  constructor(options: Command.Options) {
    super()

    this.name = options.name
    this.text = options.text
    this.icon = options.icon
    this.tooltip = options.tooltip
    this.shortcut = options.shortcut
    this.checked = options.checked
    this.enabled = options.enabled != null ? options.enabled : true
    this.visible = options.visible != null ? options.visible : true
    this.handler = options.handler
  }

  isEnabled() {
    return this.enabled
  }

  setEnabled(enabled: boolean) {
    if (this.isEnabled() !== enabled) {
      this.enabled = enabled
      this.trigger(Command.events.stateChanged, { enabled })
    }
  }

  enable() {
    this.setEnabled(true)
  }

  disable() {
    this.setEnabled(false)
  }

  toggleEnabled() {
    if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }
  }

  isVisible() {
    return this.visible
  }

  setVisible(visible: boolean) {
    if (this.isVisible() !== visible) {
      this.visible = visible
      this.trigger(Command.events.stateChanged, { visible })
    }
  }

  show() {
    this.setVisible(true)
  }

  hide() {
    this.setVisible(false)
  }

  toggleVisible() {
    if (this.visible) {
      this.hide()
    } else {
      this.show()
    }
  }

  isChecked() {
    return this.checked
  }

  setChecked(checked: boolean) {
    if (this.isChecked() !== checked) {
      this.checked = checked
      this.trigger(Command.events.stateChanged, { checked })
    }
  }

  check() {
    this.setChecked(true)
  }

  uncheck() {
    this.setChecked(false)
  }

  toggleChecked() {
    if (this.isChecked()) {
      this.uncheck()
    } else {
      this.check()
    }
  }
}

export namespace Command {
  export interface Options {
    name: string
    text?: string
    icon?: string
    tooltip?: string
    shortcut?: string
    visible?: boolean
    enabled?: boolean
    checked?: boolean
    handler: (graph: Graph, ...args: any[]) => void
  }

  export const events = {
    stateChanged: 'stateChanged',
  }
}
