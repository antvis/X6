import SemanticRelease from 'semantic-release'

export interface Options {
  debug?: boolean
  firstParent?: boolean
}

export interface Context {
  cwd: string
  env: { [name: string]: string }
  stdout: NodeJS.WriteStream
  stderr: NodeJS.WriteStream
  options: SemanticRelease.Options
}

export interface Package {
  path: string
  dir: string
  name: string
  private: boolean
  hasCommit?: boolean
  manifest: { [name: string]: any }
  deps: string[]
  plugins1: any
  plugins2: any
  logger: Logger
  localDeps: Package[]
  options: SemanticRelease.Options
  result?: SemanticRelease.Result
  lastRelease?: SemanticRelease.LastRelease
  nextRelease?: SemanticRelease.NextRelease
  nextType?: string
  ready?: boolean
  prepared?: boolean
  analyzed?: boolean
  published?: boolean
  depsUpdated?: boolean
}

export interface Logger {
  log: () => void
  error: () => void
}

export interface PluginOptions {
  [key: string]: string
}
