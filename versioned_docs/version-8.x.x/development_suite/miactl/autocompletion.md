---
id: autocompletion
title: Miactl Shell Autocompletion
sidebar_label: Shell Auto-Completion
---

`miactl` provides autocompletion support for Bash, Zsh and Fish, which provides a quicker access to the cli and improve developer experience.

### Bash

Auto-completion in Bash requires the package [bash-completion](https://github.com/scop/bash-completion) package. Once it is installed and available, the completion can be generated running the `miactl completion bash` command.

Below are reported the steps to enable them.

:::caution
there are two versions of `bash-completion`, v1 and v2. V1 is for Bash 3.2 (which is the default on macOS), and v2 is for Bash 4.1+. The miactl completion script requires `bash-completion` v2 and Bash 4.1+.
:::

#### Linux

The required package `bash-completion` can be installed with one of the following commands, depending on your system:

- **Ubuntu** - `apt-get install bash-completion`
- **Arch Linux** - `pacman -S bash-completion`
- **Fedora** - `dnf install bash-completion`
- **RHEL/CentOS** - `yum install bash-completion`

They create `/usr/share/bash-completion/bash_completion` file, which is the main script of bash completion.
Try to run the command `type _init_completion`. If the command succeeds, you're already set. Otherwise, add to the `~/.bashrc` file the following line:

```sh
source /usr/share/bash-completion/bash_completion
```

After the correct installation of `bash-completion`, `miactl` completion can be generated running this command:
```sh
miactl completion bash >/etc/bash_completion.d/miactl
```

#### Mac OS

Start by checking bash version running `echo $BASH_VERSION`. In case the version is earlier than 4.1, you should install a newer version of bash with Homebrew, running the command below:

```sh
brew install bash
```

Reload your shell and run the command `echo $BASH_VERSION` to verify the bash version.

Once installed the correct bash version, you should install `bash-completion` v2. To verify whether it is already installed, run `type _init_completion`. Otherwise, you can install it through Homebrew:

```sh
brew install bash-completion@2
````

Next, add in your `~/.bashrc` file this lines:
```sh
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Finally, after bash completion is installed correctly, it is possible to enable completion executing this command:
```sh
miactl completion bash >/etc/bash_completion.d/miactl
```

### Fish

Completion could be generated running the `miactl completion fish` command.

To make this completion work, you should run:
```sh
miactl completion fish >~/.config/fish/completions/miactl.fish
```

### Zsh

Completion could be generated running the `miactl completion zsh` command

The generated completion script should be put somewhere in your `$fpath` named `_miactl`.