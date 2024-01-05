---
id: jira
title: Jira Project
sidebar_label: Jira Project
---

## Version
For each project, the release are managed by the **Fix Versions** field. In the *Release* section of Jira project, the versions can be managed through: start date, release date and the description field. 
:::danger
Make sure to have created at least one Version before creating an issue for the project, so that the new-created issue can be linked to the correct version filling up the Fix Versions field. For more details about the Fix Versions, see the issue sections written below.
:::
 
:::info
**Description** field is meant to be used to report potential breaking changes. This will be reported in the [Release Note](#release-note).
:::
 

## Software Item
The Software Items composing the system software can be inserted as Components in the project side menu. 
:::info
**Description** 
This field is meant to report the software item classification: specify *Class A*, *Class B* or *Class C* to tag them.
:::

## Requirements
In the requirement collection phase of the project, each requirement can be reported as Requirement SaMD in the Jira tool. 
### Required fields
* Summary
* Fix Versions: is fundamental to collect all the requirements referring to a specific version of your software product. 
* Desciption: plain text to describe the requirement
* Components: to indicate the software item related to the requirement. See [Software Item](#software-item) section to find out more details
* Input (functional/cybersecurity/privacy/infrastructure/design): the classification of requirement in

### Other fields
* Labels: adding the *RCM* label to classify the requirement as Risk Control Measure
* Attachment: can store file, images and others. At the moment, not visibile in P4SaMD dashboard
* Assignee: keeps track of the person who is in charge of the issue at that moment
* Reporter: the user-account who opens the issue
* Mock-up status: tracks the progress of the mock-up
* Mock-up reference
* Approval date: it is meant to track the date of requirement final definition. After that date the development can start
* Epic Link or Parent: referring to a possible grouping of issues by epic
* External Id: if needed, it is used to store a different ID with respect to the ones automatically generated
* Priority: you can use this field to organize the requirement priority of implementation or testing
* User: groups of user in the product. Such as physician, patient, etc
* Project stream: additional information to specify the stream, not directly bound to software items
* Sold: additional information to specify
* Note

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Story*            | Requirement *is implemented by* |  |
| *Test SaMD*            | Requirement *is tested by Test SaMD* | |
| *Risk SaMD*            | Requirement *is affected by Risk* | In case of Requirement which is a Risk Control Measure|

A Requirement can assume those stati: 
* DRAFT
* WAITING FOR APPROVAL
* IN PROGRESS
* CLOSED
* STAND-BY


> **Tips**: you can set a TBD version to collect all the requirements and in following stages differentiate them in different versions of the software. See the [Fix Versions](#fix-versions) for further details.

## Risks
Segregation: il razionale sulla segregazione è necessario per giustificare la diversa classe di rischio di software items che derivano dalla decomposizione di un software item o software system
### Required fields
* Summary
* Fix Versions: is fundamental to collect all the risks referring to a specific version of your software product. 
* Hazard: potential source of HARM
* Sequence of events: which can lead from the hazard to the hazardous situation 
* Hazardous situation: circumstance in which people, property or the environment are exposed to one or more hazards
* Harm: physical injury of people or properties involved in the product usage
* Risk type: classified in 
    * SaMD: risks concerning the usage of SaMD 
    * privacy: GDPR-related risks about user data
    * project: general risks related to the project management, for example
* Probability P: given by the combination of P1 *probability of occurrence of the sequence of events* and P2 *probability of the occurrence of hazardous situation leads to harm*
* Probability notes: tracks the rationale for P definition
* Severity S: the severity of the harm
* Calculated Risk PxS: *automated field* calculating the risk, given by Probability x Severity. See the [Automation section](#automation) for more details
* Risk Control Measure RCM: description of RCM to be applied
* Mitigated Probability mP: Resulting probability mP after application of RCM
* Mitigated Severity mS: Resulting severity mS after application of first RCM
* Residual Risk mP * mS: *automated field* calculating the risk, given by Probability x Severity. See the [Automation section](#automation) for more details
* Components: refers to the related software item

### Other fields
* Risk Environment:
* Risk Category
* Linked Issues: used the *affect Requisement* binding to link the related RCM(s) which mitigate the risk
* Assignee: keeps track of the person who is in charge of the issue at that moment
* Reporter: tracks who opened the issue
* Labels: arbitrary labels can be set for further risk classification
* Due date
* Attachment
* Note

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Requirement*            | Risk *affects Requirement* |  In case of Requirement which is a Risk Control Measure |

A Risk can assume those stati: 
* 


## Test 
The test issues allow to keep track the verification and report the steps to be executed by the tester. 
### Required fields
* Summary: reporting the title of the test
* Description: tracks the steps to be followed to execute the test and the expected results. In version P4SaMD 0.1.0, the desciption has to be plain text. 
* Fix Versions: is fundamental to collect all the tests referring to a specific version of your software product. The test can refers to different project version, so  it's possibile to attribute more Fix versions in a test. 
* Components: to indicate the software item related to the test. See [Software Item](#software-item) section to find out more details
* Test type: indicates the type of test based on IEC 62304 classification and additional labels
### Other fields
* Project stream: specifies the stream whom the test belongs to, it can be a further arbitrary classification
* Epic Link or Parent: referring to a possible grouping of issues by epic 
* User: arbitrary label to classify the test based on the system user role who performs the test 
* Assignee: keeps track of the person who is in charge of the issue at that moment
* Reporter: tracks who opened the issue
* Note: eventual note needed for the tester
* Labels: arbitrary labels can be set for further test classification

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Requirement*            | Test SaMD *tests Requirement* |   |


A Test can assume those stati, tracking the definition of test: 
* TO DO
* IN PROGRESS
* CLOSED
* DEPRECATED
 


## Execution Test 
The test issues allow to keep track the verification and report the steps to be executed by the tester. 
To create an Execution test, click on the automation test next to the status button, choose the *SaMD: Execution test - Creation* automation to generate the execution of the selected test. At the end, it will be linked properly with the reference Test.  
> It is important to check if the Fix Verisons reports the correct version of the product to be tested. The Test SaMD can collects multiple Fix Versions, while the execution refeers to a specific version.  

### Required fields
* Summary: reporting the title of the test
* Description: tracks the steps to be followed to execute the test and the expected results. In version P4SaMD 0.1.0, the desciption has to be plain text. 
* Fix Versions: is fundamental to report the tested version, just one Fix Version needs to be set in this field. 
* Components: to indicate the software item related to the test. See [Software Item](#software-item) section to find out more details
* Test type: indicates the type of test based on IEC 62304 classification and additional labels
* Assignee: keeps track of the tester
* Reporter: tracks who opened the issue
* Execution datetime: reports *automatically* the execution date and time, when the tester set the Failed/Success status. It can also be changed, if needed, by the tester.

### Other fields
* Sprint: useful to plan the execution inside a sprint
* Project stream: specifies the stream whom the test belongs to, it can be a further arbitrary classification
* Epic Link or Parent: referring to a possible grouping of issues by epic 
* User: arbitrary label to classify the test based on the system user role who performs the test 
* Note: eventual note needed for the tester
* Labels: arbitrary labels can be set for further test

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Test SaMD*            | Execution Test *executes Test SaMD* |   |


A Execution test can assume those stati, tracking the execution of the test: 
* TO DO
* IN PROGRESS
* SUCCESS
* FAILED

> **Tips** Use the Note field to track the causes of failure or possible notes

## Change
The Change Request SaMD is the issue that reports a request of change, independently on the source (client or internal request). Change Request SaMD could be improvement, new featureor bug fix.
### Required fields
* Summary
* Fix versions
* Description
* Components
* Approval date
* Classification
* Affected Version: the version of the SaMD which is requested to be changed

### Other fields
* Project stream
* Attachment
* Reporter: tracks who opened the issue
* Assignee: keeps track of the person who is in charge of the issue at that moment
* Due date
* Priority
* Acceptance test: potential note about the acceptance criteria of the change request
* Planned Version: *field to be deprecated*
* Note
* Environment: useful when more information about the environment of the request are needed

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Requirement*            | Change SaMD *changes Requirement* |  keeps track of the requirement which is affected, deprecated or generated by the change |
 

A Change can assume those stati, tracking the progression of a request of change for the product,  of the test: 
* REPORTED
* ANALYSIS
* STAND-BY
* REFUSED
* PLANNED
* IN PROGRESS
* COMPLETED

:::info
**Related Requirements**
The changes can be link to
* 2 Requirements when one is no longer valid (status: DEPRECATED, Fix Versions: a previous one with respect to the Fix Version of the change) and the other one is new (status: not depracated, e.g. DRAFT and Fix Versions: the same of the current Change) 
* 1 new Requirement when the change add a requirement to the current version (Fix Versions: the same of the current Change) or 1 deprecated Requirement if the change deletes the requirement in the current version
:::


## Automation
### SaMD: Execution test - Creation
The automation clones a Test SaMD in a different type of iissue, Execution test. All the field are copied in the new issue, includinge the Fix Verision.

:::danger
**Fix Verisions**
The field can reports multiple Fix Versions for Test, but only **one** Fix Versions has to be set for each Execution test. 
Make sure to have just one Fix Versions for each execution.  
:::