import { GraphBase } from './base'

export class ConnectionBehaviour extends GraphBase {
  setConnectable(connectable: boolean) {
    if (connectable) {
      this.connectionHandler.enable()
    } else {
      this.connectionHandler.disable()
    }
    return this
  }

  enableConnection() {
    this.connectionHandler.enable()
    return this
  }

  disableConnection() {
    this.connectionHandler.disable()
    return this
  }

  isConnectable() {
    return this.connectionHandler.isEnabled()
  }
}
