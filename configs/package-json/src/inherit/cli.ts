import yargsParser from 'yargs-parser'
import { update } from './update'
import { check } from './check'

const args = yargsParser(process.argv.slice(2))

const command = args._[0]

switch (command) {
  case 'update':
    update(process.cwd())
    break

  case 'check':
    check(process.cwd(), args)
    break

  default:
    console.log(`
Usage: package-inherit [command] [--recovery]

This utility will update package.json in a monorepo to inherit from another
package.json template. Currently, support the following sections to merge
into the package.json

  - scripts
  - dependencies
  - devDependencies
  - peerDependencies

Commands:

  update      updates the package.json for all packages in a monorepo to
              match inheritance.
  check       checks all the package.json inheritance are consistent.

Options:

  --recovery  custom recovery command to show developers when the check has failed
`)
    break
}
