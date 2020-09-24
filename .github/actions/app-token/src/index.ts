import {
  info,
  error as logError,
  getInput,
  setFailed,
  setOutput,
  setSecret,
} from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { App } from '@octokit/app'
import isBase64 from 'is-base64'

const run = async () => {
  try {
    const id = Number(getInput('app_id', { required: true }))
    const privateKeyInput = getInput('private_key', { required: true })
    console.log(id, privateKeyInput)
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
      : privateKeyInput
    const app = new App({ id, privateKey })
    const jwt = app.getSignedJsonWebToken()
    const octokit = getOctokit(jwt)
    const {
      data: { id: installationId },
    } = await octokit.apps.getRepoInstallation(context.repo)
    const token = await app.getInstallationAccessToken({
      installationId,
    })
    setSecret(token)
    setOutput('token', token)
    console.log(token)
    info('Token generated successfully!')
  } catch (error) {
    logError(error)
    setFailed(error.message)
  }
}

void run()
