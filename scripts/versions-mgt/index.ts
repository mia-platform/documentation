import { execSync } from 'node:child_process'

import { ExitPromptError } from "@inquirer/core"

import patchLts from './patch-lts'
import { select } from '@inquirer/prompts'

export type SelectChoice<Value> = {
  value: Value
  name?: string
  disabled?: string
}

const assertGitTreeClean = () => {
    try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' })
    
    if (gitStatus.trim() !== '') {
      console.error('Git tree is not clean. Please commit or stash your changes.')
      process.exit(1)
    }
  } catch (error) {
    console.error('Error checking git status:', error)
    process.exit(1)
  }
}

const main = async () => {
  assertGitTreeClean()

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
        description: ''
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
    case 'promote-version': break;
    case 'patch-lts': patchLts()
  }

  console.log('All done!')
}

main().catch((err) => {
  if (!(err instanceof ExitPromptError)) {
    console.error(err)
  }

  process.exit(1)
})

