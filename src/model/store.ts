import type { Assign, NonUndefined } from 'utility-types'
import { Basecoat, disposable, type KeyValue, ObjectExt } from '../common'

export interface StoreSetOptions extends KeyValue {
  silent?: boolean
}

export interface StoreMutateOptions extends StoreSetOptions {
  unset?: boolean
}

export interface StoreSetByPathOptions extends StoreSetOptions {
  rewrite?: boolean
}

type CommonArgs<D> = { store: Store<D> }

export interface EventArgs<D, K extends keyof D = keyof D> {
  'change:*': Assign<
    {
      key: K
      current: D[K]
      previous: D[K]
      options: StoreMutateOptions
    },
    CommonArgs<D>
  >
  changed: Assign<
    {
      current: D
      previous: D
      options: StoreMutateOptions
    },
    CommonArgs<D>
  >
  disposed: CommonArgs<D>
}
export class Store<D> extends Basecoat<EventArgs<D>> {
  protected data: D
  protected previous: D
  protected changed: Partial<D>
  protected pending = false
  protected changing = false
  protected pendingOptions: StoreMutateOptions | null

  constructor(data: Partial<D> = {}) {
    super()
    this.data = {} as D
    this.mutate(ObjectExt.cloneDeep(data))
    this.changed = {}
  }

  protected mutate<K extends keyof D>(
    data: Partial<D>,
    options: StoreMutateOptions = {},
  ) {
    const unset = options.unset === true
    const silent = options.silent === true
    const changes: K[] = []
    const changing = this.changing

    this.changing = true

    if (!changing) {
      this.previous = ObjectExt.cloneDeep(this.data)
      this.changed = {}
    }

    const current = this.data
    const previous = this.previous
    const changed = this.changed

    Object.keys(data).forEach((k) => {
      const key = k as K
      const newValue = data[key]
      if (!ObjectExt.isEqual(current[key], newValue)) {
        changes.push(key)
      }

      if (!ObjectExt.isEqual(previous[key], newValue)) {
        changed[key] = newValue
      } else {
        delete changed[key]
      }

      if (unset) {
        delete current[key]
      } else {
        current[key] = newValue as any
      }
    })

    if (!silent && changes.length > 0) {
      this.pending = true
      this.pendingOptions = options
      changes.forEach((key) => {
        this.emit('change:*', {
          key,
          options,
          store: this,
          current: current[key],
          previous: previous[key],
        })
      })
    }

    if (changing) {
      return this
    }

    if (!silent) {
      // Changes can be recursively nested within `"change"` events.
      while (this.pending) {
        this.pending = false
        this.emit('changed', {
          current,
          previous,
          store: this,
          options: this.pendingOptions!,
        })
      }
    }

    this.pending = false
    this.changing = false
    this.pendingOptions = null

    return this
  }

  get(): D
  get<K extends keyof D>(key: K): D[K]
  get<K extends keyof D>(key: K, defaultValue: D[K]): NonUndefined<D[K]>
  get<T>(key: string): T
  get<T>(key: string, defaultValue: T): T
  get<K extends keyof D>(key?: K, defaultValue?: D[K]): D | D[K] | undefined {
    if (key == null) {
      return this.data
    }

    const ret = this.data[key]
    return ret == null ? defaultValue : ret
  }

  getPrevious<T>(key: keyof D) {
    if (this.previous) {
      const ret = this.previous[key]
      return ret == null ? undefined : (ret as any as T)
    }

    return undefined
  }

  set<K extends keyof D>(
    key: K,
    value: D[K] | null | undefined | void,
    options?: StoreSetOptions,
  ): this
  set(key: string, value: any, options?: StoreSetOptions): this
  set(data: D, options?: StoreSetOptions): this
  set<K extends keyof D>(
    key: K | Partial<D>,
    value?: D[K] | null | undefined | void | StoreSetOptions,
    options?: StoreSetOptions,
  ): this {
    if (key != null) {
      if (typeof key === 'object') {
        this.mutate(key, value as StoreSetOptions)
      } else {
        this.mutate({ [key]: value } as Partial<D>, options)
      }
    }

    return this
  }

