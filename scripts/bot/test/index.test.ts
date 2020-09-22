// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock

import fs from 'fs'
import path from 'path'
import nock from 'nock'
import { Probot, ProbotOctokit } from 'probot'
import app from '../src/app'

// import payload from './fixtures/issues.opened.json'
// const issueCreatedBody = { body: 'Thanks for opening this issue!' }

const privateKey = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-cert.pem'),
  'utf-8',
)

describe('bot', () => {
  let probot: any

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({
      privateKey,
      id: 123,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    })
    // Load our app into probot
    probot.load(app)
  })

  it('ping', async (done) => {
    const mock = nock('https://api.github.com')
      // Test that we correctly return a test token
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write',
        },
      })

    // Test that a comment is posted
    // .post('/repos/hiimbex/testing-things/issues/1/comments', (body: any) => {
    //   expect(body).toEqual(issueCreatedBody)
    //   done()
    //   return true
    // })
    // .reply(200)

    // Receive a webhook event
    // await probot.receive({ payload, name: 'issues' })

    expect(mock.pendingMocks().length).toEqual(1)
    done()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
