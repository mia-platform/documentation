'use strict'

const klaw = require('klaw')
const path = require('path')
const fs = require('fs')

// mode could be warn, debug or throw
checkSidebar('./docs', './sidebars.json', '', false, 'throw')

const filesToExcludeFromSidebarCheck = [
  "monitoring/paas_alerting_rules",
  "info/licenses-reports/.gitkeep",
  'cli/miactl/*',
  "info/licenses/*",
  "runtime_suite/*",
  "runtime_suite_applications/*",
  "runtime_suite_templates/*",
  "runtime_suite_libraries/*",
  "runtime_suite_tools/*",
  "microfrontend-composer/back-kit/*",
  "microfrontend-composer/composer/*",
  "infrastructure/self-hosted/installation-chart/*",
  "getting-started/videos/*",
  "getting-started/videos/subtitle/*",
  "console/videos/*",
  "console/videos/subtitle/*",
  "fast_data/videos/*",
  "fast_data/videos/subtitle/*",
  "microfrontend-composer/videos/*",
  "microfrontend-composer/videos/subtitle/*",
  "standalone-resources/*",
  "fast_data/runtime_management/snippets/*",
  "fast_data/snippets/*",
  "development_suite/api-console/api-design/videos/subtitle/*",
  "software-catalog/basic-concepts/*",
  "software-catalog/snippets/*",
  "software-catalog/tutorials/*",
]

const checkIdRegexp = new RegExp('^---(\\n.*)+id:\\s+([-\\w. ]+)(.*\\n)+---$', 'm')
const checkImg = new RegExp('\\[[^\\]]*\\]\\((?<filename>.*?)(?=\\"|\\))(?<optionalpart>\\".*\\")?\\)', 'mg')
const checkImgTag = new RegExp('<img src=".+" \\/>')
const checkImportImg = new RegExp('import .+ from \'(.+(?:\\.png|\\.svg|\\.jpeg|\\.jpg|\\.bmp))\'', 'gi')

async function checkSidebar(folder, sidebarFilePath, sidebarBasePath, removeImages, mode) {
  const absolutePathPrefix = path.join(process.cwd(), folder, '/')

  const sidebarFiles = getSidebarLinkedFiles(sidebarFilePath, sidebarBasePath)
  const footerFiles = await getFooterLinkedFiles()

  const images = []
  for await (const file of klaw(folder)) {
    if (file.stats.isDirectory()) {
      continue
    }

    const ext = path.extname(file.path)
    if (/^.mdx?/.test(ext)) {
      continue
    }

    const relativeFilePath = file.path.replace(absolutePathPrefix, '')
    images[relativeFilePath] = {
      file: file.path,
      isUsed: false
    }
  }

  const files = []
  for await (const file of klaw(folder)) {
    if (file.stats.isDirectory()) {
      continue
    }

    const ext = path.extname(file.path)
    if (!/^.mdx?/.test(ext)) {
      continue
    }

    const content = fs.readFileSync(file.path, 'utf8')
    const header = content.match(checkIdRegexp)
    const manageMatchedImage = img => {
      const absolutePath = path.resolve(path.parse(file.path).dir, img)
      images[absolutePath.replace(absolutePathPrefix, '')] = {
        file: absolutePath,
        isUsed: true
      }
    }
    content.match(checkImg)?.map(img => img.replace(/^\[.*\]\(/, '').replace(/\)$/, '')).forEach(manageMatchedImage)
    content.match(checkImgTag)
    ?.map(img => img.replace("<img src=\"", "").replace("\" />", "").trim())
    .forEach(manageMatchedImage)

    const imagesFromImport = [...content.matchAll(checkImportImg)].map(match => match[1])
    imagesFromImport.forEach(manageMatchedImage)

    let filePath = file.path
    if (header && header[2]) {
      filePath = filePath.replace(path.basename(file.path), header[2])
    }

    const relativeFilePath = filePath.replace(absolutePathPrefix, '')
    if (/^.mdx?/.test(ext)) {
      files.push(relativeFilePath.replace(path.extname(file.path), ''))
    }
  }

  const filesNotInSidebar = []
  for (const fileName of files) {
    if (excludeFromSidebarCheck(fileName)) {
      continue
    }
    const fileNameWithoutExtension = fileName

    if (!sidebarFiles[fileNameWithoutExtension] && !footerFiles[fileNameWithoutExtension]) {
      filesNotInSidebar.push(fileNameWithoutExtension)
      if (mode === 'warn') {
        // eslint-disable-next-line no-console
        console.warn(`${fileName} is not in the sidebar`)
      }
    }
  }
  if (mode === 'debug') {
    fs.writeFileSync('./filesNotInSidebar.json', JSON.stringify(filesNotInSidebar, null, 2))
  }

  const imagesNotLinked = []
  for (const img in images) {
    if(img.includes('.gitkeep') || excludeFromSidebarCheck(img)) {
      continue
    }
    if (!images[img].isUsed) {
      imagesNotLinked.push(images[img].file.replace(absolutePathPrefix, ''))
      if (mode === 'warn') {
        // eslint-disable-next-line no-console
        console.warn('image not linked:', images[img].file)
      }
      if (removeImages) {
        fs.rmSync(images[img].file)
      }
    }
  }
  if (mode === 'debug') {
    fs.writeFileSync('./images.json', JSON.stringify(imagesNotLinked, null, 2))
  }

  if (mode === 'throw' && filesNotInSidebar.length > 0 || imagesNotLinked.length > 0) {
    const err = new Error('Sidebar not linked to files and images not linked')
    err.filesNotInSidebar = JSON.stringify(filesNotInSidebar, null, 2)
    err.imagesNotLinked = JSON.stringify(imagesNotLinked, null, 2)
    throw err
  }
}

function getItems(items, prefix) {
  let files = {}
  for (let item of items) {
    if (item.type === 'autogenerated') {
      continue
    }
    if (item.items) {
      files = {
        ...files,
        ...getItems(item.items, prefix)
      }
    } else {
      files[item.id.replace(prefix, '')] = true
    }
    if (item.link?.id) {
      files[item.link.id.replace(prefix, '')] = true
    }
  }
  return files
}

function getSidebarLinkedFiles(sidebarFilePath, prefix = '') {
  const sidebar = require(sidebarFilePath)
  let files = {}
  Object.values(sidebar).forEach(category => {
    category.forEach(detail => {
      if (typeof detail === 'string') {
        files[detail] = true
        return
      }
      if (detail.items) {
        files = {
          ...files,
          ...getItems(detail.items, prefix)
        }
      } else if (detail.id) {
        files[detail.id.replace(prefix, '')] = true
      }
      if (detail.link?.id) {
        files[detail.link.id.replace(prefix, '')] = true
      }
    })
  })
  return files
}

async function getFooterLinkedFiles() {
  const config = await require('./docusaurus.config')()
  let files = {}
  config.themeConfig.footer.links.forEach(({items}) => {
    items.forEach(item => {
      if (item.to) {
        files[item.to.replace(/^\/docs\//, '')] = true
      }
    })
  })
  return files
}

function excludeFromSidebarCheck(fileName) {
  if (filesToExcludeFromSidebarCheck.includes(fileName)) {
    return true
  }
  return Boolean(filesToExcludeFromSidebarCheck.find(pattern => {
    if (pattern.endsWith('/*') && fileName.startsWith(pattern.slice(0, -2))) {
      return true
    }
  }))
}
