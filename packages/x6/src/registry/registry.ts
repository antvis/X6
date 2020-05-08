import { KeyValue } from '../types'
import { StringExt } from '../util'

export class Registry<
  Entity,
  Presets = KeyValue<Entity>,
  OptionalType = never
> {
  protected readonly registry: KeyValue<Entity>
  protected readonly options: Registry.Options<Entity | OptionalType>

  constructor(options: Registry.Options<Entity | OptionalType>) {
    this.registry = {}
    this.options = { ...options }
  }

  get names() {
    return Object.keys(this.registry)
  }

  register(
    entities: { [name: string]: Entity | OptionalType },
    force?: boolean,
  ): void
  register<K extends keyof Presets>(
    name: K,
    entity: Presets[K],
    force?: boolean,
  ): Entity
  register(name: string, entity: Entity | OptionalType, force?: boolean): Entity
  register(
    name: string | { [name: string]: Entity | OptionalType },
    options: any,
    force: boolean = false,
  ) {
    if (typeof name === 'object') {
      Object.keys(name).forEach((key) => {
        this.register(key, name[key], options)
      })
      return
    }

    if (this.exist(name) && !force && !Private.isApplyingHMR()) {
      this.onDuplicated(name)
    }

    const entity = this.options.process
      ? this.options.process.call(this, name, options)
      : options
    this.registry[name] = entity

    return entity
  }

  unregister<K extends keyof Presets>(name: K): Entity | null
  unregister(name: string): Entity | null
  unregister(name: string): Entity | null {
    const entity = name ? this.registry[name] : null
    delete this.registry[name]
    return entity
  }

  get<K extends keyof Presets>(name: K): Entity | null
  get(name: string): Entity | null
  get(name: string): Entity | null {
    return name ? this.registry[name] : null
  }

  exist<K extends keyof Presets>(name: K): boolean
  exist(name: string): boolean
  exist(name: string): boolean {
    return name ? this.registry[name] != null : false
  }

  onDuplicated(name: string) {
    try {
      // race
      if (this.options.onConflict) {
        this.options.onConflict.call(this, name)
      }
      throw new Error(
        `${StringExt.upperFirst(
          this.options.type,
        )} with name '${name}' already registered.`,
      )
    } catch (err) {
      throw err
    }
  }

  onNotFound(name: string, prefix?: string): never {
    throw new Error(this.getSpellingSuggestion(name, prefix))
  }

  getSpellingSuggestion(name: string, prefix?: string) {
    const suggestion = this.getSpellingSuggestionForName(name)
    const prefixed = prefix
      ? `${prefix} ${StringExt.lowerFirst(this.options.type)}`
      : this.options.type

    return (
      // tslint:disable-next-line
      `${StringExt.upperFirst(prefixed)} with name '${name}' does not exist.` +
      (suggestion ? ` Did you mean '${suggestion}'?` : '')
    )
  }

  protected getSpellingSuggestionForName(name: string) {
    return StringExt.getSpellingSuggestion(
      name,
      Object.keys(this.registry),
      (candidate) => candidate,
    )
  }
}

export namespace Registry {
  export interface Options<Entity> {
    type: string
    process?: <T, Context extends Registry<any>>(
      this: Context,
      name: string,
      entity: Entity,
    ) => T
    onConflict?: <Context extends Registry<any>>(
      this: Context,
      name: string,
    ) => void
  }
}

export namespace Registry {
  export function create<
    Entity,
    Presets = KeyValue<Entity>,
    OptionalType = never
  >(options: Options<Entity | OptionalType>) {
    return new Registry<Entity, Presets, OptionalType>(options)
  }
}

namespace Private {
  function getHMRStatus() {
    const mod = module as any
    if (mod != null && mod.hot != null && mod.hot.status != null) {
      return mod.hot.status()
    }
    return 'unkonwn'
  }

  export function isApplyingHMR() {
    return getHMRStatus() === 'apply'
  }
}
