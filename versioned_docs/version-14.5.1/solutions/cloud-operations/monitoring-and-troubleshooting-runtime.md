---
id: monitoring-and-troubleshooting-runtime
title: Monitoring and Troubleshooting Runtime with Mia-Platform Console
sidebar_label: Monitoring and Troubleshooting Runtime
---

### The Scenario

An online retail platform experiences intermittent performance issues during peak traffic hours. The CloudOps team struggles to quickly identify the root cause because they have to manually sift through logs from multiple microservices and correlate events across different systems.

### The Challenge

* **Reactive Troubleshooting**: Problems are often reported by users before the Ops team is even aware of them. The team lacks a proactive way to monitor the health of the system.
* **Slow Root Cause Analysis**: When an issue occurs, the team has to SSH into different machines or use multiple `kubectl` commands to get logs from various pods. This process is slow, cumbersome, and requires deep Kubernetes expertise.
* **Information Silos**: Metrics are in one system (Grafana), logs are in another (ELK stack), and Kubernetes events are accessed via the command line. Correlating information between these systems is a manual and time-consuming task.
* **High Mean Time to Resolution (MTTR)**: The combination of these factors leads to a high MTTR, meaning services stay degraded for longer, impacting customer experience and revenue.

### The Solution with Mia-Platform

The CloudOps team starts leveraging the **Runtime Area** of **Mia-Platform Console** as their primary tool for monitoring and troubleshooting.

1.  **Centralized Health Dashboard**: The team uses the **Pods** view in the Runtime Area as their main health dashboard. They can see at a glance the status of every pod in a specific environment. The color-coded status indicators (e.g., `OK`, `Warning`) immediately draw their attention to pods that are in a crash loop, pending, or have containers that are not ready.

2.  **Real-Time Log Streaming**: During a period of high traffic, they notice a pod for the `payment-service` turning to a `Warning` state due to frequent restarts. Instead of using `kubectl`, the operator simply clicks on the pod's name directly in the Console.
    * They navigate to the **Logs** tab and can immediately stream the logs from the failing container. They discover a recurring `OutOfMemory` error in the logs.

3.  **Inspecting Pod Events**: To understand why the pod is being killed, they switch to the **Events** tab for that pod. They see a series of events from the Kubernetes scheduler indicating that the pod was terminated due to exceeding its memory limit.

4.  **Rapid Remediation**: Having identified the root cause in minutes, the team takes immediate action.
    * They navigate back to the **Design Area** of the Console.
    * They find the `payment-service` microservice and go to its configuration.
    * They increase the **Memory Limit** for the service from `150Mi` to `300Mi`.
    * They save the configuration and trigger a deploy to the production environment.

5.  **Verifying the Fix**: After the deploy is complete, they return to the **Runtime Area**. They see the new `payment-service` pod running in a healthy `OK` state. They continue to monitor its resource usage and confirm that the `OutOfMemory` errors have stopped.

### The Outcome

* **Drastically Reduced MTTR**: The team was able to identify, diagnose, and resolve a production issue in under 15 minutes, a process that previously could have taken hours.
* **Proactive Monitoring**: The centralized dashboard allowed them to spot the issue as it was happening, before it caused a major outage.
* **Democratized Troubleshooting**: Even junior operators who are not `kubectl` experts can now effectively troubleshoot issues. All the necessary information (pod status, logs, events) is available in an intuitive UI.
* **Integrated Workflow**: The team seamlessly moved from monitoring (Runtime Area) to configuration management (Design Area) and back, all within the same platform, creating a highly efficient feedback loop.

The Runtime Area of Mia-Platform Console has become the mission control center for the CloudOps team, empowering them to ensure the reliability and performance of their applications proactively and efficiently.
