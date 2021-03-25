import { Section } from './types'

export namespace Doc {
  export const getDefaultConfiguration = () => `

\`\`\`yml
terms:
  - wip
  - work in progress
  - 🚧
locations:
  - title
  - label
\`\`\`

`

  export const getREADME = () => `

By default, WIP is setting a pull request status to pending if it finds one of the following terms in the pull request title or label.

- wip
- work in progress
- 🚧

We can custom the configurations by creating a \`.github/apps/wip.yml\` file in your repository. Two options can be configured in the configuration file.

- **locations**: any of \`title\` (pull request title), \`label\`(lable name) and \`commit\` (commit subject: 1st line of the pull request’s commit messages). Default: \`title\` and \`label\`
- **terms**: list of strings to look for in the defined locations. All terms are case-insensitive. Default: "wip", "work in progress" and "🚧"


Example:

\`\`\`yml
locations:
  - title
  - label
  - commit
terms:
  - do not merge
  - ⛔
\`\`\`

The above configuration makes WIP look for \`do not merge\` and \`⛔\` in the pull request title, all assigned label names and all commit subjects.

You can also configure different terms for different locations:

\`\`\`yaml
- terms: ⛔
  locations:
    - title
    - label
- terms:
    - fixup!
    - squash!
  locations: commit
\`\`\`

The above configuration looks first for \`⛔\` in the pull request title and assigned label names. After that it looks for \`fixup!\` and \`squash!\` in the commit subjects.

**A Note About Term Matching:** Terms which contain only non-word characters as defined by JS RegExp \`[^a-za-z0-9_]\` are matched regardless of word boundaries. Any other terms (which may contain a mix of word and non-word characters will only match when surrounded by start/end OR non-word characters.

`

  export function getManualConfiguration(configs: Section[]) {
    const line = (c: Section) =>
      `| ${c.terms.join(', ')} | ${c.locations.join(', ')} |`

    return `
| terms  | locations |
|--------|-----------|
${configs.map((config) => line(config)).join('\n')}
`
  }
}
