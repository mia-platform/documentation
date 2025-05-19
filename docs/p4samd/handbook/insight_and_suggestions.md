---
id: insight_and_suggestions
title: Insight & Suggestions
sidebar_label: Insight and Suggestions
---

P4SaMD ensures compliance with **IEC 62304** rules by analyzing Software Items, Requirements, Risks, and Tests.<br/> It detects inconsistencies and suggests modifications to enhance compliance and reduce risks, streamlining medical software development. The user is guided by suggestions indicating necessary actions to achieve compliance, including mandatory, recommended, and optional improvements.

## Overview

Each suggestion includes:
- **Gravity Check**: 
  - **<span style={{color:'rgba(255, 84, 83, 1)'}}>Error</span>**: Actions that must be performed;
  - **<span style={{color:'rgba(246, 143, 31, 1)'}}>Warning</span>**:  Recommended actions to improve compliance;
  - **<span style={{color:'rgba(24, 144, 255, 1)'}}>Info</span>**: Optional actions to enhance software quality;
- **Issue Resolution**: Users are warned about necessary actions to resolve detected issues;
- **Actionable Guidance**: Clear instructions on what must be done;
- **Standard Reference**: The applicable IEC 62304 requirement, including the paragraph number, title, and explanation.

![Example of a warning suggestion](img/suggestion_example.png)

## Suggestions Rules

For Software Items suggestions, visit the [Software Items](./software_items#4-software-item-drawer) page.

| IEC 62304 Reference Requirement | Title | Description |
|-----------|-----------|----------|
|[**5.7.4**] Evaluate SOFTWARE SYSTEM testing | Missing Tests | Each Requirement must be associated with at least one test. |
|[**5.7.5**] SOFTWARE SYSTEM test record contents | Test not executed | Each Test must be executed at least once to ensure its validity. |
|[**5.7.5**] SOFTWARE SYSTEM test record contents | Missing Information in the Last Execution | The last execution must include all mandatory information. |
|[**7.2.1**] Define RISK CONTROL measures | Missing Risk Control Measures | Risks associated with Software Items of class B or C must be linked to at least one Requirement as a Risk Control Measure. |


## Suggestions Indicators  

Inside tables, two types of icons could appear in the **Suggestions column** to help users quickly identify and navigate suggestions:  


|Icon| Meaning |
|-------|-------|
| ![alt text](img/suggestion_icon_cluste.png) | Indicates that one or more child Software Items have suggestions.<br/> *Only for Software Items.* |  
| ![alt text](img/suggestion_icon_number.png) | Displays the number of suggestions for the entity.<br/> Hovering over this icon reveals a **clickable menu** that directs the user to the **Suggestions Drawer** section. |

By implementing these automated insights and suggestions, P4SaMD empowers users to efficiently manage compliance and enhance software quality.
