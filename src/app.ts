import { Application } from 'probot'
import { AppToken } from './app-token'
import { PRTriage } from './pr-triage'

export = (app: Application) => {
  app.on('*', async (context) => {
    context.log(`event: ${context.name}`)
  })

  AppToken.start(app)
  PRTriage.start(app)
}
