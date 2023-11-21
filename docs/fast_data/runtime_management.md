---
id: runtime_management
title: Runtime Management
sidebar_label: Runtime Management
---

# Runtime Management Documentation

## Introduction

Welcome to Runtime Management – your tool for achieving better control over the Fast Data environment during runtime. This platform empowers you to dynamically manage the execution of Fast Data, offering functionalities to pause and resume microservices effortlessly. Dive into the world of streamlined runtime control and take charge of your Fast Data deployment with ease.

## Overview

Runtime Management is an integral part of the Mia Platform, specifically designed to facilitate the runtime deployment of Fast Data. It provides a user-friendly web interface and robust backend functionalities to enhance your control over the Fast Data microservices environment.

### Requirements

To ensure a smooth setup and operation of Runtime Management, make sure you've completed the following tasks:

1. **Set Up Fast Data Environment in Console:**
   - Ensure that you have configured a Fast Data environment in the Mia Platform Console, defining the microservices and their runtime configurations.

2. **Configure Kafka Topic for Action Commands:**
   - Set up a Kafka topic dedicated to receiving action commands. This ensures seamless communication between Runtime Management and the Fast Data microservices.

3. **Create Control Plane Application in the Console:**
   - Create a Control Plane application in the Mia Platform Console, allowing Runtime Management to integrate with your Fast Data deployment.

4. **Configure Control Plane Application with Config Map:**
   - Follow the [Control Plane application documentation](#link-to-control-plane-app-docs) to configure the Control Plane application with a Config Map. This step is crucial for linking Runtime Management with your specific Fast Data setup.

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
  - **Resource Type:** Specify whether the command affects 'data' or 'events', influencing Fast Data's business logic.
  - **Resource Name:** Enter the name of a specific resource to pause or resume.
  - **Runtime:** Select a target runtime environment for executing the commands.

- **Log Panel (Right):**
  - After submitting the form, a Kafka message representing the command is sent to the topic.
  - The Monaco editor panel on the right displays the log of the sent command, providing visibility into the executed actions.

#### Sending a command

Before you initiate a command using Runtime Management, take a moment to understand the process. Sending a command involves a few key steps to ensure precision and effectiveness in controlling your Fast Data runtime.

1. **Method Selection:**
   - Choose the 'resume' command from the Method dropdown.

2. **Resource Type:**
   - Specify whether the command affects 'data' or 'events', influencing Fast Data's business logic.

3. **Resource Name:**
   - Enter the name of a specific resource to resume.

4. **Runtime Selection:**
   - Select the target runtime environment for executing the resume command.

5. **Submit:**
   - Press the submit button to send a Kafka message representing the resume command to the dedicated topic.

This straightforward process allows you to seamlessly communicate your command to the Fast Data microservices, bringing them back to active operation. Explore the power of precise control with Runtime Management!

---

Now, you're equipped with the knowledge to efficiently manage Fast Data during its runtime using the intuitive Runtime Management system. Happy controlling!

Note: For detailed configuration information, check the [Control Plane documentation page](#link-to-control-plane-docs).
