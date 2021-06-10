import { KeyValue } from '../types'
import { StringExt, FunctionExt, Platform } from '../util'

export class Registry<
  Entity,
  Presets = KeyValue<Entity>,
  OptionalType = never,
> {
  public readonly data: KeyValue<Entity>
  public readonly options: Registry.Options<Entity | OptionalType>

  constructor(options: Registry.Options<Entity | OptionalType>) {
    this.options = { ...options }
    this.data = (this.options.data as KeyValue<Entity>) || {}
    this.register = this.register.bind(this)
    this.unregister = this.unregister.bind(this)
  }

  get names() {
    return Object.keys(this.data)
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
    force = false,
  ) {
    if (typeof name === 'object') {
      Object.keys(name).forEach((key) => {
        this.register(key, name[key], options)
      })
      return
    }

    if (this.exist(name) && !force && !Platform.isApplyingHMR()) {
      this.onDuplicated(name)
    }

    const process = this.options.process
    const entity = process
      ? FunctionExt.call(process, this as any, name, options)
      : options

    this.data[name] = entity

    return entity
  }

  unregister<K extends keyof Presets>(name: K): Entity | null
  unregister(name: string): Entity | null
  unregister(name: string): Entity | null {
    const entity = name ? this.data[name] : null
    delete this.data[name]
    return entity
  }

  get<K extends keyof Presets>(name: K): Entity | null
  get(name: string): Entity | null
  get(name: string): Entity | null {
    return name ? this.data[name] : null
  }

  exist<K extends keyof Presets>(name: K): boolean
  exist(name: string): boolean
  exist(name: string): boolean {
    return name ? this.data[name] != null : false
  }

  onDuplicated(name: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      // race
      if (this.options.onConflict) {
        FunctionExt.call(this.options.onConflict, this as any, name)
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
      // eslint-disable-next-line
      `${StringExt.upperFirst(prefixed)} with name '${name}' does not exist.${
        suggestion ? ` Did you mean '${suggestion}'?` : ''
      }`
    )
  }

  protected getSpellingSuggestionForName(name: string) {
    return StringExt.getSpellingSuggestion(
      name,
      Object.keys(this.data),
      (candidate) => candidate,
    )
  }
}

export namespace Registry {
  export interface Options<Entity> {
    type: string
    data?: KeyValue<Entity>
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
    OptionalType = never,
  >(options: Options<Entity | OptionalType>) {
    return new Registry<Entity, Presets, OptionalType>(options)
  }
}
