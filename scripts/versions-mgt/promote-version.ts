import fs from 'node:fs/promises'

import { confirm } from '@inquirer/prompts'
import { diff, satisfies } from 'semver'

import versions from '../../versions.json'
import versionsMap from '../../versionsMap.json'
import { updateReleaseNoteLinks } from './lib'

type VersionsMap = { [k in keyof typeof versionsMap]: typeof versionsMap[k] | null }

const main = async () => {
  if (!versionsMap.next) {
    console.error('No Next version specified in versionsMao.json')
    process.exit(1)
  }

  const isPrevCurrentLts = versionsMap.lts.some((range) => satisfies(versionsMap.current, range))
  const isPrevNextPatch = diff(versionsMap.current, versionsMap.next) === 'patch'

  let proceedMsg = `This routine will promote documentation version ${versionsMap.next} from Next to Current (${versionsMap.current} -> ${versionsMap.next}), while unsetting the Next version.\n\n`

  if (!isPrevCurrentLts) {
    proceedMsg = proceedMsg + `Since Current version ${versionsMap.current} is not an LTS, it WILL BE DELETED.`
  } else if (isPrevCurrentLts && isPrevNextPatch) {
    proceedMsg = proceedMsg + `Since Next version ${versionsMap.next} is a higher LTS version then Current version ${versionsMap.current}, Current version ${versionsMap.current} WILL BE DELETED.`
  } else {
    proceedMsg = proceedMsg + `Since Current version ${versionsMap.current} is an LTS, it WILL NOT BE DELETED.`
  }

  proceedMsg = proceedMsg + `\n\nContinue?`

  const proceed = await confirm({ message: proceedMsg })

  if (proceed === false) { process.exit(1) }

  // Edit `versionsMap.json` file
  let newVersionsMap: VersionsMap = { current: versionsMap.next, next: null, lts: versionsMap.lts }
  await fs.writeFile('versionsMap.json', `${JSON.stringify(newVersionsMap, null, 2)}\n`)

  // If needed, delete previous Current version
  const shouldDeleteCurrent = !isPrevCurrentLts || isPrevNextPatch
  if (!shouldDeleteCurrent) { return }

  // Delete version doc directory
  try {
    await fs.rm(`versioned_docs/version-${versionsMap.current}`, { recursive: true })
  } catch (err) {
    console.error(`Error deleting 'versioned_docs/version-${versionsMap.current}' directory:`, err)
    process.exit(1)
  }

  // Rename version sidebar file
  try {
    await fs.rm(`versioned_sidebars/version-${versionsMap.current}-sidebars.json`)
  } catch (err) {
    console.error(`Error deleting 'versioned_sidebars/version-${versionsMap.current}-sidebars.json' file:`, err)
    process.exit(1)
  }

  // Edit 'versions.json' file
  const oldCurrentVersionIdx = versions.indexOf(versionsMap.current)
  const newVersions = versions.toSpliced(oldCurrentVersionIdx, 1)
  fs.writeFile('versions.json', `${JSON.stringify(newVersions, null, 2)}\n`)

  // Edit links
  await updateReleaseNoteLinks(versionsMap.next, `/docs/${versionsMap.next}`, '/docs')
}

export default main
