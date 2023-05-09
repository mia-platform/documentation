---
id: bug_policy
title: Bug policy
sidebar_label: Bug policy
---
## How to report a bug

You can report a bug by writing an email to this [address](mailto:account@mia-platform.eu).

## How we approach bug fixing

Bug fix releases are more frequent than feature releases, and target the most critical bugs affecting customers. The notation for a bug fix release is the final number in the version (the 1 in 6.0.1, for example).

We assess each bug based on the symptom severity (that is, when this bug causes symptoms, how severe are those symptoms). There are three levels of symptom severity.

### Severity 1 - Critical

Your application is unavailable. Users aren't able to perform their job function, and no workarounds are available.

See some examples:  

* login failure affecting all users

* all or most pages don't display

* out of memory errors cause application failure

* significant data loss

* node communication failures

* administration tools fail.

### Severity 2 - Major

A feature is unavailable, application performance is significantly degraded, or users job functions are impaired.

See some examples:  

* the application performs slowly and fails intermittently

* application is functional, but frequently used gadgets or macros don't work

* application links fail

* specific editing features fail

* or a Severity 1 (critical) issue where there is a viable workaround.

### Severity 3 - Minor

The application or specific feature isn't working as expected, but there is a workaround available. Users experience is impacted, but their job function is not impaired.

See some examples:  

* some searches fail

* sections of pages load slowly

* administrative features fail intermittently, but a workaround is available

* visual defects, that don't affect function

* minor translation or localization problems

* keyboard shortcuts not functioning as expected.

Assessing bugs using symptom severity makes sure that we prioritize the most impactful fixes. We give high priority to security issues.

## How to get access to bug fixes

To get access to bug fixes you will need to upgrade to a release that contains the fix.

### Release terminology

To make understanding our bug fix policy easier, here's some definitions.

**Platform release (9.0):**

* Any significant Mia-Platform new functionalities release and for any backwards incompatible.

* Usually a major version is issued per year

* Product Update option grant the right to access a new major version for free

* Without Product Update right client is required to purchase a new license for upgrading to a new major version

* Mia-Platform provides a warranty that critical security patch will be issued for any version up or equal to n-2, where n is last issued major version

**Feature release (9.1.0):**

* Minor version is issued in connection to any functional improvement.

**Bug fix release (9.0.1):**

* Can contain bug fixes, stability and performance improvements. Depending on the nature of the bug fixes they may introduce minor changes to existing features, but do not include new features or high risk changes, so can be adopted quickly

* We recommend regularly upgrading to the latest bug fix release for your current version. These were previously referred to as 'maintenance' releases by most products.
