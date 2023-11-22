---
id: runtime_management
title: Runtime Management
sidebar_label: Runtime Management
---

# Runtime Management Documentation

Welcome to Runtime Management – your tool for achieving better control over the Fast Data environment during runtime. This platform empowers you to dynamically manage the execution of Fast Data, offering functionalities to pause and resume microservices effortlessly. Dive into the world of streamlined runtime control and take charge of your Fast Data deployment with ease.

## Overview

Runtime Management is an integral part of the Mia Platform, specifically designed to facilitate the runtime deployment of Fast Data. It provides a user-friendly web interface and robust backend functionalities to enhance your control over the Fast Data microservices environment.

With Runtime Management, users gain the ability to govern potentially every aspect of the Fast Data runtime. Currently, this powerful mechanism is supported in the Single View Creator, offering more than just the suspension of Single View generation on MongoDB.

### Key Features and Benefits

- **Flexible Control:** govern the execution of Fast Data microservices with fine-grained control, allowing for strategic management of the runtime environment.

- **Enhanced Performance and Consistency:** utilize Runtime Management to optimize performance and ensure data consistency. For example, start the ingestion of a massive data system into the Fast Data environment. Only after the ingestion process is complete, initiate the processing of updates from the Real Time Updater (and the Single View Trigger Generator if active) to generate Single Views. This sequential approach enhances performance and data consistency.

- **Strategic Ingestion:** achieve better performance and consistency of data by strategically managing the ingestion process, aligning it with the broader data processing pipeline.

### Useful Scenarios

Explore the diverse scenarios where Runtime Management can bring significant benefits to your Fast Data deployment:

#### 1. Optimizing Data Processing Pipelines

- Pause the Single View Creator during high-load data ingestion to ensure optimal system performance. Resume processing once the ingestion is complete to generate views efficiently.

#### 2. Sequencing Real-Time and Batch Processing

- Use Runtime Management to sequence the execution of real-time and batch processing components. Pause real-time processing during large batch ingestion, then resume for a balanced data processing approach.

#### 3. Performance Testing and Simulation

- Simulate different scenarios for performance testing by pausing and resuming microservices. Observe system behavior under various conditions to identify bottlenecks and optimize resource allocation.

#### 4. Data Consistency Assurance

- Maintain data consistency by pausing the Single View Creator during critical updates to underlying databases. Resume processing after updates to ensure Single Views reflect the most recent and accurate data.

#### 5. Strategic Resource Allocation

- Dynamically allocate resources by pausing and resuming microservices based on workload and resource availability. Efficiently utilize computing resources and prioritize critical processes during peak demand.

#### 6. Enhanced System Reliability

- Gracefully handle unexpected situations or system maintenance by pausing specific microservices. Resume operations post-maintenance to minimize downtime and enhance overall system reliability.

### Requirements

**TODO** notes:
- the minimum setup needed is the persistence on which to save the state. this alone allows the application of the control plane to be up and running.
- if you want to enable thye communication with one runtime of Fast Data, you need to configure a runtime environment, particularly specifying one topic for the communication. We suggest using a topic with partition 0.

To ensure a smooth setup and operation of Runtime Management, make sure you've completed the following tasks:

1. **Set Up Fast Data Environment in Console:** ensure that you have configured a Fast Data environment in the Mia Platform Console, defining the microservices and their runtime configurations.

2. **Configure Kafka Topic for Action Commands:** set up a Kafka topic dedicated to receiving action commands. This ensures seamless communication between Runtime Management and the Fast Data microservices.

3. **Create Control Plane Application in the Console:** create a Control Plane application in the Mia Platform Console, allowing Runtime Management to integrate with your Fast Data deployment.

4. **Configure Control Plane Application with Config Map:** follow the [Control Plane application documentation](#link-to-control-plane-app-docs) to configure the Control Plane application with a Config Map. This step is crucial for linking Runtime Management with your specific Fast Data setup.

### What You Can Do

Explore the capabilities of Runtime Management by executing specific commands tailored to your Fast Data environment.

#### Pause

Temporarily halt the consumption of messages by the Single View Creator microservice. This feature provides you with the flexibility to freeze specific aspects of your Fast Data runtime. Here's how you can use it:

#### Resume

Restart the consumption of Projection Changes messages by the Single View Creator, bringing Fast Data back to active operation. Here's how you can use it:

### Interacting with the Frontend

To interact with Runtime Management, access the web user interface provided by the Control Plane application. Once configured in Console, you can navigate to the frontend using the link generated in the Endpoints section.

The frontend is divided into two sections:

- **Form Section (Left):**
  - **Method:** Choose between 'pause' and 'resume' commands.
  - **Resource Name:** Enter the name of a specific resource to pause or resume.
  - **Runtime:** Select a target runtime environment for executing the commands.

- **Log Panel (Right):**
  - After submitting the form, a Kafka message representing the command is sent to the topic.
  - The Monaco editor panel on the right displays the log of the sent command, providing visibility into the executed actions.

#### Sending a command

Before you initiate a command using Runtime Management, take a moment to understand the process. Sending a command involves a few key steps to ensure precision and effectiveness in controlling your Fast Data runtime.

1. **Method Selection:** Choose the 'resume' command from the Method dropdown.

2. **Resource Name:** Enter the name of a specific resource to resume.

3. **Runtime Selection:** Select the target runtime environment for executing the resume command.

4. **Submit:** Press the submit button to send a Kafka message representing the resume command to the dedicated topic.

This straightforward process allows you to seamlessly communicate your command to the Fast Data microservices, bringing them back to active operation. Explore the power of precise control with Runtime Management!

---
Now, you're equipped with the knowledge to efficiently manage Fast Data during its runtime using the intuitive Runtime Management system.

Note: For detailed configuration information, check the [Control Plane documentation page](#link-to-control-plane-docs).