import { Context } from 'probot'
import { Util } from '../util'

export namespace Config {
  export interface Definition {
    addReviewers: boolean
    addAssignees: boolean
    reviewers: string[]
    assignees: string[]
    numberOfAssignees: number
    numberOfReviewers: number
    skipKeywords: string[]
    useReviewGroups: boolean
    useAssigneeGroups: boolean
    reviewGroups: { [key: string]: string[] }
    assigneeGroups: { [key: string]: string[] }
  }

  export const defaults: { autoAssign: Definition } = {
    autoAssign: {
      addReviewers: true,
      addAssignees: true,
      reviewers: [],
      assignees: [],
      numberOfAssignees: 0,
      numberOfReviewers: 0,
      skipKeywords: [],
      useReviewGroups: false,
      useAssigneeGroups: false,
      reviewGroups: {},
      assigneeGroups: {},
    },
  }

  export async function get(context: Context) {
    return Util.getConfig(context, defaults).then(
      (ret) => ret.autoAssign || defaults.autoAssign,
    )
  }
}
