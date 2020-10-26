import { Application, Context } from 'probot'
import { App } from '@octokit/app'
import moment from 'moment'
import sodium from 'tweetsodium'
import isBase64 from 'is-base64'

export namespace AppToken {
  async function getInstallationAccessToken(installationId: number) {
    const id = parseInt(process.env.APP_ID as string, 10)
    const privateKeyInput = process.env.PRIVATE_KEY as string
    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
      : privateKeyInput
    const app = new App({ id, privateKey })

    return app.getInstallationAccessToken({ installationId })
  }

  async function createSecret(context: Context, value: string) {
    const {
      data: { key_id, key },
    } = await context.github.request(
      'GET /repos/:owner/:repo/actions/secrets/public-key',
      context.repo(),
    )

    // Convert the value and key to Uint8Array's
    const valBytes = Buffer.from(value)
    const keyBytes = Buffer.from(key, 'base64')
    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(valBytes, keyBytes)
    return {
      key_id,
      // Base64 the encrypted secret
      encrypted_value: Buffer.from(encryptedBytes).toString('base64'),
    }
  }

  async function hasSecret(context: Context, name: string) {
    try {
      const { data } = await context.github.request(
        'GET /repos/:owner/:repo/actions/secrets/:secret_name',
        context.repo({ secret_name: name }),
      )
      if (data.name === name) {
        return moment().diff(data.updated_at, 'days') < 7
      }
      return false
    } catch (error) {
      return false
    }
  }

  export function start(app: Application) {
    app.on('*', async (context: Context) => {
      const secretName = 'BOT_TOKEN'
      const exist = await hasSecret(context, secretName)
      if (exist) {
        return
      }

      const {
        data: { id: installationId },
      } = await context.github.apps.getRepoInstallation(context.repo())
      const token = await getInstallationAccessToken(installationId)
      const secretValue = await createSecret(context, token)

      await context.github.request(
        'PUT /repos/:owner/:repo/actions/secrets/:secret_name',
        context.repo({
          secret_name: secretName,
          data: secretValue,
        }),
      )
    })
  }
}
