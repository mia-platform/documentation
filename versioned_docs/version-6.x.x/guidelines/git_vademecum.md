---
id: git_vademecum
title:  GIT Vademecum 
sidebar_label: GIT Vademecum
---
GIT is a distributed version control system that facilitates Mia-Platform activities. This vademecum summarizes the main GIT commands and guidelines to simplify your work.

## Install Git

Start using Git by installing it on your PC

[https://git-scm.com/downloads](https://git-scm.com/downloads)

## Initial configurations

*Configure valid user information for all repositories.*

```bash
git config --global user.name "[name]"
```

Set the username (name.surname) you want to show on your commits.

```bash
git config - global user.email "[email address]"
```

Set up the business email you want to show on your commits.

## Recommended configurations

*We recommend a series of configurations that could help you in your work.*

```bash
git config --global fetch.prune true
```

Set fetch.prune as active. It allows you to keep branches aligned remotely with your local branches.

```bash
git config --global pull.rebase true
```

Set the automatic rebase to the pull. It allows you to avoid unnecessary merge on a branch if you work in more than one person on the same branch.

```bash
git config --global rebase.autoStash true
```

Set the autostash to true in the initial configurations. Combined with the previous configuration, it allows you to perform a pull even with unscheduled modifications.

```bash
git config --global alias.gr 'log --graph --full-history --all --color --tags --decorate --pretty=format:"%x1b[31m%h%x09%x1b[32m%d%x1b[0m%x20%s %x1b[33m%aN <%ae>%x1b[0m (%aI)"'
```

Color your GIT for a better view of the history.

## Create a repository

*Start with a new repository or download information from an existing URL.*

```bash
git init [project-name]
```

Create a new local repository with its specific name.

```bash
git clone [url]
```

Download a project and its entire chronology.

## Make changes

*Review changes to the code and prepare a commit.*

```bash
git status
```

List all files, new or modified, to be committed.

```bash
git diff
```

Shows the differences between the files that were added and not ignored in the staging area.

```bash
git add [file]
```

Add new files and prepare them for the commit.

```bash
git diff --staged
```

Show file differences between staging and last modification.

```bash
git reset [file]
```

Remove a file from the staging area, but keep the changes.

```bash
git commit -m "[descriptive message]"
```

Add the file to the local repository header.

```bash
git push
```

Upload all local branches to the remote repository.

## Manage the branch

*Name your commits and join them when you finish.*

```bash
git branch
```

Lists all branches in the current repository.

```
    bash $ git branch [branch-name]
```

Create a new branch.

```bash
git checkout [branch-name]
```

Switch to the specified branch and update the current directory.

```bash
git merge [branch-name]
```

Merge the history of the specified branch with the current one.

```bash
git branch -d [branch-name]
```

Delete the specified branch only if it has been merged to master.

## Make refactoring your files

*Search and remove files from the history.*

```bash
git rm [file]
```

Remove a file from the directory and prepare for permanent deletion.

```bash
git rm --cached [file]
```

Delete the file from GIT, but keep the local file.

## Remove your files from the history

*Exclude files and temporary locations.*

```bash
    *.log build /TEMP-*
```

A text file called .gitignore prevents accidental versioning of files or directories according to a specified pattern.

```bash
git ls-files --others --ignored --exclude-standard
```

List all files ignored in this project.

## Save all changes

*Archive and restore incomplete changes. Useful for remotely downloading changes while you are working and you do not want to commit and push again or to change from one branch to another without committing before.*

```bash
git stash
```

Temporarily store all changed files so you can remotely git pull and download changes made by other team members.

```bash
git stash pop
```

Restore all files placed in stash from the stash archive. In this way you can merge with the changes downloaded remotely with the pull.

```bash
git stash list
```

Lists the edited files stored in stash.

```bash
git stash drop
```

Delete files stored in stash.

## Review the chronology

*Browse and check the evolution of the files of each project.*

```bash
git log
```

View the commit history of the current branch.

```bash
git log --follow [file]
```

View the history of a file, including changes.

```bash
git diff [first-branch] ... [second-branch]
```

Show the difference between two branches.

```bash
git show [commit]
```

Show metadata and changes made for a specific commit.

## Re-commit

*Eliminates errors and alters changes history.*

```bash
git reset [commit]
```

Cancel all commits made after [commit], preserving local changes.

```
    bash $ git reset --hard [commit]
```

Delete all history and changes until the specified commit.

## Synchronize changes

*Connect to a remote URL and get change history.*

```bash
git fetch [remote]
```

Download the change history from the remote repository.

```bash
git merge [remote] / [branch]
```

Join the remote branch with the local branch.

```bash
git push -u [remote] [branch]
```

Upload all changes to the local branch on the remote repository.

```bash
git pull
```

Update your local repository with the online repository.
