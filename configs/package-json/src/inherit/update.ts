import fs from 'fs'
import os from 'os'
import detectNewline from 'detect-newline'
import { collect } from './collect'

export function update(cwd: string) {
  const updatedInfo = collect(cwd)
  if (updatedInfo.modifiedPackages.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pkg of updatedInfo.modifiedPackages) {
      const info = updatedInfo.allPackages[pkg]
      const { packageJsonPath, ...output } = info

      const newLine =
        detectNewline(fs.readFileSync(info.packageJsonPath, 'utf-8')) || os.EOL

      fs.writeFileSync(
        info.packageJsonPath,
        JSON.stringify(output, null, 2).replace(/\n/g, newLine) + newLine,
      )
    }
    console.log(`Updated these packages: `)
    console.log(updatedInfo.modifiedPackages.sort().join('\n'))
  } else {
    console.log('Nothing needs to be updated.')
  }
}
