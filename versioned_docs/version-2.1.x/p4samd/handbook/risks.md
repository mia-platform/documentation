---
id: risks
title: Risks
sidebar_label: Risks
---

# Risks

## Overview

The Table provides an overview of potential issues identified in the **P4SaMD** project. Each row in the table represents a **P4SaMD Risk entity in Jira**.  

The risks displayed in the table originate from the integrated ALM, where they are created, updated, and edited. The table dynamically reflects any changes made in the ALM, ensuring up-to-date risk assessment.

## Table  

- **Title**: A brief description of the identified risk and a link to the Jira Issue represented by its Key.  
- **Suggestions**: The number of suggestions related to the risk. Visit [Insight & Suggestions](./insight_and_suggestions) 
- **Probability**: A numerical value indicating the likelihood of the risk occurring.  
- **Severity**: A numerical value representing the potential impact of the risk.  
- **Risk Level**: A classification based on probability and severity. [Levels](#levels)
- **Residual Risk**: The remaining level of risk after mitigation measures are applied. [Levels](#levels)
- **RCM**: A number of risk control measures that mitigate the risk.
- **Software Items**: The number of software items affected by the risk.  
- **Changes**: The number of modifications applied to the risk.  

### Actions

Under the last column on the table you can perform the following actions:

- **Link Software Items**: by clicking on the link icon, you can link a software item to the risks or unlink an already associated one. The linked software items are displayed in the drawer under the **Traceability** tab.

## Drawer  

Clicking on a row opens a **drawer** displaying detailed information about the selected risk.

The drawer shows risk related information into three tabs: **Details**, **Traceability** and **Suggestions**.

You can navigate between the linked entities - changes, risks and software items - by selecting them under the *Traceability* section in the detailed view.

You can browse back to previous entities by accessing the history menu at the top of the detailed view and selecting the entity of interest.

### Details

Beyond the information displayed in the table, this tab shows:

- **Description**: A paragraph describing the risk.
- **Hazard**: The nature of the risk and its potential consequences.  
- **Sequence of events**: The conditions leading to the risk.  
- **Hazardous situation**: The specific scenario in which the risk could occur.  
- **Harm**: The expected negative impact.  
- **Probability notes**: Notes about probability.
- **Mitigated probability**: A number indicating how much the **RCM** mitigates probability.
- **Mitigation severity**: A number indicating how much the **RCM** mitigates severity.

### Traceability

This tab shows the linked issues of the risk grouped by:

- **[Software Items](./software_items)**
- **Risk Control Measures**
- **[Changes](./changes)**

### Suggestions

This tab shows related suggestions of the risk.

## Levels

|        Visual Representation         |        Range        |
| :----------------------------------: | :-----------------: |
| ![alt text](img/risks_very_high.png) |        ≤ 15         |
|   ![alt text](img/risks_high.png)    | 11 ≤ **value** ≤ 15 |
|  ![alt text](img/risks_medium.png)   | 6 ≤ **value** ≤ 10  |
|    ![alt text](img/risks_low.png)    |         ≤ 5         |