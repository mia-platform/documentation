---
id: jira
title: Jira Project
sidebar_label: Jira Project
---

# Jira Project

## Version
For each project, the releases are managed by the **Fix Versions** field. In the *Release* section of Jira project, the versions is characterized by: the version name, start date, release date and the description. 
**Version Name** does not allow empty spaces, *e.g. write v0.1.0 instead of v 0.1.0*  
**Description** field is meant to report breaking changes, which will appear in the [Release Note](#release-note).

> **Tip** Make sure to have created at least one Version before creating an issue for the project, so that the new-created issue can be linked to the correct version, filling up the Fix Versions field. For more details, check out thethe following sections for each issue type.


## Software Item
The Software Items composing the system software can be inserted as Components. To add a new Component, go to the side menu in the jira project. 
The **Description** field is meant to classify the software item reporting the following tags *Class A*, *Class B* or *Class C*, defined by the Software Safety Classification.
* *Class A*: No injury or damage to health is possible
* *Class B*: Non-SERIOUS INJURY is possible
* *Class C*: Death or SERIOUS INJURY is possible


## Requirements
In the requirement collection phase of the project, each requirement can be reported as **Requirement SaMD** in the Jira tool. 
### Required fields
* Summary
* Fix Versions: is fundamental to collect all the requirements referring to a specific version of your software product. 
* Description: plain text to describe the requirement
* Components: to indicate the software item related to the requirement. See [Software Item](#software-item) section to find out more details
* Input (functional/cybersecurity/privacy/infrastructure/design): the classification of requirement in

### Other fields
* Labels: adding the *RCM* label to classify the requirement as Risk Control Measure
* Attachment: can store file, images and others. At the moment, not visible in P4SaMD dashboard
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
| *Story*            | Requirement SaMD *is implemented by* |  |
| *Test SaMD*            | Requirement SaMD *is tested by Test SaMD* | |
| *Risk SaMD*            | Requirement SaMD *is affected by Risk* | In case of requirement which is a Risk Control Measure|

A Requirement SaMD can assume those states: 
* DRAFT 
* WAITING FOR APPROVAL
* IN PROGRESS
* CLOSED
* STAND-BY


## Risks
The Risk SaMD issues are meant to collect all the risks of the project, individuated during the risks analysis phase. 
Initially inserted starting from the intended use of the Medical Device, then they can be related to the specific Software Item (Component) which the risk refers to. 

### Required fields
* Summary: the title of the risk
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
* Components: to indicate the software item related to the risk. See [Software Item](#software-item) section to find out more details

### Other fields
* Risk Environment:
* Risk Category
* Linked Issues: used the *affect Requirement* binding to link the related RCM(s) which mitigate the risk
* Assignee: keeps track of the person who is in charge of the issue at that moment
* Reporter: tracks who opened the issue
* Labels: arbitrary labels can be set for further risk classification
* Due date
* Attachment
* Note

| Linked Issues | Issue link to be used | Note |
|-----------------|--------------|--------------|
| *Requirement SaMD*            | Risk *affects Requirement* |  In case of requirement which is a Risk Control Measure |

A Risk can assume those states: 
* TO DO
* MITIGATION NEEDED
* ADDITIONAL MITIGATION NEEDED
* ACCEPTED 
* TO BE DEPRECATED 
* DEPRECATED
* TRANSFER


## Test 
The Test SaMD issues allow to keep track the verification and report the steps to be executed by the tester. This issue report just the instructions, while the execution of the tests are tracked by the Execution test SaMD. For more details and instructions to create new execution test, see the [Execution Test](#execution-test) section.   

### Required fields
* Summary: reporting the title of the test
* Description: tracks the steps to be followed to execute the test and the expected results. In version P4SaMD 0.1.0, the description has to be plain text. 
* Fix Versions: is fundamental to collect all the tests referring to a specific version of your software product. The test can refers to different project version, so  it's possible to attribute more Fix versions in a test. 
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
| *Requirement SaMD*            | Test SaMD *tests Requirement* |   |


A Test SaMD can assume those states, tracking the definition of test: 
* TO DO
* IN PROGRESS
* CLOSED
* DEPRECATED
 


## Execution Test 
The test issues allow to keep track the verification and report the steps to be executed by the tester. 
To create an Execution test, click on the *automation* button next to the status button and select the *SaMD: Execution test - Creation* automation. At the end of the automation process, the new-created execution test will be linked properly with the reference Test SaMD. If it dows not appear automatically, please refresh the jira page to find it linked.   
> It is important to check if the Fix Versions reports the correct version of the product to be tested. The Test SaMD can collects multiple Fix Versions, while the Execution test refers to a specific version so they need to report one and only one Fix Version.  

### Required fields
* Summary: reporting the title of the test
* Description: tracks the steps to be followed to execute the test and the expected results. In version P4SaMD 0.1.0, the description has to be plain text. 
* Fix Versions: is fundamental to report the tested version, just one Fix Version needs to be set in this field. 
* Components: to indicate the software item related to the execution test. See [Software Item](#software-item) section to find out more details
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


A Execution test can assume those states, tracking the execution of the test: 
* TO DO
* IN PROGRESS
* SUCCESS
* FAILED

> **Tip** Use the Note field to track the causes of failure or possible notes.

## Change
The Change Request SaMD is the issue that reports a request of change, independently on the source (client or internal request). Change Request SaMD could be an improvement, new feature or bug fix.
### Required fields
* Summary
* Fix Versions: the software version in which the Change will be applied
* Description
* Components: to indicate the software item related to the Change. See [Software Item](#software-item) section to find out more details
* Approval date
* Classification: if minor/major/bugfix
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
| *Requirement SaMD*            | Change SaMD *changes Requirement* |  keeps track of the requirement which is affected, deprecated or generated by the change |
 

A Change can assume those states, tracking the progression of a request of change for the product,  of the test: 
* REPORTED
* ANALYSIS
* STAND-BY
* REFUSED
* PLANNED
* IN PROGRESS
* COMPLETED

**Related Requirements**    
The changes can be link to
* 2 Requirements when one is no longer valid (status: DEPRECATED, Fix Versions: a previous one with respect to the Fix Version of the change) and the other one is new (status: not deprecated, e.g. DRAFT and Fix Versions: the same of the current Change) 
* 1 new Requirement SaMD when the change add a requirement to the current version (Fix Versions: the same of the current Change) or 1 deprecated Requirement SaMD if the change deletes the requirement in the current version


## Automation
### SaMD: Execution test - Creation
The automation clones a Test SaMD in a different type of issue, Execution test. All the field are copied in the new issue, including the Fix Version. Please check the new-created issue, updateding, for instance, the Fix Version as stated in [Execution test](#execution-test) section. 

