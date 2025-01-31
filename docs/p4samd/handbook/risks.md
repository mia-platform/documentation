---
id: risks
title: Risks
sidebar_label: Risks
---

# **Risks**  

## **Overview**  
The Table provides an overview of potential issues identified in the **P4SaMD** project. Each row in the table represents a **P4SaMD Risk entity in Jira**.  
The risks displayed in the table originate from **Jira**, where they are created, updated, and edited. The table dynamically reflects any changes made in Jira, ensuring up-to-date risk assessment.  

## 1. **Table**  

- **Title**: A brief description of the identified risk and a link to the Jira Issue represented by its Key.  
- **Suggestions**: The number of suggestions related to the risk. Visit [Insight & Suggestions](./insight_and_suggestions) 
- **Probability**: A numerical value indicating the likelihood of the risk occurring.  
- **Severity**: A numerical value representing the potential impact of the risk.  
- **Risk Level**: A classification based on probability and severity. [Levels](#levels)
- **Residual Risk**: The remaining level of risk after mitigation measures are applied. [Levels](Levels)
- **RCM**: A number of risk control measures that mitigate the risk.
- **Software Items**: The number of software items affected by the risk.  
- **Changes**: The number of modifications applied to the risk.  

## 2. **Drawer**  
Clicking on a row opens a **drawer** displaying detailed information about the selected risk. <br/>
The drawer shows risk related information into three tabs:

**Details**: Beyond the information displayed in the table, it shows:
   - **Description**: A paragraph describing the risk.
   - **Hazard**: The nature of the risk and its potential consequences.  
   - **Sequence of events**: The conditions leading to the risk.  
   - **Hazardous situation**: The specific scenario in which the risk could occur.  
   - **Harm**: The expected negative impact.  
   - **Probability notes**: Notes about probability.
   - **Mitigated probability**: A number indicating how much the **RCM** mitigates probability.
   - **Mitigation severity**: A number indicating how much the **RCM** mitigates severity.

**Traceability**: Shows the linked issues of the risk grouped by:
   - **[Software Items](./software_items)**
   - **Risk Control Measures**
   - **[Changes](./changes)**

**Suggestions**: Shows related suggestions of the risk.

## Levels

|Visual Representation|Range|
|:--------:|:-------:|
|![alt text](img/risks_very_high.png)| ≤ 15 | 
|![alt text](img/risks_high.png)| 11 ≤ **value** ≤ 15|
|![alt text](img/risks_medium.png)| 6 ≤ **value** ≤ 10|
|![alt text](img/risks_low.png)| ≤ 5|