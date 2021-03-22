import fs from 'fs'
import path from 'path'
import parsePackageName from 'parse-package-name'
import { PackageInfos } from 'workspace-tools/lib/types/PackageInfo'
import { getPackageInfos } from 'workspace-tools/lib/getPackageInfos'

type KeyValue = { [key: string]: string }

export function collect(cwd: string) {
  const allPackages = getPackageInfos(cwd)
  const modifiedPackages: string[] = []
  const sections = [
    'devDependencies',
    'peerDependencies',
    'dependencies',
    'scripts',
  ]

  // eslint-disable-next-line no-restricted-syntax
  for (const [pkg, pkgInfo] of Object.entries(allPackages)) {
    // workspace-tools typings are not comprehensive about what is possible,
    // so we force cast it
    const inherits = pkgInfo.inherits as string[]
    if (inherits) {
      const merged: { [section: string]: KeyValue } = {}

      // eslint-disable-next-line no-restricted-syntax
      for (const inherit of inherits) {
        const file = resolveInRepo(pkg, inherit, allPackages)
        if (!file) {
          throw new Error(`${file} does not exist`)
        }
        const inheritInfo = JSON.parse(fs.readFileSync(file, 'utf-8'))

        // Merge inherit infos for given package together before checking
        // shouldUpdate. This will allows inherit check behavior to be
        // symmetric with update behavior, which updates packages defined
        // in multiple inherit files to their last occurrence.
        // eslint-disable-next-line no-restricted-syntax
        for (const section of sections) {
          merged[section] = {
            ...merged[section],
            ...inheritInfo[section],
          }
        }
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const section of sections) {
        const prev = pkgInfo[section] as KeyValue
        const next = merged[section]

        if (shouldUpdate(prev, next)) {
          const combined = { ...prev, ...next }
          const sorted: KeyValue = {}
          Object.keys(combined)
            .sort()
            .forEach(function (name) {
              sorted[name] = combined[name]
            })

          pkgInfo[section] = sorted
          modifiedPackages.push(pkg)
        }
      }
    }
  }

  return { allPackages, modifiedPackages }
}

function resolveInRepo(
  pkg: string,
  inherit: string,
  allPackages: PackageInfos,
) {
  const parsedInfo = parsePackageName(inherit)

  if (parsedInfo.name === '.') {
    parsedInfo.name = pkg
  }

  const info = allPackages[parsedInfo.name]
  if (info) {
    return path.join(path.dirname(info.packageJsonPath), parsedInfo.path)
  }
}

function shouldUpdate(mine: KeyValue, theirs?: KeyValue) {
  if (!theirs) {
    return false
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(theirs)) {
    if (mine[key] !== value) {
      return true
    }
  }

  return false
}
