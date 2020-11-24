import { cosmiconfig } from 'cosmiconfig'
import SemanticRelease from 'semantic-release'

export namespace Config {
  const CONFIG_NAME = 'release'
  const CONFIG_FILES = [
    'package.json',
    `.${CONFIG_NAME}rc`,
    `.${CONFIG_NAME}rc.json`,
    `.${CONFIG_NAME}rc.yaml`,
    `.${CONFIG_NAME}rc.yml`,
    `.${CONFIG_NAME}rc.js`,
    `${CONFIG_NAME}.config.js`,
  ]

  export async function get(cwd: string): Promise<SemanticRelease.Options> {
    const config = await cosmiconfig(CONFIG_NAME, {
      searchPlaces: CONFIG_FILES,
    }).search(cwd)

    return config ? config.config : {}
  }

  const releaseRules = [
    {
      type: 'build',
      release: 'patch',
    },
    {
      type: 'ci',
      release: 'patch',
    },
    {
      type: 'chore',
      release: 'patch',
    },
    {
      type: 'docs',
      release: 'patch',
    },
    {
      type: 'refactor',
      release: 'patch',
    },
    {
      type: 'style',
      release: 'patch',
    },
    {
      type: 'test',
      release: 'patch',
    },
  ]

  function getSuccessComment() {
    return (
      '' +
      '<% if(typeof releases !== "undefined" && Array.isArray(releases) && releases.length > 0) { %>' +
      '<% var releaseInfos = releases.filter(function(release) { return !!release.name && !release.private }) %>' +
      '<% if(releaseInfos.length) { %>' +
      '<% var groups = {} %>' +
      '<% releaseInfos.forEach(function(release) { %>' +
      '<% if (groups[release.gitTag] == null) { groups[release.gitTag] = [] } %>' +
      '<% groups[release.gitTag].push(release) %>' +
      '<% }) %>' +
      "🎉 This <%= issue.pull_request ? 'PR is included' : 'issue has been resolved' %> in the following release 🎉\n\n" +
      '<% var renderItem = function (item) { %>' +
      '<% if(item.url) { %>' +
      '<% return "[" + item.name + "](" + item.url + ")" %>' +
      '<% } else { %>' +
      '<% return item.name %>' +
      '<% } %>' +
      ' <% } %>' +
      '<% Object.keys(groups).forEach(function(tag) { %>' +
      `\n- <%= tag %>` +
      '<% var items = groups[tag] %>' +
      '<% if(items.length === 1) { %>' +
      ': <%= renderItem(items[0]) %>' +
      '<% } else { %>' +
      '<% items.forEach(function(item) { %>' +
      '\n  - <%= renderItem(item) %>' +
      '<% }) %>' +
      '<% } %>' +
      '<% }) %>' +
      '\n\nThanks for being a part of the AntV community! 💪💯' +
      '<% } %>' +
      '<% } %>'
    )
  }

  export const defaults: SemanticRelease.Options = {
    repositoryUrl: 'https://github.com/antvis/x6',
    plugins: [
      [
        '@semantic-release/commit-analyzer',
        {
          releaseRules,
        },
      ],
      '@semantic-release/release-notes-generator',
      '@semantic-release/changelog',
      '@semantic-release/npm',
      [
        '@semantic-release/github',
        {
          successComment: getSuccessComment(),
          addReleases: 'bottom',
        },
      ],
      [
        '@semantic-release/git',
        {
          assets: [
            'package.json',
            '**/version.ts',
            '**/README.md',
            'CHANGELOG.md',
          ],
          message:
            'chore(release): <%= nextRelease.gitTag %> [skip ci]\n\n<%= nextRelease.notes %>',
        },
      ],
    ],
  }
}
