const fs = require('fs');
const path = require('path');

const newVersion = process.argv.slice(-1)[0]
    .replace(/^v/, '');
let unreleased = fs.readFileSync('./docs/release_notes/unreleased/unreleased.md', {encoding: 'utf8'});
unreleased = unreleased.replace(/_VERSION_/g, newVersion)
const desiredMinorFolder = newVersion.split('.').slice(0, -1).join('-')
const newFolder = `RN_v${desiredMinorFolder}`
const dir = path.join(__dirname, 'docs', 'release_notes', newFolder)
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
}
const versionForFileName = newVersion.split('.').join('-').replace(/^v/, '')
const fileName = `platform_${versionForFileName}_releasenotes.md`
fs.writeFileSync(path.join(dir, fileName), unreleased)