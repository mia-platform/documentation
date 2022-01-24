const {join} = require('path')

const {CI_COMMIT_REF_SLUG, BUNDLE_NAME, CI_DEFAULT_BRANCH, CI_COMMIT_BRANCH} = process.env
const BUNDLE_TAG = CI_COMMIT_REF_SLUG
const COMMIT_SHA = process.env.CI_COMMIT_SHA
const IS_DEFAULT_BRANCH = CI_DEFAULT_BRANCH === CI_COMMIT_BRANCH

module.exports = {
  bundle: {
    from: join(process.cwd(), '/build'),
    name: BUNDLE_NAME,
    tag: BUNDLE_TAG,
    description: `Commit ${COMMIT_SHA}`
  },
  deploy: {
    app: 'platform-documentation-preview',
    entrypoint: IS_DEFAULT_BRANCH ?
      `default.docs-preview.console.gcp.mia-platform.eu/` :
      `pr-${CI_COMMIT_REF_SLUG}.docs-preview.console.gcp.mia-platform.eu/`,
    bundle: `${BUNDLE_NAME}:${BUNDLE_TAG}`
  }
}
