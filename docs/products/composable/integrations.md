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

Change management usually lives in an ITSM such as ServiceNow or Jira Service Management, and it is rarely something a team can replace. Composable integrates with the ITSM you already have, so your existing change process stays in place and the Solution lifecycle feeds into it.

Each state of a Solution's lifecycle can trigger operations towards the ITSM. For example, when a Solution moves along its approval steps, a change request can be opened automatically, carrying the requester, a readable description of the changes, the exact differences, and a link back to the visual topology.

Approvals can be given directly in Composable, which then updates the change request in the ITSM to record the outcome. Later states can update or close the ticket when the change is released.

This way the ITSM stays up to date without anyone having to work in it. It remains the register for compliance and auditing, and it is still available whenever you need to read the full record of a change.

## GitOps and Infrastructure-as-Code

Composable does not call cloud provider APIs. It connects to the Git workflow and the Infrastructure-as-Code tooling your Platform Team already maintains, which remain the only authority over provisioning.

When a change is submitted for approval, Composable turns it into declarative configuration files and opens a merge request on the configuration repository. Approving the change in Composable is the green light for that merge request. When the change is released, the merge request is merged to the main branch, which triggers your CI/CD pipeline: it validates, plans, and applies the change with Infrastructure-as-Code tools such as Terraform.

## Cloud connectors

After provisioning, connectors for cloud providers and runtime platforms discover what was actually created, such as identifiers, network addresses, and final configuration. They update the Catalog from the provisional state to the active one.

Since Composable reads from the Catalog, what you see in the topology reflects the infrastructure that is really running. Depending on how the connectors are configured, they can keep the Catalog aligned continuously, so the topology stays up to date as the infrastructure changes.

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
