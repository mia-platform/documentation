import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'

export const assertGitTreeClean = () => {
    try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' })
    
    if (gitStatus.trim() !== '') {
      console.error('Git tree is not clean. Please commit or stash your changes.')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error checking git status:', error)
    process.exit(1)
  }
}

const updateLinks = async (filePath: string, oldLink: string, newLink: string) => {
  const file = await fs.readFile(filePath, { encoding: 'utf8', flag: 'r' })
  
  const updatedFile = file.replaceAll(oldLink, newLink)

  await fs.writeFile(filePath, updatedFile)
}

export const updateReleaseNoteLinks = async (version: string, oldLink: string, newLink: string) => {
  const rnEntries = fs.glob(`release-notes/v${version}.{md,mdx}`)
  const rnPath = (await rnEntries.next()).value
  if (!rnPath) {
    console.log(`Warning: release note file for version ${version} not found`)
    return
  }

  updateLinks(rnPath, oldLink, newLink)
  
  const accordionEntries = fs.glob(`src/config/release-notes/release-note-v${version.replaceAll('.', '-')}.json`)
  const accordionPath = (await accordionEntries.next()).value
  if (!accordionPath) {
    console.log(`Warning: release note accordion config file for version ${version} not found`)
    return
  }

  updateLinks(accordionPath, oldLink, newLink)
}
