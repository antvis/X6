import { collect } from './collect'

export function check(cwd: string, args: any) {
  const updatedInfo = collect(cwd)
  if (updatedInfo.modifiedPackages.length > 0) {
    const recoveryCommand = args.recovery || 'package-inherit update'
    console.error(
      `
The inheritance of package.json is in an inconsistent state.
These packages are inconsistent:

${updatedInfo.modifiedPackages.sort().join('\n')}

Please run the following command:
> ${recoveryCommand}
`,
    )
  } else {
    console.log('Nothing needs to be updated.')
  }
}
