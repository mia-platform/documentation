---
id: overview
title: Composable Overview
sidebar_label: Overview
---

:::caution Beta

Composable is in **beta**. We are actively shaping the product, so things may change as we iterate. Your feedback is welcome.

:::

# Composable Overview

**Composable** is Mia-Platform's visual authoring tool for infrastructure topology. Instead of filling in static request forms or opening tickets, you compose your architecture on an interactive graph, review exactly what changes compared to what is running, and release the change through the approval and automation processes your organization already has.

Composable separates two concerns that traditional portals mix together:

- **Intent**: what the infrastructure should look like, designed visually by developers and platform teams.
- **Execution**: how that intent becomes real resources, delegated to your existing CI/CD and Infrastructure-as-Code pipelines.

The state of everything you design lives in the [Context Catalog](/products/catalog/overview.md), which is the data source of Composable. See [Catalog Integration](/products/composable/catalog-integration.md).

## Who it is for

Composable is for anyone who deals with infrastructure resources, typically:

- **Developers**, who need to describe and request the infrastructure their applications run on, without leaving their tools.
- **Platform Engineers**, who publish the standards, building blocks, and guardrails that teams reuse.
- **DevOps engineers**, who review changes, follow them through approval and delivery, and keep the real infrastructure aligned with the design.

You can use Composable from its web interface, through its API, and through an MCP server, like every Mia-Platform product. See [Integrations](/products/composable/integrations.md).

## The problems it solves

- **Forms and tickets without context.** Request portals ask for one isolated resource at a time. Composable shows the whole system and the relationships between its parts.
- **Colliding changes.** When many teams change the same infrastructure, tickets and manual hand-offs lead to conflicts. Each change in Composable lives in its own isolated workspace.
- **Changes you cannot see.** Before releasing, you see a visual comparison between the proposed topology and the current one: what is created, modified, or removed.
- **Compliance after the fact.** Rules and maturity levels are checked while you design, so problems are fixed before deployment instead of in a later audit.
- **Tool hopping.** Approvals, change records, and automation are connected behind the scenes, so people work in one place.

## Key concepts

:::note

**System** and **Solution** are the default names of these concepts. They can be customized for your deployment, so your interface may use different terms.

:::

- **System.** The topology of one application or service: compute, storage, databases, deployment pipelines, network perimeters, and the dependencies between them. It holds the current, authoritative state and cannot be edited directly.
- **Solution.** An isolated workspace for a change, similar to a branch in source control. A Solution groups one or more Systems, so a change that crosses several application domains is designed and reviewed together. Nothing affects the real infrastructure until the change is approved and released.
- **Canvas.** The editor where you work: resources are typed nodes, relationships are directional edges, and layers group them by cloud provider, network perimeter, or architectural tier. A side panel validates the properties of the selected node as you type.
- **Component.** The blueprint of a single resource, such as a Kubernetes cluster, a managed database, a storage bucket, or a source code repository. It defines the fields to fill in, their defaults and constraints, and a lifecycle (from draft to retired).
- **Model.** A pre-assembled pattern of components and relationships. Dragging a model onto the canvas creates a whole, consistent architecture in one step, following your organization's golden paths.
- **Relationship type.** The meaning of a connection, such as *deploys to* or *depends on*, together with which components may be linked by it. This prevents invalid architectures at design time.

## How it works

1. **Open a Solution** on one or more Systems. Composable creates an isolated copy of each System to work on.
2. **Compose on the canvas.** Add components or models, configure them, connect them, and remove what is obsolete.
3. **Review the diff.** See what has been created, changed, and removed compared to the current state.
4. **Get it approved.** The change moves through the approval steps of your organization, and the matching change record is opened in your ITSM automatically.
5. **Release.** The approved change is merged into the System and the declarative configuration is handed to your GitOps pipeline, which provisions the infrastructure.
6. **Reconcile.** Connectors read back what was really created, so the Catalog reflects reality and drift is detected.

## Where to go next

- **[Catalog Integration](/products/composable/catalog-integration.md)**: how Composable uses the Context Catalog as its data source.
- **[Integrations](/products/composable/integrations.md)**: ITSM, GitOps, cloud connectors, webhooks, API, and MCP.
