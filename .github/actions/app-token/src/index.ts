import * as core from '@actions/core'
import * as github from '@actions/github'
import { App } from '@octokit/app'
import isBase64 from 'is-base64'

const run = async () => {
  try {
    const id = Number(core.getInput('app_id', { required: true }))
    const privateKeyInput = core.getInput('private_key', { required: true })
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
      : privateKeyInput
    const app = new App({ id, privateKey })
    const jwt = app.getSignedJsonWebToken()
    const octokit = github.getOctokit(jwt)
    const {
      data: { id: installationId },
    } = await octokit.apps.getRepoInstallation(github.context.repo)
    const token = await app.getInstallationAccessToken({
      installationId,
    })

    core.setSecret(token)
    core.setOutput('token', token)
    core.info('Token generated successfully!')
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

void run()
