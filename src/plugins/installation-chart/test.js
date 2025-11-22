import fs from 'node:fs/promises'
import {remark} from 'remark'
import plugin from './index.js'

const document = await fs.readFile(`${process.cwd()}/release-notes/v14.5.0.mdx`, 'utf8')

const file = await remark().use(plugin).process(document)

await fs.writeFile('output.md', String(file))