  remove<K extends keyof D>(key: K | K[], options?: StoreSetOptions): this
  remove(options?: StoreSetOptions): this
  remove<K extends keyof D>(
    key: K | K[] | StoreSetOptions,
    options?: StoreSetOptions,
  ) {
    const empty = undefined
    const subset: Partial<D> = {}
    let opts: StoreSetOptions | undefined

    if (typeof key === 'string') {
      subset[key] = empty
      opts = options
    } else if (Array.isArray(key)) {
      key.forEach((k) => (subset[k] = empty))
      opts = options
    } else {
      // eslint-disable-next-line
      for (const key in this.data) {
        subset[key] = empty
      }
      opts = key as StoreSetOptions
    }

    this.mutate(subset, { ...opts, unset: true })
    return this
  }

  getByPath<T>(path: string | string[]) {
    return ObjectExt.getByPath(this.data, path, '/') as T
  }

  setByPath<K extends keyof D>(
    path: string | string[],
    value: any,
    options: StoreSetByPathOptions = {},
  ) {
    const delim = '/'
    const pathArray = Array.isArray(path) ? [...path] : path.split(delim)
    const pathString = Array.isArray(path) ? path.join(delim) : path

    const property = pathArray[0] as K
    const pathArrayLength = pathArray.length

    options.propertyPath = pathString
    options.propertyValue = value
    options.propertyPathArray = pathArray

    if (pathArrayLength === 1) {
      this.set(property, value, options)
    } else {
      const update: KeyValue = {}
      let diver = update
      let nextKey = property as string

      // Initialize the nested object. Subobjects are either arrays or objects.
      // An empty array is created if the sub-key is an integer. Otherwise, an
      // empty object is created.
      for (let i = 1; i < pathArrayLength; i += 1) {
        const key = pathArray[i]
        const isArrayIndex = Number.isFinite(Number(key))
        diver = diver[nextKey] = isArrayIndex ? [] : {}
        nextKey = key
      }

      // Fills update with the `value` on `path`.
      ObjectExt.setByPath(update, pathArray, value, delim)

      const data = ObjectExt.cloneDeep(this.data)

      // If rewrite mode enabled, we replace value referenced by path with the
      // new one (we don't merge).
      if (options.rewrite) {
        ObjectExt.unsetByPath(data, path, delim)
      }

      const merged = ObjectExt.merge(data, update)
      this.set(property, merged[property], options)
    }

    return this
  }

  removeByPath<K extends keyof D>(
    path: string | string[],
    options?: StoreSetOptions,
  ) {
    const keys = Array.isArray(path) ? path : path.split('/')
    const key = keys[0] as K
    if (keys.length === 1) {
      this.remove(key, options)
    } else {
      const paths = keys.slice(1)
      const prop = ObjectExt.cloneDeep(this.get(key))
      if (prop) {
        ObjectExt.unsetByPath(prop, paths)
      }

      this.set(key, prop as D[K], options)
    }

    return this
  }

  hasChanged(): boolean
  hasChanged<K extends keyof D>(key: K | null): boolean
  hasChanged(key: string | null): boolean
  hasChanged<K extends keyof D>(key?: K | null) {
    if (key == null) {
      return Object.keys(this.changed).length > 0
    }

    return key in this.changed
  }

  /**
   * Returns an object containing all the data that have changed,
   * or `null` if there are no changes. Useful for determining what
   * parts of a view need to be updated.
   */
  getChanges(diff?: Partial<D>) {
    if (diff == null) {
      return this.hasChanged() ? ObjectExt.cloneDeep(this.changed) : null
    }

    const old = this.changing ? this.previous : this.data
    const changed: Partial<D> = {}
    let hasChanged
    // eslint-disable-next-line
    for (const key in diff) {
      const val = diff[key]
      if (!ObjectExt.isEqual(old[key], val)) {
        changed[key] = val
        hasChanged = true
      }
    }
    return hasChanged ? ObjectExt.cloneDeep(changed) : null
  }

  /**
   * Returns a copy of the store's `data` object.
   */
  toJSON() {
    return ObjectExt.cloneDeep(this.data)
  }

  clone<T extends typeof Store>() {
    const constructor = this.constructor as any
    return new constructor(this.data) as T
  }

  @disposable()
  dispose() {
    this.off()
    this.data = {} as D
    this.previous = {} as D
    this.changed = {}
    this.pending = false
    this.changing = false
    this.pendingOptions = null
    this.trigger('disposed', { store: this })
  }
}
