---
id: project-template-integrated-with-jenkins
title: Create a project template integrated with Jenkins
sidebar_label: Create a project template integrated with Jenkins
---

After having created a project following our [guide](/marketplace/templates/template_create.md), you can include an xml file inside the template repo, describing how Jenkins should configure the build job.
If you want to rely upon **Jenkins** as your CI/CD system, you need to do the following:

* include the XML template of the Jenkins job that will build your service somewhere in the repo template (e.g. at `path/to/xml/build/build-job.xml`). [Here](/docs_files_to_download/build-job.xml) you can find an example of this file.
* in the `services` collection on MongoDB, the object correpsonding to your template must contain a `pipelines.jenkins` field structured as in the example below:

```json
{
    "_id" : ,
    "name" : "template_name",
    "archiveUrl" : "https://<GITLAB_URL>/api/v4/projects/<PROJECT_ID>/repository/archive.tar.gz",
    "type" : "template",
    ...
    "pipelines" : {
        "jenkins" : {
            "xmlTemplate" : {
                "gitlabProjectId" : "<PROJECT_ID>",
                "gitlabPath" : "path/to/xml/build/file",
                "gitlabBranch" : "master"
            },
            "gitlabWebhookOptions" : {
                "pushEvents" : true,
                "tagPushEvents" : true
            }
        }
    },
}
```
In this way, when you create a new project from this template, the relative build pipeline will be automatically created on Jenkins, and the corresponding webhook will be set on Gitlab.
