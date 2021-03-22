/* eslint-disable no-underscore-dangle */

/**
 * An object which implements the disposable pattern.
 */
export interface IDisposable {
  /**
   * Test whether the object has been disposed.
   *
   * #### Notes
   * This property is always safe to access.
   */
  readonly disposed: boolean

  /**
   * Dispose of the resources held by the object.
   *
   * #### Notes
   * If the object's `dispose` method is called more than once, all
   * calls made after the first will be a no-op.
   *
   * #### Undefined Behavior
   * It is undefined behavior to use any functionality of the object
   * after it has been disposed unless otherwise explicitly noted.
   */
  dispose(): void
}

export class Disposable implements IDisposable {
  // constructor() {
  //   if (Platform.IS_IE) {
  //     DomEvent.addListener(window, 'unload', () => {
  //       this.dispose()
  //     })
  //   }
  // }

  // eslint-disable-next-line
  private _disposed?: boolean

  get disposed() {
    return this._disposed === true
  }

  public dispose() {
    this._disposed = true
  }
}

export namespace Disposable {
  export function dispose() {
    return (
      target: any,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value
      const proto = target.__proto__ as IDisposable // eslint-disable-line
      descriptor.value = function (this: IDisposable) {
        if (this.disposed) {
          return
        }
        raw.call(this)
        proto.dispose.call(this)
      }
    }
  }
}

/**
 * A disposable object which delegates to a callback function.
 */
export class DisposableDelegate implements IDisposable {
  private callback: (() => void) | null

  /**
   * Construct a new disposable delegate.
   *
   * @param callback - The callback function to invoke on dispose.
   */
  constructor(callback: () => void) {
    this.callback = callback
  }

  /**
   * Test whether the delegate has been disposed.
   */
  get disposed(): boolean {
    return !this.callback
  }

  /**
   * Dispose of the delegate and invoke the callback function.
   */
  dispose(): void {
    if (!this.callback) {
      return
    }
    const callback = this.callback
    this.callback = null
    callback()
  }
}

/**
 * An object which manages a collection of disposable items.
 */
export class DisposableSet implements IDisposable {
  private isDisposed = false // eslint-disable-line:variable-name

  private items = new Set<IDisposable>()

  /**
   * Test whether the set has been disposed.
   */
  get disposed(): boolean {
    return this.isDisposed
  }

  /**
   * Dispose of the set and the items it contains.
   *
   * #### Notes
   * Items are disposed in the order they are added to the set.
   */
  dispose(): void {
    if (this.isDisposed) {
      return
    }
    this.isDisposed = true

    this.items.forEach((item) => {
      item.dispose()
    })
    this.items.clear()
  }

  /**
   * Test whether the set contains a specific item.
   *
   * @param item - The item of interest.
   *
   * @returns `true` if the set contains the item, `false` otherwise.
   */
  contains(item: IDisposable): boolean {
    return this.items.has(item)
  }

  /**
   * Add a disposable item to the set.
   *
   * @param item - The item to add to the set.
   *
   * #### Notes
   * If the item is already contained in the set, this is a no-op.
   */
  add(item: IDisposable): void {
    this.items.add(item)
  }

  /**
   * Remove a disposable item from the set.
   *
   * @param item - The item to remove from the set.
   *
   * #### Notes
   * If the item is not contained in the set, this is a no-op.
   */
  remove(item: IDisposable): void {
    this.items.delete(item)
  }

  /**
   * Remove all items from the set.
   */
  clear(): void {
    this.items.clear()
  }
}

export namespace DisposableSet {
  /**
   * Create a disposable set from an iterable of items.
   *
   * @param items - The iterable or array-like object of interest.
   *
   * @returns A new disposable initialized with the given items.
   */
  export function from(items: IDisposable[]): DisposableSet {
    const set = new DisposableSet()
    items.forEach((item) => {
      set.add(item)
    })
    return set
  }
}
