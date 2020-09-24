const core = require('@actions/core')
const github = require('@actions/github')
const { App } = require('@octokit/app')
const isBase64 = require('is-base64')

async function run() {
  try {
    const id = github.actions.getSecret('APP_ID')
    const privateKeyInput = github.actions.getSecret('PRIVATE_KEY')
    console.log(id, privateKeyInput)
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
      : privateKeyInput
    const app = new App({ id, privateKey })
    const jwt = app.getSignedJsonWebToken()
    const octokit = github.getOctokit(jwt)

    const {
      data: { id: installationId },
    } = await octokit.apps.getRepoInstallation(github.context.repo)
    const token = await app.getInstallationAccessToken({ installationId })
    core.setSecret(token)
    core.setOutput('token', token)
    console.log(token, github.actions.getSecret('GITHUB_TOKEN'))
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

run()
