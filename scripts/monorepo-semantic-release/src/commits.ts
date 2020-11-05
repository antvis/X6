import { relative } from 'path'
import execa from 'execa'
import getStream from 'get-stream'
import gitLogParser from 'git-log-parser'
import getDebugger from 'debug'
import { check, ValueError } from './blork'
import { Util } from './util'

export namespace Commits {
  const debug = getDebugger('msr:commitsFilter')

  export interface Commit {
    commit: {
      long: string
      short: string
    }
    tree: {
      long: string
      short: string
    }
    author: {
      name: string
      email: string
      date: Date
    }
    committer: {
      name: string
      email: string
      date: Date
    }
    subject: string
    body: string
    hash: string
    message: string
    gitTags: string
    committerDate: Date
  }

  export async function filter(
    cwd: string,
    dir: string,
    lastHead?: string,
    firstParentBranch?: string,
  ) {
    check(cwd, 'cwd: directory')
    check(dir, 'dir: path')

    cwd = Util.cleanPath(cwd) // tslint:disable-line
    dir = Util.cleanPath(dir, cwd) // tslint:disable-line

    check(dir, 'dir: directory')
    check(lastHead, 'lastHead: alphanumeric{40}?')

    // target must be inside and different than cwd.
    if (dir.indexOf(cwd) !== 0) {
      throw new ValueError('dir: Must be inside cwd', dir)
    }

    if (dir === cwd) {
      throw new ValueError('dir: Must not be equal to cwd', dir)
    }

    // Get top-level Git directory as it might be higher up the tree than cwd.
    const root = (await execa('git', ['rev-parse', '--show-toplevel'], { cwd }))
      .stdout

    // Add correct fields to gitLogParser.
    Object.assign(gitLogParser.fields, {
      hash: 'H',
      message: 'B',
      gitTags: 'd',
      committerDate: { key: 'ci', type: Date },
    })

    // Use git-log-parser to get the commits.
    const relpath = relative(root, dir)
    const firstParentBranchFilter = firstParentBranch
      ? ['--first-parent', firstParentBranch]
      : []
    const gitLogFilterQuery = [
      ...firstParentBranchFilter,
      lastHead ? `${lastHead}..HEAD` : 'HEAD',
      '--',
      relpath,
    ]

    const stream = gitLogParser.parse(
      { _: gitLogFilterQuery },
      { cwd, env: process.env },
    )
    const commits = await getStream.array<Commit>(stream)

    // Trim message and tags.
    commits.forEach((commit) => {
      commit.message = commit.message.trim()
      commit.gitTags = commit.gitTags.trim()
    })

    debug('git log filter query: %o', gitLogFilterQuery)
    debug('filtered commits: %O', commits)

    return commits
  }
}
