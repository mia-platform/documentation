---
id: software_items
title: Software Items
sidebar_label: Overview
---

The section allows users to view, create, and edit software items. It provides an intuitive interface for managing software items, including detailed views, adding new entries, and updating existing records. Additionally, using the console, software items are also detected automatically, ensuring efficient and seamless handling of software-related data.

## 1. Create Software Item Design 

1. **Click the "Add software item design" Button**  
   This will open the modal to create a new Software Item.

2. **Fill in the Required Fields**  
   In the modal, you will be prompted to fill out the **Software Item Name** field.  
   When you click on this field, a dropdown will appear. In the dropdown, you can either:  
   - **Enter a new Software Item name**: Type the name you want to assign to the new Software Item and select **Create new**.
   - **Select an existing Software Item**: If a Software Item with the same name and version already exists in the system, you can select it from the list. This will automatically prefill the form with the details of the selected Software Item.
   Fill in the required fields as needed  ([Fields description](#fields-description))

3. **Save the New Software Item**  
   Once you've completed the form, click the **"Add software item design"** button at the end of the modal to create and save the new Software Item in the system.

:::tip
You can create a new Software Item starting from an older one: simply select it from the dropdown, then modify the `name` and other fields.
::: 

## 2. Software Item Table
The table shows basic info of the tree of software items:
1. **+/-**: Expand/Collapse Software Item children
2. **Software Item**: Name of the Software Item, clickable if the `Implementation link` is filled.
3. **Suggestions**: Count of the suggestions, hover to show a dropdown with a number of how much is in error and in warning. Clicking open modal in the suggestion tab.
4. **SOUP**: Show a label if the Software Item `Is SOUP` is filled or the number of SOUPS children if there are
5. **Safety**: Show a label containing the Software item Safety class 
6. **Design**: Show design status and version
7. **Implementation**: Show Implementation status and detected version
8. `Fast Action | Detail | Three dots`: 
   - **Edit software item design**: Opens a modal to edit the item, following the guidelines in the ([Fields description](#fields-description)).
   - **Download**: Opens a menu to download History and/or Changelog.
   - **Delete item**: Opens a confirmation modal to delete the item.

**N.B.** Every edit of the software item is reflected in all instances.

## 3. Software Item States and Related Actions
Depending on the status of the software items, several fast actions are available:

| Status | Button | Description | Action |
|:-------------:|:--------:|-----------|-----------|
|![alt text](img/swi_ok.png)|  |The software item is in correct status |
|![alt text](img/swi_missing_approval.png)|![alt text](img/swi_approve_btn.png)|The Software Item should be approved|Approve the item, if `SOUP` open a modal to fill required fields|
|![alt text](img/swi_missing_version.png)|![alt text](img/swi_tag_btn.png)|Project \| Service need to be tagged |Redirect to console to create a tag|
|![alt text](img/swi_invalid_version.png)|![alt text](img/swi_create_tag_btn.png)|Version is not following the semantic versioning |Redirect to console to edit a tag|
|![alt text](img/swi_missing_implementation.png)|![alt text](img/swi_create_project_btn.png) ![alt text](img/swi_create_service_btn.png)|The Software Item is not implemented in the console  |Redirect to console create Project \| Service|
|![alt text](img/swi_missing_design.png)|![alt text](img/swi_create_btn.png)|A Software Item was detected but not designed | Open modal to create a Software Item, If a design for a Software Item with the same name and version already exists, open modal to suggest duplicating|
|![alt text](img/swi_version_unmatched.png)|        |Versions designed and detected are not matched| |
|![alt text](img/swi_undetectable.png)|        |Software Item can't be detected| |

## 4. Software Item Drawer
Clicking on a row or the specific button will open a navigable drawer.

From here, you can approve or disapprove a Software Item. <br/>Additionally, all the actions available from the menu inside the table are accessible here as well, just click on the three dots icon in the top right corner.

This is divided into multiple tabs:
- **Detail**: Displays all the fields entered ([Fields description](#fields-description)) for the Software Item.
- **Traceability**: Shows the linked issues (Requirements, Risks, Integration Tests, Changes), which are clickable.
- **Suggestions**: Displays a list of suggestions, if any, to ensure the Software Item meets the ISO standards.

| IEC 62304 Reference Requirement | Title | Description |
|-----------|-----------|----------|
|[**5.3.1**] Transform software requirements into an ARCHITECTURE | Missing architecture reference | Each Software Item of class B or C must include a reference to its architecture. |
|[**5.3.2**] Develop an ARCHITECTURE for the interfaces of SOFTWARE ITEMS | Missing interface architecture reference | Each Software Item of class B and class C must include a reference to the architecture of its interfaces. |
|[**5.3.3**] Specify functional and performance requirements of SOUP item | Missing functional or performance requirements | Each SOUP Software Item of class B or C must include specified functional and performance requirements necessary for its intended use. |
|[**5.3.4**] Specify SYSTEM hardware and software required by SOUP item | Missing system hardware and software requirements | Each SOUP Software Item of class B or C must include the system hardware and software necessary to support the proper operation of the item. |
|[**5.4.2**] Develop detailed design for each SOFTWARE UNIT | Missing detailed design | Each Software Item of class C must have a detailed design documented to allow correct implementation. |
|[**5.4.3**] Develop detailed design for interfaces | Missing detailed design for interfaces |Each Software Item of class C must include a detailed design for its interfaces with external components and other Software Units |
|[**5.6.1**] Integrate SOFTWARE UNITS <br /> [**5.6.2**] Verify software integration <br /> [**5.6.3**] Software integration testing <br /> [**5.6.4**] Software integration testing content <br /> [**5.6.7**] Integration test record contents| Missing integration tests | Each Software Item of class B or C must be associated with at least one integration test. | 
|[**7.1.1**] Identify SOFTWARE ITEMS that could contribute to a hazardous situation <br /> [**7.1.2**] Identify potential causes of contribution to a hazardous situation | Missing Risks | Each Software Item of class B or C must be associated with at least one risk |
|[**8.1.2**] Identify SOUP | Missing Manufacturer in SOUP Software Item | Each SOUP Software Item must include the manufacturer's information. |

:::warning
If a Software Item is not designed but detected by the system, a warning will appear, and you can proceed with its creation.
:::



## Fields description
1. **Software item name**:  Name of Software Item.
   - *Only for creation*
2. **Version**: Version of Software Item.
   - *Only for creation*
   - Should follow **semantic versioning** format.
4. **Implementation link**: Link to the implementation of the Software Item.
5. **Resource type**: Type of the Software Item (project, service, library, or other).
   - *Only for creation*
   - Selectable from the following options: `Project`, `Service`, `Library`, `Other`.
6. **Parent software item**: Select the parent Software Items.
   - *Only for creation*
   - Editable only if the Software Item type is `Service` or `Library`.
   - Allows the selection of multiple parent Software Items.
7. **Description**: Description of the Software Item.
8. **Is medical device**: Flag indicating whether the Software Item is a medical device.
9. **Software safety classification**: Safety class of the medical device.
   - Visible only if `Is medical device` is selected.
   - Available options: `A`, `B`, `C`.
10. **Detailed design reference**: Link to the detailed design documentation.
    - Visible only if `Is medical device` is selected.
11. **Detailed interface architecture reference**: Link to the detailed interface architecture documentation.
    - Visible only if `Is medical device` is selected.
12. **Is SOUP**: Flag indicating whether the Software Item is a "Software of Unknown Provenance" (SOUP).
    - Selectable only if the Software Item **IS NOT** of type `Project`.
13. **Manufacturer**: Name of the Software Item manufacturer.
    - Visible only if `Is SOUP` is selected.
14. **License**: License of the Software Item.
    - Visible only if `Is SOUP` is selected.
15. **Required hardware and software**: Hardware and Software required for the Software Item.
    - Visible only if `Is SOUP` is selected.
16. **Verification reason**: Reason for verifying the Software Item.
    - Visible only if `Is SOUP` is selected.
17. **Repository ID**: ID of the repository associated with the Software Item.
18. **Repository link**: Link to the repository of the Software Item.
19. **Architecture reference**: Link to the architecture reference of the Software Item.
20. **Interface architecture reference**: Link to the interface architecture reference of the Software Item.
21. **Linked requirements**: Requirements associated with the Software Item.
    - Requirements are defined in the provider application.
22. **Linked integration tests**: Integration tests associated with the Software Item.
    - Integration tests are defined in the provider application.
23. **Linked risks**: Risks associated with the Software Item.
    - Risks are defined in the provider application.
24. **Linked changes**: Applicable regulations for the Software Item.
    - Changes are defined in the provider application.


<br />

:::warning
Each Software Item is a design of an **instance**; every edit, approval, or disapproval **will be applied to all instances**. <br />
For this reason, you **cannot** create two Software Items with the same `name` and `version`, in that case an error will be displayed. 
:::

:::warning
To **Approve** a Software Item all his children should be approved.