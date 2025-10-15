import fs from 'fs'

export const deleteVersion = async (root: string, version: string) => {
  const versionsFileContent = fs.readFileSync(`${root}/versions.json`, { encoding: 'utf8', flag: 'r' })
  const versions = JSON.parse(versionsFileContent)

  const versionIndex = versions.indexOf(version)
  if(versionIndex === -1) {
    throw new Error(`Version ${version} does not exist`)
  }

  fs.rmSync(`${root}/versioned_docs/version-${version}`, { recursive: true })
  fs.rmSync(`${root}/versioned_sidebars/version-${version}-sidebars.json`)

  const newVersions = versions.toSpliced(versionIndex, 1)
  fs.writeFileSync(`${root}/versions.json`, JSON.stringify(newVersions, null, 2))
}