export class WorkerMessenger {
  protected url: string
  protected worker: Worker | null
  protected requestId: number
  protected pending: {
    [id: string]: [(result: any) => void, (error: any) => void]
  }

  constructor(url: string) {
    this.requestId = 0
    this.pending = {}
    this.url = url
    this.worker = new Worker(this.url)
    this.worker.onmessage = (e) => this.onMessage(e)
  }

  release() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }

    Object.keys(this.pending).forEach((id) => {
      this.resolve(id, null, new Error('Worker terminated: ' + this.url))
    })
  }

  postMessage(message: any) {
    if (this.worker) {
      this.worker.postMessage(message)
    }
  }

  requestResponse(message: any) {
    return new Promise((resolve, reject) => {
      message.id = ++this.requestId
      this.pending[message.id] = [resolve, reject]
      this.postMessage(message)
    })
  }

  private onMessage(e: MessageEvent) {
    const data = e.data
    if (!data || !data.id) {
      console.log('Unexpected message', e)
      return
    }

    this.resolve(data.id, data.result, data.error)
  }

  protected resolve(id: string, result: any, error: any) {
    const resolver = this.pending[id]

    if (!resolver) {
      console.log('No resolver for', { id, result, error })
      return
    }

    delete this.pending[id]

    if (error) {
      resolver[1](new Error(error))
      return
    }

    resolver[0](result)
  }
}
