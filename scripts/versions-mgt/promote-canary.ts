import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'

import { input, select, confirm } from '@inquirer/prompts'
import { inc, major, minor } from 'semver'

import versions from '../../versions.json'
import _versionsMap from '../../versionsMap.json'
import { VersionsMap } from './lib'

const main = async () => {
  const versionsMap = _versionsMap as VersionsMap

  let newLtsRange: string | null = null
  let newVersion: string

  if (versionsMap.next !== null || versionsMap.current !== null) {
    const prevVersion = versionsMap.next ?? versionsMap.current

    const nextPatch = inc(prevVersion, 'patch')!
    const nextMinor = inc(prevVersion, 'minor')!

    const [_newVersion, _newVersionType] = await select<[string, 'minor' | 'patch']>({
      message: 'What kind of version do you want to create?',
      choices: [
        { value: [nextPatch, 'patch'], name: `Patch (${nextPatch})` },
        { value: [nextMinor, 'minor'], name: `Minor (${nextMinor})` },
      ]
    })

    newVersion = _newVersion

    if (_newVersionType === 'minor') {
      const isLts = await select({
        message: 'Is the new version an LTS?',
        choices: [{ value: true, name: 'Yes' }, { value: false, name: 'No' }]
      })

      if (isLts) {
        newLtsRange = `${major(_newVersion)}.${minor(_newVersion)}.x`
      }
    }
  } else {
    newVersion = await input({ message: 'Which version do you want to create?' })

    const isLts = await select({
      message: 'Is the new version an LTS?',
      choices: [{ value: true, name: 'Yes' }, { value: false, name: 'No' }]
    })

    if (isLts) {
      newLtsRange = `${major(newVersion)}.${minor(newVersion)}.x`
    }
  }

  let proceedMsg = `This routine will create documentation version ${newVersion} and promote it to Next (${versionsMap.next} -> ${newVersion}).`

  if (newLtsRange) {
    proceedMsg = proceedMsg + `The range ${newLtsRange} will be added to the list of LTS ranges.`
  }

  if (versionsMap.next) {
    proceedMsg = proceedMsg + `\n\nDocumentation version ${versionsMap.next} will be overwritten (it WILL BE DELETED).`
  }

  proceedMsg = proceedMsg + `\n\nContinue?`

  const proceed = await confirm({ message: proceedMsg })

  if (proceed === false) { process.exit(1) }

  // Delete previous Next version
  if (versionsMap.next) {
    // Delete version doc directory
    try {
      await fs.rm(`versioned_docs/version-${versionsMap.next}`, { recursive: true })
    } catch (err) {
      console.error(`Error deleting 'versioned_docs/version-${versionsMap.next}' directory:`, err)
      process.exit(1)
    }

    // Rename version sidebar file
    try {
      await fs.rm(`versioned_sidebars/version-${versionsMap.next}-sidebars.json`)
    } catch (err) {
      console.error(`Error deleting 'versioned_sidebars/version-${versionsMap.next}-sidebars.json' file:`, err)
      process.exit(1)
    }
  }

  // Create new version
  try {
    execSync(`yarn docusaurus docs:version ${newVersion}`, { stdio: 'inherit' })
  } catch(error) {
    console.error('Error executing "docusaurus docs:version" command:', error);
    process.exit(1)
  }

  // Update `versionsMap.json`
  let newVersionsMap: VersionsMap = { 
    current: versionsMap.current, 
    next: newVersion, 
    lts: newLtsRange ? [...versionsMap.lts!, newLtsRange] : versionsMap.lts
  }

  await fs.writeFile('versionsMap.json', `${JSON.stringify(newVersionsMap, null, 2)}\n`)
}

export default main
