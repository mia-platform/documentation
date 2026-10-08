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
- **Suggestions**: The number of suggestions related to the risk. Visit [Insight & Suggestions](./insight_and_suggestions.md) 
- **Probability**: A numerical value indicating the likelihood of the risk occurring.  
- **Severity**: A numerical value representing the potential impact of the risk.  
- **Status**: the status of the risk (to do, accepted, etc.)
- **Risk Level**: The resulting value of risk obtained by the mutiplication of P and S. [Levels](#levels)
- **Residual Risk**: The remaining level of risk after the mitigation of RCMs, given by the multiplication of Mitigated P and Mitigated S. [Levels](#levels)
- **RCM**: The number of linked risk control measures that mitigate the risk.
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
- **Hazard**: The description of the existing risk.  
- **Sequence of events**: The conditions leading from the risk to the hazardous situation.  
- **Hazardous situation**: The specific scenario in which the risk could occur.  
- **Harm**: The expected damage to the patient.  
- **Probability notes**: Notes and rationale about the probability value.
- **Mitigated probability**: The probability [value](#values) obtained after the application of **RCM**.
- **Mitigated severity**: The severity [value](#values) obtained after the application of **RCM**.

### Traceability

This tab shows the linked issues of the risk grouped by:

- **[Software Items](./software_items.md)**
- **Risk Control Measures**
- **[Changes](./changes.md)**

### Suggestions

This tab shows related suggestions of the risk.

## Levels

|        Visual Representation         |        Range        |
| :----------------------------------: | :-----------------: |
| ![alt text](img/risks_very_high.png) |        ≤ 15         |
|   ![alt text](img/risks_high.png)    | 11 ≤ **value** ≤ 15 |
|  ![alt text](img/risks_medium.png)   | 6 ≤ **value** ≤ 10  |
|    ![alt text](img/risks_low.png)    |         ≤ 5         |

## Values

|        Visual Representation                  |       Range     |
| :-------------------------------------------: | :-------------: |
| ![alt text](img/risk_severity_very_high.png) |       Very High         |
|   ![alt text](img/risk_severity_high.png)    |       High         |
|  ![alt text](img/risk_severity_medium.png)   |       Medium         |
|  ![alt text](img/risk_severity_normal.png)   |       Normal        |
|    ![alt text](img/risk_severity_low.png)    |       Low         |

NB. These probability and severity values are the default configuration of scale: for any custom settings, please contact Mia Care. 
