import { execSync } from "node:child_process"
import fs from 'node:fs/promises'

import { confirm, select } from "@inquirer/prompts"
import { inc, major, minor, satisfies } from "semver"

import _versionsMap from '../../versionsMap.json'
import { isCurrentVersionLts, isNextVersionAPatchOfCurrent, updateReleaseNoteLinks, VersionsMap } from "./lib"
import { promoteNext } from "./promote-version"

const main = async () => {
  const versionsMap = _versionsMap as VersionsMap

  if (versionsMap.next === null && versionsMap.current === null) {
    console.error('No Next version nor Current version specified in versionsMap.json')
    process.exit(1)
  }

  const nextPatch = inc(versionsMap.next ?? versionsMap.current!, 'patch')!
  const nextMinor = inc(versionsMap.next ?? versionsMap.current!, 'minor')!

  const [newVersion, newVersionType] = await select<[string, 'minor' | 'patch']>({
    message: 'What kind of version do you want to create?',
    choices: [
      { value: [nextPatch, 'patch'], name: `Patch (${nextPatch})` },
      { value: [nextMinor, 'minor'], name: `Minor (${nextMinor})` },
    ]
  })

  let newLtsRange: string | null = null
  if (newVersionType === 'minor') {
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
    proceedMsg = proceedMsg + `\n\nDocumentation version ${versionsMap.next} will be promoted from Next to Current (${versionsMap.current} -> ${versionsMap.next}).`
  }

  if (!isCurrentVersionLts()) {
    proceedMsg = proceedMsg + `\n\nSince Current version ${versionsMap.current} is not an LTS, it WILL BE DELETED.`
  } else if (isCurrentVersionLts() && isNextVersionAPatchOfCurrent()) {
    proceedMsg = proceedMsg + `\n\nSince Next version ${versionsMap.next} is a higher LTS version then Current version ${versionsMap.current}, Current version ${versionsMap.current} WILL BE DELETED.`
  } else {
    proceedMsg = proceedMsg + `\n\nSince Current version ${versionsMap.current} is an LTS, it WILL NOT BE DELETED.`
  }

  proceedMsg = proceedMsg + `\n\nContinue?`

  const proceed = await confirm({ message: proceedMsg })

  if (proceed === false) { process.exit(1) }

  // Promote Next to Current, if needed
  if (versionsMap.next) {
    await promoteNext()
  }

  // Create new version
  try {
    execSync(`yarn docusaurus docs:version ${newVersion}`, { stdio: 'inherit' })
  } catch(error) {
    console.error('Error executing "docusaurus docs:version" command:', error);
    process.exit(1)
  }

  // Update `versionsMap.json`
  const updatedVersionsMap = await import('../../versionsMap.json') as VersionsMap

  let newVersionsMap: VersionsMap = { 
    current: updatedVersionsMap.current, 
    next: newVersion, 
    lts: newLtsRange ? [...updatedVersionsMap.lts!, newLtsRange] : updatedVersionsMap.lts
  }

  await fs.writeFile('versionsMap.json', `${JSON.stringify(newVersionsMap, null, 2)}\n`)

  // Edit links
  await updateReleaseNoteLinks(newVersion, '/docs/next', `/docs/${newVersion}`)
}

export default main
