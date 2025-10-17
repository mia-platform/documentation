import { deleteVersion } from "./lib/deleteVersion";
import { semVerRegex } from "./lib/utils";

const main = async () => {
  const version = process.argv.slice(-1)[0]?.replace(/^v/, '')
  if (!version || !version.match(semVerRegex)) {
    console.error('Version not provided or does not follow semver. Usage: yarn delete-version <new-version>')
    process.exit(1)
  }

  deleteVersion(process.cwd(), version)
}

main()