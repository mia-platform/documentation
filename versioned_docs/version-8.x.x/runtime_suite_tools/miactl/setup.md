---
id: setup
title: Setup
sidebar_label: Setup
---
### Using brew

```sh
brew install mia-platform/tap/miactl
```

### Using Go

This library requires golang at version >= 1.13

```sh
go get -u github.com/mia-platform/miactl
```

## Example usage

### Get projects

```sh
miactl get projects --apiKey "your-api-key" --apiCookie "sid=your-sid" --apiBaseUrl "https://console.url/"
```

### Projects help

```sh
miactl help
```
