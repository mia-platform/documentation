import fs from 'node:fs/promises'

import { confirm } from '@inquirer/prompts'

import versions from '../../versions.json'
import versionsMap from '../../versionsMap.json'
import { isCurrentVersionLts, isNextVersionAPatchOfCurrent, updateReleaseNoteLinks, type VersionsMap } from './lib'

export const promoteNext = async () => {
  // Update `versionsMap.json`
  let newVersionsMap: VersionsMap = { current: versionsMap.next, next: null, lts: versionsMap.lts }
  await fs.writeFile('versionsMap.json', `${JSON.stringify(newVersionsMap, null, 2)}\n`)

  // If needed, delete previous Current version
  const shouldDeleteCurrent = !isCurrentVersionLts() || isNextVersionAPatchOfCurrent()
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

  // Update 'versions.json'
  const oldCurrentVersionIdx = versions.indexOf(versionsMap.current)
  const newVersions = versions.toSpliced(oldCurrentVersionIdx, 1)
  fs.writeFile('versions.json', `${JSON.stringify(newVersions, null, 2)}\n`)

  // Edit links
  await updateReleaseNoteLinks(versionsMap.next, `/docs/${versionsMap.next}`, '/docs')  
}

const main = async () => {
  if (!versionsMap.next) {
    console.error('No Next version specified in versionsMap.json')
    process.exit(1)
  }

  let proceedMsg = `This routine will promote documentation version ${versionsMap.next} from Next to Current (${versionsMap.current} -> ${versionsMap.next}), while unsetting the Next version.\n\n`

  if (!isCurrentVersionLts()) {
    proceedMsg = proceedMsg + `Since Current version ${versionsMap.current} is not an LTS, it WILL BE DELETED.`
  } else if (isCurrentVersionLts() && isNextVersionAPatchOfCurrent()) {
    proceedMsg = proceedMsg + `Since Next version ${versionsMap.next} is a higher LTS version then Current version ${versionsMap.current}, Current version ${versionsMap.current} WILL BE DELETED.`
  } else {
    proceedMsg = proceedMsg + `Since Current version ${versionsMap.current} is an LTS, it WILL NOT BE DELETED.`
  }

  proceedMsg = proceedMsg + `\n\nContinue?`

  const proceed = await confirm({ message: proceedMsg })

  if (proceed === false) { process.exit(1) }

  await promoteNext()
}

export default main
