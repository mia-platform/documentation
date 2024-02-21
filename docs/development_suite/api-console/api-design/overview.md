---
id: overview
title:  Design Your Project
sidebar_label: Overview
---

The Design section allows you to modify the configuration and architecture of your project by customizing the use of various resources such as CRUD, Microservices, Endpoints and much more.

![Design Area](./img/design-area-overview.png)

Using the sidebar it is possible to navigate between the different sections of the Console, and design your project as you prefer.

## Manage your Configuration

Mia-Platform Console allows you to manage the configuration of your project using **branches** or **tags**:  

* **Branches** represent independent lines of development that can be originated starting from any commit. They are used to develop and test different configurations, as changes to one branch do not cause any changes to others, and any branch can be deployed.  

* **Tags** are references that point to a specific commit in the history. Tagging is generally used to capture a point in history that is used for a specific release version. Unlike branches, tags, after being created, have no further history of commits.

In the Design Area, you can see a **branch management area** on the top-right corner that allows you to perform different actions at the branch level:

- switch to a specific branch or tag 
- create a new branch from an existing branch
- create a new tag
- discard your local changes
- visit the commit history
- save your work

## Branch Status

When working on a branch, different statuses may appear, depending on different circumstances which are described here below.

### Configuration up to date with remote

In this case, the branch icon presents a little green circle.
It means that you are up to date with remote, without having applied any changes on the configuration yet.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Branch up to date](./img/branch-selection.png)

  </div>
</div>

### Unsaved local changes

In this case, a floppy icon appears next to the branch name to suggest to the user to save new local changes applied in the configuration.

If you want, you can choose to discard your local changes.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Unsaved local changes](./img/branch-status-unsaved-local-changes.png)

  </div>
</div>

To see the specific changes you have brought to the configurations, it is possible to click on the link to your local changes that will open a modal as shown in the following image, highlighting them.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '780px'}}> 

![Unsaved local changes modal](./img/branch-status-unsaved-local-changes-modal.png)

  </div>
</div>

### A remote commit has been performed

In this case, you have not applied any local changes yet, but someone else has already committed new ones on the same branch.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Pull configuration](./img/branch-status-pull-configuration.png)

  </div>
</div>

By clicking the `Pull configuration` button, the project configuration will be updated to the latest version.

### A remote commit has been performed and there are unsaved local changes

There are several options to resolve the remote commit:

* start [a merge process](/development_suite/api-console/api-design/merge_collaboration.md), to compare differences between the last remote configuration committed and your local work on the branch; 
* save changes on a new branch;
* discard them and pull from the remote configuration.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Pull configuration](./img/branch-status-merge-configuration.png)

  </div>
</div>

### Error in the retrieval of the configuration

In this case, an error message will be shown in the branch popover and you may need to reload the page or contact your Project Administrator.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Pull configuration](./img/branch-status-error.png)

  </div>
</div>

### How to load a branch or tag

In order to switch to another branch or tag, you just need to click on its name to open the `Load area`. There you can select the new branch or tag to be loaded.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Load Branch](./img/branch-loader.png)

  </div>
</div>

## How to save your configuration

Once the respective desired changes have been made, using the `Save Configuration` button in the branch action popover and fill the save configuration modal form. 

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '780px'}}> 

![Save Configuration](./img/save-configuration.jpg)

  </div>
</div>

In this modal, you can specify the title of your commit along with a short description. 

It's also possible to create a new branch along with the commit, which will contain the current configuration.  

:::tip
Additional information about the configuration may appear on the modal, highlighting potential warnings about your configuration.
:::

### Create Tag

To keep track of all changes made to the configuration, you may want to create a **tag** using the corresponding button in the branch management area.  

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '340px'}}> 

![Create Tag](./img/create-tag.png)

  </div>
</div>

:::caution
Since tags are read-only and unchangeable over time, it is not possible to save changes starting from a tag. You can, on configuration saving, create a new branch with the changes made to the tag configuration.
:::

The tag modal will ask to provide information about version and the features involved, incorporating also markdown text.

<div style={{display: 'flex', justifyContent: 'center'}}>
  <div style={{display: 'flex', width: '700px'}}> 

![Create Tag](./img/create-tag-modal.png)

  </div>
</div>

:::tip
In the right panel, is possible to display the tag history.
:::



