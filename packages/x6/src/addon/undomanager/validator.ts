import { Basecoat } from '../../common'
import { UndoManager } from './undomanager'

export class Validator extends Basecoat<Validator.EventArgs> {
  protected readonly undoManager: UndoManager
  protected readonly map: { [event: string]: Validator.Callback[][] }
  protected cancelInvalid: boolean

  constructor(options: Validator.Options) {
    super()
    this.map = {}
    this.undoManager = options.undoManager
    this.cancelInvalid = options.cancelInvalid !== false
    this.undoManager.on('add', this.onCommand, this)
  }

  protected onCommand({ cmds }: UndoManager.EventArgs['add']) {
    return Array.isArray(cmds)
      ? cmds.every((cmd) => this.validateCommand(cmd))
      : this.validateCommand(cmds)
  }

  protected validateCommand(cmd: UndoManager.Command) {
    if (cmd.options && cmd.options.validation === false) {
      return true
    }

    const callbacks = (cmd.event && this.map[cmd.event]) || []

    let handoverErr: Error | null = null

    callbacks.forEach((routes) => {
      let i = 0

      const rollup = (err: Error | null) => {
        const fn = routes[i]
        i += 1

        try {
          if (fn) {
            fn(err, cmd, rollup)
          } else {
            handoverErr = err
            return
          }
        } catch (err) {
          rollup(err)
        }
      }

      rollup(handoverErr)
    })

    if (handoverErr) {
      if (this.cancelInvalid) {
        this.undoManager.cancel()
      }
      this.emit('invalid', handoverErr)
      return false
    }

    return true
  }

  validate(events: string | string[], ...callbacks: Validator.Callback[]) {
    const evts = Array.isArray(events) ? events : events.split(/\s+/)

    callbacks.forEach((callback) => {
      if (typeof callback !== 'function') {
        throw new Error(`${evts.join(' ')} requires callback functions.`)
      }
    })

    evts.forEach((event) => {
      if (this.map[event] == null) {
        this.map[event] = []
      }
      this.map[event].push(callbacks)
    })

    return this
  }

  @Basecoat.dispose()
  dispose() {
    this.undoManager.off('add', this.onCommand, this)
  }
}

export namespace Validator {
  export interface Options {
    undoManager: UndoManager
    /**
     * To cancel (= undo + delete from redo stack) a command if is not valid.
     */
    cancelInvalid?: boolean
  }

  export type Callback = (
    err: Error | null,
    cmd: UndoManager.Command,
    next: (err: Error | null) => any,
  ) => any

  export interface EventArgs {
    invalid: {}
  }
}
