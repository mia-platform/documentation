const fs = require('fs');
const path = require('path');

const newVersion = process.argv.slice(-1)[0]
    .replace(/^v/, '');
let unreleased = fs.readFileSync('./release-note-unreleased.md', {encoding: 'utf8'});
unreleased = unreleased.replace(/_VERSION_/g, newVersion)

const dir = path.join(__dirname, '..', 'release-notes')
const fileName = `v${newVersion}.md`
fs.writeFileSync(path.join(dir, fileName), unreleased)
