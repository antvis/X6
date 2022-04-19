export namespace Options {
  export interface Manual {
    connecting?: Partial<Connecting>
    translating?: Partial<Translating>
    highlighting?: Partial<Highlighting>
    embeddinga?: boolean | Partial<Embedding>
  }

  export interface Definition {
    embedding: Embedding
    connecting: Connecting
    translating: Translating
    highlighting: Highlighting
  }
}

export namespace Options {
  export interface Connecting {}
  export interface Translating {}
  export interface Embedding {}
  export interface Highlighting {}
}

export namespace Options {
  export function get(options: Partial<Manual>) {
    return options as Options.Definition
  }
}

export namespace Options {
  export const defaults: Partial<Definition> = {}
}
