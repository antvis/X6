import { sampleSize } from 'lodash'
import { Config } from './config'

export function hasSkipKeywords(
  title: string,
  skipKeywords: string[],
): boolean {
  for (const skipKeyword of skipKeywords) {
    if (title.toLowerCase().includes(skipKeyword.toLowerCase())) {
      return true
    }
  }

  return false
}

interface ChooseUsersResponse {
  teams: string[]
  users: string[]
}

function chooseUsers(
  candidates: string[],
  count: number,
  filterUser: string = '',
): ChooseUsersResponse {
  const { teams, users } = candidates.reduce(
    (acc: ChooseUsersResponse, reviewer: string): ChooseUsersResponse => {
      const separator = '/'
      const isTeam = reviewer.includes(separator)
      if (isTeam) {
        const team = reviewer.split(separator)[1]
        acc.teams = [...acc.teams, team]
      } else if (reviewer !== filterUser) {
        acc.users = [...acc.users, reviewer]
      }
      return acc
    },
    {
      teams: [],
      users: [],
    },
  )

  // all-assign
  if (count === 0) {
    return {
      teams,
      users,
    }
  }

  return {
    teams,
    users: sampleSize(users, count),
  }
}

function chooseUsersFromGroups(
  owner: string,
  groups: { [key: string]: string[] } | undefined,
  desiredNumber: number,
): string[] {
  let users: string[] = []
  for (const group in groups) {
    users = users.concat(chooseUsers(groups[group], desiredNumber, owner).users)
  }
  return users
}

export function chooseReviewers(
  owner: string,
  config: Config.Definition,
): {
  reviewers: string[]
  team_reviewers: string[]
} {
  const { useReviewGroups, reviewGroups, numberOfReviewers, reviewers } = config
  const useGroups: boolean =
    useReviewGroups && Object.keys(reviewGroups).length > 0

  if (useGroups) {
    const chosenReviewers = chooseUsersFromGroups(
      owner,
      reviewGroups,
      numberOfReviewers,
    )

    return {
      reviewers: chosenReviewers,
      team_reviewers: [],
    }
  }

  const chosenReviewers = chooseUsers(reviewers, numberOfReviewers, owner)
  return {
    reviewers: chosenReviewers.users,
    team_reviewers: chosenReviewers.teams,
  }
}

export function chooseAssignees(
  owner: string,
  config: Config.Definition,
): string[] {
  const {
    useAssigneeGroups,
    assigneeGroups,
    addAssignees,
    numberOfAssignees,
    numberOfReviewers,
    assignees,
    reviewers,
  } = config
  let chosenAssignees: string[] = []

  const useGroups: boolean =
    useAssigneeGroups && Object.keys(assigneeGroups).length > 0

  if (typeof addAssignees === 'string') {
    if (addAssignees !== 'author') {
      throw new Error(
        "Error in configuration file to do with using addAssignees. Expected 'addAssignees' variable to be either boolean or 'author'",
      )
    }
    chosenAssignees = [owner]
  } else if (useGroups) {
    chosenAssignees = chooseUsersFromGroups(
      owner,
      assigneeGroups,
      numberOfAssignees || numberOfReviewers,
    )
  } else {
    const candidates = assignees ? assignees : reviewers
    chosenAssignees = chooseUsers(
      candidates,
      numberOfAssignees || numberOfReviewers,
      owner,
    ).users
  }

  return chosenAssignees
}
