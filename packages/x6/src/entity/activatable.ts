import { Basecoat } from './basecoat'

export interface IActivatable {
  readonly actived: boolean
  activate(): void
  deactivate(): void
}

export class Activatable<EventArgs = any> extends Basecoat<EventArgs>
  implements IActivatable {
  private activated: boolean = true

  get actived() {
    return this.activated
  }

  activate() {
    this.activated = true
  }

  deactivate() {
    this.activated = false
  }

  isActived() {
    return this.actived
  }

  setActived(actived: boolean) {
    if (actived) {
      this.activate()
    } else {
      this.deactivate()
    }

    return this
  }

  toggleActived() {
    if (this.actived) {
      this.deactivate()
    } else {
      this.activate()
    }

    return this
  }
}
