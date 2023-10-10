---
id: give-feedback
title: Give Feedback
sidebar_label: Give Feedback
---

Mia-Platform users can actively contribute to the product through a feature that allows them to submit feedback on any area of the Console. This feature is accessible through a dedicated button located on the right side of the Console top bar.

![feedback button](./img/feedback-button.png)

Clicking on the button opens a modal, through which the user can choose the type of feedback to give:
* **Issue**: feedback inherent to a bug or technical problem related to a feature of the Console. For example:
  - By making changes A and B to the configuration, I get error C when saving.
  - Page X does not scroll properly and thus has display problems on screens with a*b resolution.
  - I followed the instructions in the documentation but nevertheless could not configure feature Y correctly.
* **Idea**: feedback of improvement of a feature of the Console, or proposed addition of new feature. For example:
  - In section A, it would be helpful if information B was also shown.
  - In section X, it would be useful to make information Y editable.
  - It would be useful for entity Z to be managed through a specific section in Console.
* **Other**: feedback of improvement of existing flows/processes, or suggestions that do not fall into the previous two categories. For example:
  - In the creation flow of resource A, it would be more convenient to close the modal directly after loading instead of having to click the button at the end of the process.
  - I noticed inconsistencies in the names used for resources within section B, it would be useful to adjust for more clarity.
  - The X button to perform the Y action within the Z section is inconspicuous and in an unintuitive location, it would be helpful to enlarge and move it.

![feedback modal](./img/feedback-modal.png)

Once the type is selected, the user is required to enter a description for feedback. After that, simply click the "Send feedback" button to submit the feedback.

:::caution
When filling out the feedback description, be sure to give as much context information as possible (e.g., the reference section, the actions that caused a particular behavior, and so on). This will make it much more immediate for us to identify the problem or area for improvement.
:::

### How do you see the users' feedback?

:::caution
To enable this functionality you need to have the "manage_users" group. 
This group is necessary to view the section dedicated to users within the CMS. 
If you do not see the section called "User Management" contact an administrator to assist you
:::

Actually, we do not have a section within the console. 
The feedback from your collaborators can be viewed within the [cms](https://docs.mia-platform.eu/docs/business_suite/overview-business-suite#cms-site).

![feedback modal](./img/feedback-cms-groups.png)

To enable the viewing of this feedback it is necessary to add a new group within the groups' collection under the "User Management" heading. By pressing the add button, create a group called "manage_user_feedback". There is no need to add anything else to other input fields. 

![feedback modal](./img/feedback-cms-form.png)

Once this is done, save and go to the users section under "User Management", and add the new group to each user you want to be able to see the feedback.

By logging out and logging in, to refresh system data, that user will now be able to see all the feedback from the collaborators
