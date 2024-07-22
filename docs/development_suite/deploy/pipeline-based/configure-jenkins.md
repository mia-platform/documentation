---
id: configure-jenkins
title: Deploy with Jenkins
sidebar_label: Deploy with Jenkins
---
The Mia-Platform Console can be configured to deploy your Project using Jenkins.

To deploy your projects using Jenkins, you must add the Jenkins Provider on the Company Provider page, and [configure the provider](/console/company-configuration/providers/configure-provider.mdx).

When a project will use this provider, the Project configuration will be changed to be like this:

```json
{
  "type": "jenkins",
  "providerId": "{{PROVIDER_ID}}"
}
```

Where `PROVIDER_ID` will be equal to the ID of the just configured Jenkins Provider.

### Workflow

All the logic behind the handling of deploy requests is contained by the control plane of the console.

With the above configuration, when a user presses the `Deploy` button inside the console, the following steps will be executed:

```mermaid
sequenceDiagram
  actor User
  participant Console
  participant Jenkins

  User->>Console: Press Deploy
  Console->>Jenkins: Trigger job
  note over Console,Jenkins: body<br/>{<br/>"revision": REVISION_TO_TRIGGER,<br/>"environment": envId,<br/>"deployType": "smart_deploy" or "deploy_all",<br/>"forceDeployWhenNoSemver": true or false<br/>}
  Jenkins-->>Console: 201 with Location header with pipeline id
  note over User,Console: responds with pipeline<br/> id and web url
  Console-->>User: 200

  note over User,Console: Polling to retrieve pipeline status

  User->>Console: GET pipeline status
  Console->>Jenkins: GET pipeline status
  Jenkins-->>Console: 200 with status
  Console-->>User: 200 with status

  note over Console,Jenkins: When status succeed, save status inside Console
  Jenkins->>Console: POST pipeline status
  Console-->>Jenkins: 200 Ok
```

1. The console performs a POST to Jenkins in order to trigger `jobId`. The body is in this form:

    ```json
    {
      "revision": REVISION_TO_TRIGGER,
      "environment": envId,
      "deployType": "smart_deploy" or "deploy_all",
      "forceDeployWhenNoSemver": true or false
    }
    ```

    Where:

    - `REVISION_TO_TRIGGER`: is the revision to deploy (i.e. the tag or the branch name);
    - `envId`: is the environment id to deploy;

