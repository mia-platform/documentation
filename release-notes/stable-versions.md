---
id: stable-versions
title: Mia-Platform stable versions
sidebar_label: Stable versions
---

import GanttChart from "@site/src/components/Gantt/";
import StableVersionsTable from "@site/src/config/stable-versions-table.json";
import StableVersionsGantt from "@site/src/config/stable-versions-gantt.json";

A **stable release** is version that is as reliable as possible and on which a defined maintenance time window (MTW) is guaranteed.

Versions labeled as _stable_ are particularly suitable for on-premise updates and installations.

Typically, a new stable version is announced every quarter of the year. Therefore, _four stable versions_ will be announced over a one-year period.

For each stable version, a **Maintenance Time Window (MTW)** will be granted for a three-months period approximately, pending the next stable version.

Thus, once a [Major/Minor version](/release-notes/info/version_policy) is labeled as stable, patches on this specific version will be provided throughout the Maintenance Time Window in case of relevant detected bugs.
Then, we recommend regularly upgrading to the latest patch of the stable release.  
Once a new stable release is announced, it is suggested to upgrade to the new stable version to ensure guaranteed future support in case of malfunctions or relevant bugs detection.

:::info
**Only bug-fixes** will be applied on the stable version, and _no new features will be added_.
:::

## Stable versions list

Here you can find the list of stable versions, with their guaranteed maintenance time windows (MTW).

:::info
As the transition period from one MTW to the next approaches, more precise dates for the closing of the first and the opening of the next will be reported in the following table.
:::

### Stable Versions Chart

<GanttChart config={StableVersionsGantt} />

### Stable Versions Table

<GanttChart config={StableVersionsTable} renderAs="table" />


*Stable Versions may be subject to review and may change in the time before release*
