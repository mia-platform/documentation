import { deleteVersion } from "./lib/deleteVersion";
import { semVerRegex } from "./lib/utils";

const {execSync} = require('child_process')
const fs = require('fs')
const versions = require('../versions.json')

const root = process.cwd()

const updateLinks = (filePath: string, oldLink: string, newLink: string) => {
  console.log(`Updating links in ${filePath} from ${oldLink} to ${newLink}`)
  
  const releaseNote = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
  const updatedReleaseNotes = releaseNote.replaceAll(oldLink, newLink)

  fs.writeFileSync(filePath, updatedReleaseNotes)
}

const updateReleaseNoteLinks = (rnVersion: string, oldLink: string, newLink: string) => {
  let releaseNoteFilePath = `${root}/release-notes/v${rnVersion}.md`
  if(!fs.existsSync(releaseNoteFilePath)) {
    releaseNoteFilePath += 'x'
    if(!fs.existsSync(releaseNoteFilePath)) {
      console.log(`Warning: release note file for version ${rnVersion} not found`)
      return
    }
  }
  updateLinks(releaseNoteFilePath, oldLink, newLink)
  
  const releaseNoteAccordionFilePath = `${root}/src/config/release-notes/release-note-v${rnVersion.replaceAll('.', '-')}.json`
  if(!fs.existsSync(releaseNoteAccordionFilePath)) {
    console.log(`Warning: release note accordion config file for version ${rnVersion} not found`)
    return
  }
  updateLinks(releaseNoteAccordionFilePath, oldLink, newLink)
}


/**
 * Possible scenarios when creating a new version (referring to versions.json):
 * Note that the canary version is not listed in versions.json
 * 
 * Case 1: A patch version has to be "merged" into the latest patch version of the same minor:
 * 
 *    NEW 13.3.2 prevCanary (/docs/next)  -> next (/docs/13.3.2/)
 *    13.3.1 prevNext (/docs/13.3.1updateReleaseNoteLinks)      -> prod (/docs)
 *    13.3.0 prevProd (/docs)         
 *    13.2.1
 *
 * 
 * Case 2: A new version is created and no "merging" is needed:
 * 
 *    NEW 13.5.0 prevCanary (/docs/next)  -> next (/docs/13.5.0/)
 *    13.4.1 prevNext (/docs/13.4.1)      -> prod (/docs)
 *    13.3.0 prevProd (/docs)             ->      (/docs/13.3.0)
 *    13.2.1
 */
const main = async () => {
 
  const newVersion = process.argv.slice(-1)[0]?.replace(/^v/, '')
  console.log('Creating new version: ', newVersion);

  if (!newVersion || !newVersion.match(semVerRegex)) {
    console.error('Version not provided or does not follow semver. Usage: yarn create-version <new-version>')
    process.exit(1)
  }

  if(versions.includes(newVersion)) {
    console.error(`Version ${newVersion} already exists`)
    process.exit(1)
  }

  try {
    execSync(`yarn docusaurus docs:version ${newVersion}`, { stdio: 'inherit' })
  } catch(error) {
    console.error(`Error executing "docusaurus docs:version"`, error);
  }

  const versionsFileContent = fs.readFileSync(`${root}/versions.json`, { encoding: 'utf8', flag: 'r' })
  const updatedVersions = JSON.parse(versionsFileContent)
  const prevNextVersion = updatedVersions[1]
  const prevProdVersion = updatedVersions[2]

  updateReleaseNoteLinks(prevNextVersion, `/docs/${prevNextVersion}`, '/docs')
  updateReleaseNoteLinks(newVersion, `/docs/next`, `/docs/${newVersion}`)

  const prevNextMinor = prevNextVersion.split('.')[1]
  const prevProdMinor = prevProdVersion.split('.')[1]
  if(prevNextMinor === prevProdMinor) {
    console.log(`Deleting ${prevProdVersion}...`)

    deleteVersion(root, prevProdVersion)
    // no need to change link in prevProdVersion RN file
    process.exit(0)
  }

  updateReleaseNoteLinks(prevProdVersion, `/docs`, `/docs/${prevProdVersion}`)
}

main()