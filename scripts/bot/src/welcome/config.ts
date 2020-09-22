import { Context } from 'probot'
import { Util } from '../util'

export namespace Config {
  export interface Definition {
    firstIssueComment: string | string[]
    firstPRComment: string | string[]
    firstPRMergeComment: string | string[]
  }

  export const defaults: { welcome: Definition } = {
    welcome: {
      firstIssueComment: `Thanks for opening your first issue here! Be sure to follow the issue template!`,
      firstPRComment: `Thanks for opening this pull request! Please check out our contributing guidelines.`,
      firstPRMergeComment: `Congrats on merging your first pull request! We here at behaviorbot are proud of you!`,
    },
  }

  export async function get(context: Context) {
    return Util.getConfig(context, defaults).then(
      (ret) => ret.welcome || defaults.welcome,
    )
  }
}