2. The expected Jenkins response has a 201 status code and contains a `Location` header (i.e. `<JENKINS_URL>/queue/item/:pipelineId`). This is used from the backend of the console to retrieve the id of the triggered pipeline;
3. The console website periodically performs GET requests to check the status of the triggered job
4. Once the job is completed, Jenkins will send a POST request to the console saving the status of the pipeline. This is a really important step to perform in your pipeline
to enable the configuration review (and improve the deploy history). [Check here](#how-to-automatically-create-jenkins-job-on-project-creation) how to configure the Jenkins pipeline.

### Create a new project with Jenkins as CI/CD provider

When creating a new Project in a Company that has Jenkins Provider set, the Console will perform two important actions:

- based on the [Project Template](/development_suite/company/project-blueprint.md) of choice, the Console will [create Jenkins job automatically](#how-to-automatically-create-jenkins-job-on-project-creation);
- The Project configuration `Pipelines` JSON will be defined as follows:

```json
{
  "type": "azure-pipelines",
  "providerId": "PROVIDER_ID",
  "jobId": "JOB_ID"
}
```

Where:

- `PROVIDER_ID` is the providerId of the CI/CD Jenkins provider;
- `JOB_ID` is the configured job id created from the Console. By default, Console will create a job with `{{projectId}}-configurations` id (where `{{projectId}}` is the human readable projectId),
but it is possible to configure the invoked `jobId` by environment
([follow this guide](#manual-configuration-using-cms)).

### How to automatically create Jenkins job on project creation

Mia-Platform Console allows you to automatically create the Jenkins job that will deploy your project during the project creation.

You need to have an project template repository with the following structure: 

    .
    ├── pipelines
        ├── jenkins-template.xml       # XML template of the deploy job
        ├── jenkins-view-template.xml  # XML template of the Jenkins view where the job will be created

#### Jenkins Pipeline template

This file will configure a Jenkins pipeline which will create a job to deploy the project.

An example of `jenkins-template.xml` file can be downloaded [here](/docs_files_to_download/jenkins-template.xml).

Where you should set:

The Console automatically interpolate the placeholder surrounded by %. The supported placeholders is `project`, which is the project configuration object.
In the linked file are used:

- `%project.configurationGitPath%`: the path of the project configuration repository.

In the file, there is also a parameters which must be replaced with the correct value when inserted in a project template (or directly in the Jenkins job configuration):

- `GIT_PROVIDER_BASE_URL`: the base URL of the git provider which has the project.
- `URL_TO_PIPELINE_REPOSITORY`: the URL where the pipeline repository is located. In this scenario, the deploy pipelines are stored in a different repository than the project configuration repository
so that it is possible to centralize them. It is also possible to insert a `Jenkinsfile` in all the project repositories, removing the `<scm class="hudson.plugins.git.GitSCM" plugin="git@5.2.2">`
tag (line 41-57 of the example);
- `CREDENTIALS_ID`: the git credentials id to access the project pipeline repository; credentials should be stored manually in Jenkins.

##### Jenkinsfile example

The pipeline repository should contain the `Jenkinsfile` with the deploy scripts. An example of `Jenkinsfile` is the following:

```groovy
pipeline {
    agent any

    parameters {
        string(name: 'revision', defaultValue: 'master', description: 'Branch to deploy')
        string(name: 'environment')
        string(name: 'deployType')
        string(name: 'forceDeployWhenNoSemver')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${params.revision}",
                    url: "${params.PROJECT_URL}",
                    credentialsId: "CREDENTIALS_ID"
            }
        }
        
        stage('Script') {
            steps {
                script {
                    sh"""
                        echo 'Deploy scripts'
                    """
                }
            }
        }
    }
    
    // TODO: Add webhook invocation
    post {
        always {
            script {
                def status = currentBuild.result ?: 'SUCCESS'
                sh"""
                    echo "POST BUILD"
                    echo ${status}
                """
            }
        }
    }
}
```

where the `Script` stage is to be replaced with the actual deploy scripts.

The post stage is the part where the Jenkins job will send the status of the pipeline to the Console. This is a really important step to perform in your pipeline to correctly connect
Jenkins with the Console and use all the Console features at best.

#### Jenkins View template

This file will configure a Jenkins view where it is possible to see all the jobs related to the project.

An example of `jenkins-view-template.xml` file can be downloaded [here](/docs_files_to_download/jenkins-view-template.xml).

The Console automatically interpolate the placeholder surrounded by %. The supported placeholders is `project`, which is the project configuration object.
In the linked file are used:

- `%project.configurationGitPath%`: the path of the project configuration repository.

### Manual configuration using CMS

In order to enable an environment in your project to be deployed using Jenkins, you should edit the project configuration through the Console CMS
(if you do not have access to it, ask to your instance administrator).

It is possible to add this configuration also in the environments template inside the tenant configuration, always from the Console CMS.

In particular, the `environments[].deploy` object of the configuration should contain the following information:  

- **type**: string, must be `jenkins` for deployment with Jenkins
- **providerId**: is the unique id of the provider that holds Jenkins credentials (it is set when you configure a Company)
- **jobId**: id of the Jenkins job to trigger. It is automatically interpolated from the backend of the console when a new project is created.
- **paramsMap**: is a parameters mapping for the parameters needed in your Jenkins job (i.e.: if your pipeline needs `revision` parameters to be named as `tag`, this object should be: `{'revision': 'tag'}`)  

A working JSON example is the following:

```json
{
  "deploy": {
    "type": "jenkins",
    "providerId": "your-provider-id",
    "paramsMap": {
      "revision": "TAG",
      "environment": "ENVIRONMENT"
    },
    "jobId": "jobId"
  }
}  
```
