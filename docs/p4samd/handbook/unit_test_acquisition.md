---
id: unit_test_acquisition
title: Automatic Unit Test Report Acquisition
sidebar_label: Automatic Test Acquisition
---

# Automatic Unit Test Report Acquisition

Instead of uploading unit test reports by hand, a software item with a linked git repository can pull them in automatically from your CI pipeline, on a schedule or on demand.

## Setting up a source

Automatic acquisition is configured per software item, as an opt-in addition to its repository link:

1. Open the software item's **Add Git Repository** dialog (or edit its existing link) and link it to a reachable repository.
2. Switch on **Enable automatic test ingestion**.
3. Choose the **Provider**: **GitLab** or **GitHub Actions**. These are the only two supported; the option stays unavailable until the repository URL above resolves to one of them.
4. Enter the **Artifact name**: the name of the GitLab CI job, or the GitHub Actions artifact, whose output holds the JUnit report. This is required.
5. Optionally set a **Branch** to pull from. Leave it blank to use the repository's default branch.
6. Set a schedule (see below), then save.

P4SaMD always reads the first matching report file it finds in the job's or artifact's output; there is currently no way to point it at a specific file path yourself.

You can also configure or change these settings later from **Repository health** (below), which opens the same dialog.

## Choosing a schedule

A source pulls on one of two cadences, shown and set in your own local time:

- **Daily**: runs once a day, starting from a time you choose.
- **Weekly**: runs on the day or days of the week you choose, at a time you choose.

Change the schedule at any time from Repository health, or trigger a pull immediately regardless of the schedule (see below).

## Repository health

Open **Repository health** from the Verification page to see every software item in the project that has a repository linked, whether or not automatic acquisition is configured for it yet. Search by name, URL, or software item, and filter by:

- **Status**: Enabled, Paused, Auto-disabled, or No automatic schedule.
- **Access**: Public or Private.
- **Condition**: Reachable, Unreachable, or Not checked yet.

Each row shows the item's current status, its last attempt and outcome, and when it's next due to run. From a row you can:

- **Trigger acquisition now**: pull immediately, outside the schedule. Unavailable until a source is configured, and while a source is auto-disabled (re-enable it first).
- **Set up automatic acquisition** / **Configure automatic schedule** / **Pause automatic schedule** / **Resume automatic schedule**: the available action depends on the row's current state.
- **Edit git repository**: change the repository link and its acquisition settings together.
- **Delete**: removes the automatic acquisition configuration only. Reports already pulled through it are not affected.

## When a source stops pulling automatically

A source is automatically disabled after too many consecutive failed attempts, so a broken credential or a renamed CI job doesn't keep failing silently. The row shows why the last attempt failed — Repository unreachable, Credential rejected, Report invalid, No report found, or Internal error — so you know what to fix. Once it's fixed, **re-enable** the source from Repository health to resume pulling.

## How an acquired report is attributed

A report pulled in automatically shows **"Acquired automatically on \{date\}"** on its run detail page, instead of the usual **"Uploaded on \{date\} by \{name\}"** — there is no person to attribute it to.

## Reviewing what changed since the last run

When a run is ingested for a software item that already has a previous run in the same workspace version, its detail page compares the two and flags what changed:

- **Removed**: a test case present in the previous run but missing from this one is listed in a banner and must be **acknowledged**, one by one, before the run can be approved or submitted for approval.
- **Rename / move candidates**: a test case that looks like it may have been renamed or moved rather than deleted and re-added can be **confirmed** — carrying its identifier, traceability links, and approval state forward — or **rejected**, in which case it's treated as two independent test cases (one removed, one added).

A test case that's genuinely new is simply marked **New** in the test list; it needs a traceability link like any other test case, but doesn't require a separate review step here.
