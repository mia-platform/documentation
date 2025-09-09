---
id: setup
title: Setup
sidebar_label: Setup
---



## Installation

`mlp` can be installed in different ways, you can choose the one that better fits your needs and the operating system
you are using:

- [Linux and MacOs](#linux-and-macos)
  - [Homebrew](#homebrew)
  - [Go](#go)
  - [Binary Download](#binary-download)
  - [Docker](#docker)
- [Windows (with WSL)](#windows)
- [Shell Autocompletion](#shell-autocompletion)

### Linux and MacOs

#### Homebrew

If you have [Homebrew] installed on your system `mlp` is only a command away:

```sh
brew install mia-platform/tap/mlp
```

This method will also automatically setup the shell completions for `bash`, `zsh` and `fish`.

#### Go

If you have [Golang] installed with a version >= 1.13 in your system and you have the `$GOPATH`env set, you can
install `mlp` like this:

```sh
go install github.com/mia-platform/mlp@v2.0.1
```

Or like this if the `install` command is not available

```sh
go get -u github.com/mia-platform/mlp@v2.0.1
```

#### Binary Download

You can install `mlp` with the use of `curl` or `wget` and downloading the latest packages available on GitHub
choosing the correct platform and operating system:

```sh
curl -fsSL --proto '=https' --tlsv1.2 https://github.com/mia-platform/mlp/releases/download/v2.0.1/mlp-linux-amd64 -o /tmp/mlp
```

```sh
wget -q --https-only --secure-protocol=TLSv1_2 https://github.com/mia-platform/mlp/releases/download/v2.0.1/mlp-linux-amd64 -O /tmp/mlp
```

After you have downloaded the file you can validate it against the checksum you can find at this [url] running the
command:

```sh
sha256sum /tmp/mlp
```

After you have validated that the downloaded file is correct, move the binary in your `/usr/local/bin` folder

```sh
sudo install -g root -o root /tmp/mlp /usr/local/bin
```

#### Docker

If you want to run the cli in its environment or you want to test the cli you can use the Docker image:

```sh
docker run ghcr.io/mia-platform/mlp:v2.0.1
```

### Windows

`mlp` is not directly compatible with Windows, even if you have Go installed compilation on this OS
is not possible due to current technical restrictions.

However, it is still possible to use `mlp` with Windows Subsystem for Linux (WSL), as explained here below.

#### Installation of WSL

If you don't have WSL on your system, follow the [official guide] to get it.

Once WSL is installed, to open a Linux bash terminal, press Start+R, enter `bash` in the text box and press OK.

#### Install `mlp`

You can now install mlp with any of the methods explained above for Linux,
we suggest the [binary installation](#binary-download) since it's the most straightforward.

## Shell Autocompletion

If you have chosen to use an installation method different from the brew one, you will have to setup the
commands autocompletion for your shell following one of these guides:

- [`bash`](#bash)
- [`zsh`](#zsh)
- [`fish`](#fish)

When you update the command remember to relaunch the command for your shell to update the completion definition
and get the latest command and/or flags that has been added.

### `bash`

The `bash` autocompletion needs the [`bash-completion`] package installed on your system.

**Warning:** for working correctly you need the `bash-completion` V2 that is compatible only with Bash 4.1+,
please be sure to have the correct versions installed on your system before running the command.

```sh
mlp completion bash >/usr/local/etc/bash_completion.d/mlp
```

After done this you must restart your shell environment or launch `exec bash` for reloading the configurations
and enable the autocompletion.

### `zsh`

For setting up the `zsh` completion, you must enable it. You can use the following command:

```sh
echo "autoload -U compinit; compinit" >> ~/.zshrc
```

Or use something like [`oh-my-zsh`] that will enable it by default. Once you have done it you can launch the
following command to create the file needed by `zsh`:

```sh
mlp completion zsh > /usr/local/share/zsh/site-functions/_mlp
```

After done this you must restart your shell environment or launch `exec zsh` for reloading the configurations and
enable the autocompletion.

### `fish`

To enable the autocompletion in `fish` you have to run this command:

```sh
mlp completion fish > ~/.config/fish/completions/mlp.fish
```

After done this you must restart your shell environment or launch `exec fish` for reloading the configurations and
enable the autocompletion.

[Homebrew]: https://brew.sh "The Missing Package Manager for macOS (or Linux)"
[Golang]: https://go.dev "Build simple, secure, scalable systems with Go"
[url]: https://github.com/mia-platform/mlp/releases/download/v0.12.2/checksums.txt "mlp checksums"
[`bash-completion`]: https://github.com/scop/bash-completion "Programmable completion functions for bash"
[`oh-my-zsh`]: https://ohmyz.sh "Oh My Zsh is a delightful, open source, community-driven
	framework for managing your Zsh configuration"
[official guide]: https://learn.microsoft.com/en-us/windows/wsl/install "How to install Linux on Windows with WSL"
