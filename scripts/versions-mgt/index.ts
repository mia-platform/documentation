import { ExitPromptError } from "@inquirer/core"
import { select } from '@inquirer/prompts'

import createVersion from './create-version'
import patchLts from './patch-lts'
import promoteCanary from './promote-canary'
import promoteNext from './promote-version'

export type SelectChoice<Value> = {
  value: Value
  name?: string
  disabled?: string
}

const main = async () => {
  // assertGitTreeClean()

  const command: 'create-version' | 'promote-next' | 'promote-canary' | 'patch-lts' = await select({
    message: 'What do you want to do?',
    choices: [
      {
        value: 'create-version',
        name: 'Promote Canary to Next and Next to Current',
        description: 'Promote Canary version to Next, and Next to Current.'
      },
      {
        value: 'promote-next',
        name: 'Just promote Next to Current',
        description: 'Promote Next version to Current, and unset Next version.'
      },
      {
        value: 'promote-canary',
        name: 'Just promote Canary to Next',
        description: 'Promote Canary version to Next.'
      },
      {
        value: 'patch-lts',
        name: 'Patch an existing LTS version',
        description: 'Add a new patch to an existing LTS version.'
      }
    ]
  })

  switch (command) {
    case 'create-version': await createVersion(); break;
    case 'promote-next': await promoteNext(); break;
    case 'promote-canary': await promoteCanary(); break;
    case 'patch-lts': await patchLts(); break;
  }
}

main().catch((err) => {
  if (!(err instanceof ExitPromptError)) {
    console.error(err)
  }

  process.exit(1)
})
