---
id: overview
title: What is P4SaMD?
sidebar_label: What is P4SaMD?
---

**P4SaMD** (Platform for Software as a Medical Device) is the compliance governance platform built by Mia-Care for teams that design, build, and certify medical device software. Version 3 is a complete re-architecture: it runs as a **standalone product** with its own interface, independent of any other software infrastructure.

## What P4SaMD Does

P4SaMD covers the full Software as a Medical Device (SaMD) development lifecycle and aligns it with:

- **EU MDR** (Medical Device Regulation)
- **FDA** regulations for software medical devices
- **IEC 62304**: the leading standard for medical device software development
- **ISO 14971**: risk management for medical devices
- **ISO 13485**: quality management systems for medical devices

Compliance work sits inside the development workflow, so projects stay audit-ready.

## Who Uses P4SaMD?

P4SaMD supports every role in the SaMD development lifecycle:

| Role | How P4SaMD Helps |
|------|-----------------|
| **Software Engineers** | Guided, IEC 62304-compliant development process with structured workflows |
| **Product Owners** | Link product requirements to compliance evidence, track project health, and manage version releases |
| **Project Managers** | Visibility into compliance status, risk posture, and project progress across all products |
| **QA Engineers** | Enforce quality processes, manage test plans, and track verification coverage |
| **Regulatory Affairs** | Manage compliance with ISO 13485, IEC 62304, and ISO 14971; generate documentation for audits and submissions |

## Key Features in v3

| Feature | Description |
|---------|-------------|
| **Requirements Management** | Create and organize software requirements in a hierarchical tree, with lifecycle statuses and full traceability to design and tests |
| **Risk Management** | Identify, assess, and mitigate software risks following ISO 14971, with guided risk estimation and links to control measures |
| **System Design** | Define and document your software architecture with a hierarchical Software Item model, classifying components including SOUPs and AI-based elements |
| **Verification & Validation** | Plan and execute test cases, manage test runs, and collect automated test evidence across unit, integration, and system levels |
| **Brownfield Import** | Onboard existing software projects through a guided wizard, then get an automated compliance gap analysis and remediation plan |
| **Documentation Engine** | Auto-generate Technical File documents (release notes, risk reports, SBOM reports and more) populated with live project data |
| **Version Management** | Create and manage workspace versions with structured release workflows aligned to IEC 62304 |
| **Multi-Tenancy** | One installation serves multiple organizations with complete data isolation between tenants |
| **SDLC Orchestration** | Connect your git provider, CI/CD pipeline, and toolchain to enforce compliance guardrails at the code level |

## What Changed in Version 3

The most significant changes:

| Aspect | Version 2 | Version 3 |
|--------|-----------|-----------|
| **Deployment** | Embedded in Console (shared infrastructure) | Standalone platform with dedicated UI |
| **Authentication** | Single Sign-On with Console | Federated OIDC authentication, independent identity provider |
| **Tenancy** | Single-tenant per instance | Multi-tenant: one installation serves multiple organizations |
| **Work-Item Management** | Required external ALM (Jira mandatory) | Native work-item management built in; external ALMs are optional |
| **Project Scope** | One project per instance | Multiple projects per organization |
| **Self-Service** | Mia-Care configures on your behalf | Organizations configure themselves through the admin portal |

## Deployment Options

P4SaMD v3 supports three deployment models:

- **Multi-Tenant SaaS**: fully managed, shared cloud deployment with logical data isolation between organizations. Zero infrastructure to manage.
- **Dedicated SaaS**: dedicated cloud infrastructure per customer, for organizations that require physical database separation while keeping SaaS operational simplicity.
- **On-Premise**: self-hosted deployment for complete data sovereignty, air-gapped network support, and custom infrastructure requirements.

All three deployment models provide the same feature set.

## Integrations

- **Git providers**: GitHub, GitLab (for source control and automated evidence collection)
- **CI/CD**: Jenkins, GitHub Actions, GitLab CI (for automated test result ingestion)
- **ALM tools**: Jira and others (optional bidirectional sync, no longer mandatory)
- **eQMS systems**: connect to your quality management system for document access

## Next Steps

- [Get started with P4SaMD →](./handbook/getting_started.mdx)
- [Read the FAQ →](./faq.mdx)
- [See what's new in v3 →](./release-notes/v3.0.mdx)
