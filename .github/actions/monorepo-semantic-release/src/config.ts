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

  /**
   * Get the release configuration options for a given directory.
   * Unfortunately we've had to copy this over from semantic-release, creating unnecessary duplication.
   */
  export async function get(cwd: string): Promise<SemanticRelease.Options> {
    const config = await cosmiconfig(CONFIG_NAME, {
      searchPlaces: CONFIG_FILES,
    }).search(cwd)

    // Return the found config or empty object.
    // istanbul ignore next (not important).
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
      ":tada: This <%= issue.pull_request ? 'PR is included' : 'issue has been resolved' %> in next release :tada:" +
      '<% if(typeof releases !== "undefined" && Array.isArray(releases) && releases.length > 0) { %>' +
      '<% var releaseInfos = releases.filter(function(release) { return !!release.name && !release.private }) %>' +
      '<% if(releaseInfos.length) { %>' +
      '<% var groups = {} %>' +
      '<% releaseInfos.forEach(function(release) { %>' +
      '<% if (groups[release.gitTag] == null) { groups[release.gitTag] = [] } %>' +
      '<% groups[release.gitTag].push(release) %>' +
      '<% }) %>' +
      '\n\nThe release is available on :package::rocket:' +
      '<% Object.keys(groups).forEach(function(tag) { %>' +
      `\n- <%= tag%>` +
      '<% var items = groups[tag] %>' +
      '<% if(items.length === 1) { %>' +
      '<% if(items[0].url) { %>' +
      ': [<%= items[0].name %>](<%= items[0].url %>)' +
      '<% } else { %>' +
      ': <%= items[0].name %>' +
      '<% } %>' +
      '<% } else { %>' +
      '<% items.forEach(function(item) { %>' +
      '\n  - ' +
      '<% if(item.url) { %>' +
      '[<%= item.name %>](<%= item.url %>)' +
      '<% } else { %>' +
      '<%= item.name %>' +
      '<% } %>' +
      '<% }) %>' +
      '<% } %>' +
      '<% }) %>' +
      '' +
      '<% } %>' +
      '<% } %>'
    )
  }

  export const defaults: SemanticRelease.Options = {
    repositoryUrl: 'https://github.com/antv/x6',
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
          assets: ['package.json', 'CHANGELOG.md'],
        },
      ],
    ],
  }
}
