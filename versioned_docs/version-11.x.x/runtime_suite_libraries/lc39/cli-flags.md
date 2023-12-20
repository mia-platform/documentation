---
id: cli-flags
title: CLI Flags
sidebar_label: Cli-flags
---
The **lc39** cli command support some degree of personalization via command flags.  
Here are listed all the available flags, their default values and the accepted ones.

|  Description | Short Command | Full Command | Default Value |
| ------------ | ------------- |--------------| ------------- |
| Port to listen on | `-p` | `--port` | `3000` |
| Log level | `-l` | `--log-level` | `info` |
| Set the prefix | `-x` | `--prefix` |  |
| The path of the dotenv file to load during launch | `-e` | `--env-path` |  |
| Expose Prometheus metrics |  | `--expose-metrics` | `true`  |
| Enable tracing            |  | `--enable-tracing` | `false` |
