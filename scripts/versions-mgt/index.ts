import { ExitPromptError } from "@inquirer/core"

import patchLts from './patch-lts'
import promoteVersion from './promote-version'
import { select } from '@inquirer/prompts'

import { assertGitTreeClean } from "./lib"

export type SelectChoice<Value> = {
  value: Value
  name?: string
  disabled?: string
}

const main = async () => {
  // assertGitTreeClean()

  const command: 'create-version' | 'promote-version' | 'patch-lts' = await select({
    message: 'What do you want to do?',
    choices: [
      {
        value: 'create-version',
        name: 'Promote Canary to Next and Next to Current',
        description: ''
      },
        {
        value: 'promote-version',
        name: 'Just promote Next to Current',
        description: 'Promote Next version to Current, and unset Next version'
      },
      {
        value: 'patch-lts',
        name: 'Patch an existing LTS version',
        description: 'Add a new patch to an existing LTS version.'
      }
    ]
  })

  switch (command) {
    case 'create-version': break;
    case 'promote-version': await promoteVersion(); break;
    case 'patch-lts': await patchLts(); break;
  }

  console.log('All done!')
}

main().catch((err) => {
  if (!(err instanceof ExitPromptError)) {
    console.error(err)
  }

  process.exit(1)
})
