---
id: requirements
title: Requirements
sidebar_label: Requirements
---

The section allows users to view requirements created on the integrated ALM and use AI to evaluate them and collect suggestions for improvement according to *IEC 62304*.

![Requirements table](img/requirements_table.png)

In the requirements table you can see an icon indicating the evaluation status of each requirement:

| Evaluation        | Icon | Details |
|-------------------|------|---------|
| Missing           |      |         |
| In progress       |      |         |
| Very low quality  |      |         |
| Low quality       |      |         |
| High quality      |      |         |
| Very high quality |      |         |

## Evaluate requirement with AI

You can assess the conformity of a SaMD requirement to the *IEC 62304* by hovering on the TODO icon in the corresponding row of the table and click on TODO.

The assessment may take a while, usually around a minute, so we process it in the background while you can keep working on P4SaMD.

After the evaluation has been completed, the spinner will assume different colors depending on the evaluation rating and hovering on the icon you can get a preview of the rating assigned by the AI:

TODO Screenshot of modal

The rating provides an overall score, between 0 (lowest quality) and 100 (highest quality), which is the result of the aggregation of four different scores on specific aspects of the requirement:

- **Clarity and Specificity**: if the requirement is clear, detailed and unambiguous;
- **Traceability**: if the requirement is uniquely identified and is linked to risks and software items;
- **Testability and Verification**: if the requirement is easy to test and verify;
- **Completeness**: if the 


