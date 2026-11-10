---
id: integrations
title: Integrations
sidebar_label: Integrations
---

:::caution Alpha

Composable is in **alpha**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Integrations

Composable is the place where infrastructure is designed and governed. Execution and compliance records stay in the tools your organization already runs, and Composable connects to them instead of replacing them.

## ITSM

Change management usually lives in an ITSM such as ServiceNow or Jira Service Management. With the ITSM integration, developers never have to log in there.

When a Solution moves along its approval steps, a change request is opened automatically. It carries the requester, a readable description of the changes, the exact differences, and a link back to the visual topology.

Approvals and rejections recorded in the ITSM are reflected on the Solution, and the ticket is closed when the change is released. The ITSM becomes the register for compliance and auditing, while the working experience stays in Composable.

## GitOps and Infrastructure-as-Code

Composable does not call cloud provider APIs. When a change is approved and released, it is turned into declarative configuration files and merged into a configuration repository. The merge triggers the CI/CD pipeline your Platform Team maintains, which validates, plans, and applies the change with Infrastructure-as-Code tools such as Terraform. Infrastructure-as-Code remains the only authority over provisioning.

## Cloud connectors

After provisioning, connectors for cloud providers and runtime platforms discover what was actually created, such as identifiers, network addresses, and final configuration. They update the Catalog from the provisional state to the active one and detect drift between the design and the real infrastructure.

## Webhooks and events

Every action people take in Composable, such as creating a Solution, saving a revision, or merging a change, produces an event in an open standard format. You can subscribe webhooks to the events you care about and trigger your own automation, notifications, or dashboards.

## Audit and SIEM

The audit log keeps a tamper-evident history of every change, from the first draft to the final reconciliation. Logs can be streamed to enterprise SIEM solutions such as Splunk or Microsoft Sentinel for analysis and long-term retention, supporting standards such as ISO 27001 and SOC 2.

## API

Composable exposes an API so that other tools can read and drive the same information that the interface shows.

## MCP server

Like every Mia-Platform product, Composable provides an MCP server. AI assistants and agents can explore Systems, propose changes in a Solution, and follow them through, always with the permissions of the person they act for.

## Extensions

Administrators can add their own web applications to the Composable sidebar, so the tools of your organization are one click away from the canvas.

## Where to go next

- **[Overview](/products/composable/overview.md)**: who Composable is for and the problems it solves.
- **[Catalog Integration](/products/composable/catalog-integration.md)**: how Composable uses the Context Catalog as its data source.
