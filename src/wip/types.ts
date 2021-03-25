export type Location = 'title' | 'label' | 'commit'

export interface Section {
  terms: string[]
  locations: Location[]
}

export interface State {
  wip: boolean
  configs?: Section[]
  manual?: boolean
  override?: boolean
  location?: Location
  text?: string
  match?: string
}
