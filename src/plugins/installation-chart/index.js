import fs from 'node:fs/promises'
import {visit} from 'unist-util-visit'

const rnPathRegex = /release-notes\/v[^/]*\.mdx$/
const chartTemplateRegex = /\{\{\s*chart\s*\}\}/

const isChartNode = (node) => node.type === 'text' && chartTemplateRegex.test(node.value)

export default () => {
  return async (root) => {
    visit(root, (node) => {
      if (!isChartNode(node)) { return }

      console.log(JSON.stringify(node, null, 2))
    })
  }
}
