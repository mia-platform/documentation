---
id: pipeline_development_testing
title: Pipeline Development & Testing
sidebar_label: Pipeline Development & Testing
---

This section covers best practices for developing and testing Fast Data v2 pipelines during the development phase, where you can safely experiment and validate your architecture before promoting to production.

## Visualize Fast Data Pipelines while Building Them

During the Fast Data development phase, users can iteratively configure and continuously deploy in the development environment new Fast Data pipeline steps. Control Plane UI will provide the new architecture steps incrementally rendered, offering immediate visual feedback as the pipeline evolves.

## Performance Testing and Simulation

During the Fast Data development phase, users can simulate different scenarios for performance testing by pausing and resuming messages consumption along the pipeline. In this way, user can pause and resume operations to test system behavior under different load patterns before to promote to production.
