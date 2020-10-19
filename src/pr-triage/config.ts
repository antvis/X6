export namespace Config {
  export const defaults = {
    wipRegex: /^\s*(\[WIP\]\s*|WIP:\s*|WIP\s+)+\s*/i,
    labels: {
      draft: {
        name: 'PR: draft',
        color: '6a737d',
      },
      unreviewed: {
        name: 'PR: unreviewed',
        color: 'fbca04',
      },
      approved: {
        name: 'PR: reviewed-approved',
        color: '0e8a16',
      },
      partiallyApproved: {
        name: 'PR: partially-approved',
        color: '7E9C82',
      },
      changesRequested: {
        name: 'PR: reviewed-changes-requested',
        color: 'c2e0c6',
      },
      merged: {
        name: 'PR: merged',
        color: '6f42c1',
      },
    },
  }

  export type Label = keyof typeof defaults.labels

  export type State = Label | undefined | 'wip'
}
