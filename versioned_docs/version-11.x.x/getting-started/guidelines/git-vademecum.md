---
id: git-vademecum
title:  GIT Vademecum 
sidebar_label: GIT Vademecum
---
GIT is a distributed version control system that facilitates Mia-Platform activities. This cheat sheet summarizes the main GIT commands and provides some guidelines to simplify your work.

## Install Git

Start using Git by installing it on your PC. Visit [GIT official website](https://git-scm.com/downloads) and download the latest GIT version for your OS.

## Initial configurations

Configure valid user information for all repositories.

```bash title="Set the username (name.surname) you want to show on your commits."
git config --global user.name "[name]"
```

```bash title="Set up the business email you want to show on your commits."
git config --global user.email "[email address]"
```

You can also set different user information for different repositories. Open the terminal in that directory and run the commands above without the `--global` specification.

## Recommended configurations

We recommend a series of configurations that can help you in your work.

```bash title="Set fetch.prune as active to keep branches aligned remotely with your local branches."
git config --global fetch.prune true
```

```bash title="Set the automatic rebase to the pull. It allows you to avoid unnecessary merge on a branch if more than one person is working on the same branch."
git config --global pull.rebase true
```

```bash title="Combined with the previous configuration, autostash allows you to perform a pull even with unscheduled modifications."
git config --global rebase.autoStash true
```

```bash title="Color your GIT for a better view of the history."
git config --global alias.gr 'log --graph --full-history --all --color --tags --decorate --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s %x1b[33m%aN <%ae>%x1b[0m (%aI)"'
```

```bash title="Push local branches to remote repository without having to run --set-upstream origin"
git config --global --add --bool push.autoSetupRemote true
```

:::caution
The `git config --global --add --bool push.autoSetupRemote true` configuration is available only for 2.37.0 (or latest) version of GIT.
:::

## Create a repository

Start with a new repository or download information from an existing URL.

```bash title="Create a new local repository with its specific name."
git init [project-name]
```

```bash title="Download a project and its entire chronology from a URL."
git clone [url]
```

## Make changes

Review changes to the code and prepare a commit.

```bash title="List all files, new or modified, to be committed."
git status
```


```bash title="Shows the differences between the files that were added and not ignored in the staging area."
git diff
```

```bash title="Add new files and prepare them for the commit."
git add [file]
```

```bash title="Show differences between staged files and last modification."
git diff --staged
```

```bash title"Remove a file from the staging area, but keep the changes."
git reset [file]
```

```bash title="Add the file to the local repository header."
git commit -m "[descriptive message]"
```

```bash title="Signoff the commit with your user information. A message is required."
git commit -s
```

```bash title="Upload all local branches to the remote repository."
git push
```

## Manage the branch

Name your branches and join them when you finish.

```bash title="Lists all branches in the current repository."
git branch
```

```bash title="Create a new branch."
git branch -b [branch-name]
```

```bash title="Switch to the specified branch and update the current directory."
git checkout [branch-name]
```

```bash title="Merge the history of [branch-name] branch into the current one."
git merge [branch-name]
```

```bash title="Delete the specified branch only if it has been merged to master."
git branch -d [branch-name]
```

```bash title="Delete the specified remote branch."
git push origin -d [branch-name]
```

## Make refactoring your files

Search and remove files from the history.

```bash title="Remove a file from the directory and prepare for permanent deletion."
git rm [file]
```

```bash title="Delete the file from GIT, but keep the local file."
git rm --cached [file]
```

## Remove your files from the history

Exclude files and temporary locations.

```bash title="A text file called .gitignore prevents accidental versioning of files or directories according to a specified pattern."
*.log build /TEMP-*
```

```bash title="List all files ignored in this project."
git ls-files --others --ignored --exclude-standard
```

## Save all changes

Archive and restore incomplete changes. Useful for remotely downloading changes while you are working and you do not want to `commit` and `push` again or to change from one branch to another without committing before.

```bash title="Temporarily store all changed files."
git stash
```

```bash title="Restore all files placed in stash from the stash archive. In this way you can merge with the changes downloaded remotely with the pull."
git stash pop
```

```bash title="List the edited files stored in stash."
git stash list
```

```bash title="Delete files stored in stash."
git stash drop
```

## Review the chronology

Browse and check the evolution of the files of each project.

```bash title="View the commit history of the current branch."
git log
```

```bash title="View the history of a file, including changes."
git log --follow [file]
```

```bash title="Show the difference between two branches."
git diff [first-branch] ... [second-branch]
```

```bash title="Show metadata and changes made for a specific commit."
git show [commit]
```

## Re-commit

Delete errors and alters changes history.

```bash title="Delete all commits made after [commit], preserving local changes."
git reset [commit]
```

```bash title="Delete all history and changes until the specified commit."
git reset --hard [commit]
```

```bash title="Add signoff to an unsigned commit."
git commit --amend --signoff
```

## Synchronize changes

Connect to a remote URL and get change history.

```bash title="Download the change history from the remote repository."
git fetch [remote]
```

```bash title="Join the remote branch with the local branch."
git merge [remote] / [branch]
```

```bash title="Upload all changes to the local branch on the remote repository."
git push -u [remote] [branch]
```

```bash title="Update your local repository with the online repository."
git pull
```
