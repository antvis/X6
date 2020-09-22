import { Context } from 'probot'
import { Util } from '../util'

export namespace Config {
  interface Actions {
    close?: boolean
    open?: boolean
    lock?: boolean
    unlock?: boolean
    lockReason?: string
    comment?: string | string[]
  }

  interface Definition {
    common?: { [label: string]: Actions }
    issues?: { [label: string]: Actions }
    pulls?: { [label: string]: Actions }
    only?: 'issues' | 'pulls'
  }

  const needsMoreInfoComment = `
Hello \${ author }

为了能够进行高效沟通，我们对 issue 有一定的格式要求，你的 issue 因为无复现步骤或可复现仓库而被自动关闭，提供之后会被 REOPEN。

In order to communicate effectively, we have a certain format requirement for the issue, your issue is automatically closed because there is no recurring step or reproducible warehouse, and will be REOPEN after the offer.

  `

  export const defaults: { labelActions: Definition } = {
    labelActions: {
      common: {
        heated: {
          comment:
            `The thread has been temporarily locked.\n` + // tslint:disable-line
            `Please follow our community guidelines.`,
          lock: true,
          lockReason: 'too heated',
        },
        '-heated': {
          unlock: true,
        },
        'needs-more-info': {
          comment: needsMoreInfoComment.trim(),
          close: true,
        },
        '-needs-more-info': {
          open: true,
        },
      },
      issues: {
        feature: {
          close: true,
          comment:
            ':wave: ${ author }, please use our idea board to request new features.',
        },
        '-wontfix': {
          open: true,
        },
      },
      pulls: {},
    },
  }

  export async function get(context: Context) {
    return Util.getConfig(context, defaults).then(
      (ret) => ret.labelActions || defaults.labelActions,
    )
  }

  export function getActions(
    config: Definition,
    type: 'issues' | 'pulls',
    label: string,
  ): Actions {
    const section = config[type]
    if (section && section[label]) {
      return section[label]
    }

    const common = config.common
    if (common) {
      return common[label] || {}
    }

    return {}
  }
}
