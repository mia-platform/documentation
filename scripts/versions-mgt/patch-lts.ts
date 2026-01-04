import fs from 'node:fs/promises'

import { select, confirm } from '@inquirer/prompts'
import { inc, satisfies } from 'semver'

import versions from '../../versions.json'
import versionsMap from '../../versionsMap'
import type { SelectChoice } from '.'

const buildLtsOptions = (): SelectChoice<[string, string]>[] => {
  return versionsMap.lts.map((range) => {
    if (satisfies(versionsMap.current, range)) {
      return { value: ['', ''], name: range, disabled: '(this LTS includes the current version)' }
    }

    if (satisfies(versionsMap.next, range)) {
      return { value: ['', ''], name: range, disabled: '(this LTS includes the next version)' }
    }

    const currentLtsPatch = versions.find((version) => satisfies(version, range))
    if (!currentLtsPatch) {
      console.error(`LTS version range ${range} does not have any matching version in the 'versions.json' file`)
      process.exit(1)
    }

    const nextLtsPatch = inc(currentLtsPatch, 'patch')
    if (nextLtsPatch === null) {
      console.error(`Cannot calculate the next patch for LTS version ${currentLtsPatch}`)
      process.exit(1)
    }

    return {
      value: [currentLtsPatch, nextLtsPatch],
      name: `${range} (${currentLtsPatch} -> ${nextLtsPatch})`
    }
  })
}

const main = async () => {
  const [curLtsPatch, nextLtsPatch] = await select({
    message: 'Which LTS version would you like to update?',
    choices: buildLtsOptions()
  })

  const proceed = await confirm({
    message: `This routine will publish documentation version ${nextLtsPatch} in place of version ${curLtsPatch}

Before proceeding, make sure you have performed the following actions:
- the documentation updates have been applied to the files in the 'versioned_docs/version-${curLtsPatch}/' directory
- if needed, any update to the documentation sidebar has been appied to the 'versioned_sidebars/version-${curLtsPatch}-sidebars.json' file
- the release note file for the new ${nextLtsPatch} version has been placed in the 'release-notes/' directory and added to the 'sidebarsReleaseNotes.js' file
- in the 'sidebarsReleaseNotes.js' file, the 'LTS' suffix has been removed from the label of the ${curLtsPatch} version release note and added to the label of the ${nextLtsPatch} version release note

Continue?`
  })

  if (proceed === false) { process.exit(1) }

  // Rename version doc directory
  try {
    await fs.rename(`versioned_docs/version-${curLtsPatch}`, `versioned_docs/version-${nextLtsPatch}`)
  } catch (err) {
    console.error(`Error renaming 'versioned_docs/version-${curLtsPatch}' directory:`, err)
    process.exit(1)
  }

  // Rename version sidebar file
  try {
    await fs.rename(`versioned_sidebars/version-${curLtsPatch}-sidebars.json`, `versioned_sidebars/version-${nextLtsPatch}-sidebars.json`)
  } catch (err) {
    console.error(`Error renaming 'versioned_sidebars/version-${curLtsPatch}-sidebars.json' file:`, err)
    process.exit(1)
  }

  // Edit 'versions.json' file
  let nextVersions = versions.map((version) => version === curLtsPatch ? nextLtsPatch : version)
  await fs.writeFile('versions.json', `${JSON.stringify(nextVersions, null, 2)}\n`)
}

export default main
