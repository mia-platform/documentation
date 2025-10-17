const fs = require('fs');
const path = require('path');

const createMarkdownFile = (newVersion) => {
  let unreleasedMarkdown = fs.readFileSync(path.join(__dirname, './release-note-unreleased.mdx'), {encoding: 'utf8'});
  unreleasedMarkdown = unreleasedMarkdown.replace(/_ACCORDION_VERSION_/g, newVersion.replaceAll('.', '-'))
  unreleasedMarkdown = unreleasedMarkdown.replace(/_VERSION_/g, newVersion)

  const dir = path.join(__dirname, '..', '..', 'release-notes')
  const fileName = `v${newVersion}.mdx`
  fs.writeFileSync(path.join(dir, fileName), unreleasedMarkdown)
}

const createAccordionFile = (newVersion) => {
  let unreleasedAccordion = fs.readFileSync(path.join(__dirname, './release-note-accordion-unreleased.json'), {encoding: 'utf8'});

  const dir = path.join(__dirname, '..', '..', 'src', 'config', 'release-notes')
  const fileName = `release-note-v${newVersion.replaceAll('.', '-')}.json`
  fs.writeFileSync(path.join(dir, fileName), unreleasedAccordion)
}

const newVersion = process.argv.slice(-1)[0]
    .replace(/^v/, '');

createMarkdownFile(newVersion)
createAccordionFile(newVersion)
