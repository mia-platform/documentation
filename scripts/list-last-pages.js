/*
    Use this script to generate the list of updated pages respect to the last minor version.
    Just run 'node ./scripts/list-last-pages.js' from the root folder of the repository to execute it 
    The list of files is printed in the src/components/LastPages/raw-links.json and is intended to be manually reviewed
    and, aftewards, copied and pasted in the pages field of the src/components/LastPages/links.json file
*/
'use strict'

const fs = require('fs');
const path = require('path')
const docsFilePath = path.join(__dirname, '../docs')
const gitTag = require('git-tag')({localOnly: true, dir: docsFilePath})
const gitListUpdated = require('git-list-updated');
var semverUtils = require('semver-utils');

gitTag.latest(function (res) {
    const tag = semverUtils.parse(res)
    tag.patch = 0
    gitListUpdated(docsFilePath, {
        base: 'v' + semverUtils.parse(tag),
        head: "HEAD"
    })
        .then(fileNames => {
            fs.writeFileSync(path.join(__dirname, "../src/components/LastPages/raw-links.json"), JSON.stringify(fileNames.reduce((acc, name) => {
                const nameWithoutExtentionMatch = name.match(/(.*)\.mdx?$/)
                if (nameWithoutExtentionMatch && !nameWithoutExtentionMatch[0].match(/changelog/i)) {
                    let title
                    const data = fs.readFileSync(path.join(__dirname, '../docs', name), {encoding: 'utf8'})
                    title = data.match(/title: (.*)/)[1]
                        .replace(/^"(.+)"$/,'$1')
                        .replace(/^'(.+)'$/,'$1')
                    const id = data.match(/id: (.*)/)[1]
                    acc.push({
                        url: `/${nameWithoutExtentionMatch[1]
                            .replace(/\/index$/,'')}`
                            .replace(/[^/]*$/, id),
                        title
                    })
                }
                return acc

            }, []), null, 2));
        });
})
