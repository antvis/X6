import * as core from '@actions/core'
import { release } from './runner'

const run = async () => {
  try {
    release()
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

void run()
