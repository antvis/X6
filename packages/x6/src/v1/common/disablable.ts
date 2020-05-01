import { Basecoat } from '../../entity'

export interface IDisablable {
  readonly disabled: boolean
  enable(): void
  disable(): void
}

export abstract class Disablable<EventArgs = any> extends Basecoat<EventArgs>
  implements IDisablable {
  // tslint:disable-next-line
  private _disabled?: boolean

  public get disabled(): boolean {
    return this._disabled === true
  }

  public enable() {
    delete this._disabled
  }

  public disable() {
    this._disabled = true
  }
}
