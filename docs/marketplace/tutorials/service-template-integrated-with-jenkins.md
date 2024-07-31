---
id: service-template-integrated-with-jenkins
title: Create a service template integrated with Jenkins
sidebar_label: Create a service template integrated with Jenkins
---

<!-- TODO: gitlab and azure are supported, what about github though?
:::warning
At the moment, the only git provider supported is GitLab.
::: -->

Marketplace service templates can be configured to be built using Jenkins, this tutorial will show how to:

1. Create a Marketplace service template configured to support Jenkins
1. Create a service in your Project using the template
1. Configure the Jenkins instance

## 1. Create a Jenkins-enabled service template

We are going to create the service template in the Marketplace using `miactl` and link a git repository containing the Jenkins pipeline template:

- Create the marketplace resource object and save it in `jenkins-service-template.yaml`
 
  ```yaml
  tenantId: <TENANT_ID>
  type: template
  categoryId: nodejs
  description: NodeJS Jenkins service template tutorial
  name: NodeJS Jenkins tutorial
  itemId: nodejs-jenkins-tutorial
  resources:
    services:
      nodejs-template:
        type: template
        name: nodejs-template
        archiveUrl: <SERVICE_ARCHIVE_URL>
        containerPorts:
          - from: 80
            name: http
            protocol: TCP
            to: 3000
        defaultLogParser: mia-json
        description: >-
          A NodeJS Service template built using Jenkins pipelines.
        pipelines:
          jenkins:
            providerId: <GIT_PROVIDER_ID>
            xmlTemplate:
              gitBranch: <GIT_BRANCH>
              gitPath: services/node.xml
              gitProjectId: <GIT_PROJECT_PATH>
  ```

  Where:
  - `<TENANT_ID>` is the identifier of the Company that owns this resource on the Marketplace
  - `<SERVICE_ARCHIVE_URL>` is the URL of the service archive in `.tar.gz` or `.zip`, it contains the source code of the service
  - `<GIT_PROVIDER_ID>` is the ID of the Git provider that hosts the Jenkins pipeline template repository
  - `<GIT_BRANCH>` is the branch of the repository
  - `<GIT_PROJECT_PATH>` is the path of the repository (TODO: is it the project ID? or what exactly?)

- Apply the resource using `miactl`

  ```sh
  miactl marketplace apply -f jenkins-service-template.yaml
  ```

- In the linked repository create the Jenkins pipeline template at `services/node.xml`, this will instruct Jenkins to build the service when a new commit is pushed to the repository and run the pipeline as defined in the linked `Jenkinsfile`. This template will be interpolated every time a new service is created from the template.

  ```xml
  <flow-definition plugin="workflow-job@1400.v7fd111b_ec82f">
    <description />
    <keepDependencies>false</keepDependencies>
    <properties>
      <hudson.model.ParametersDefinitionProperty>
        <parameterDefinitions>
          <hudson.model.StringParameterDefinition>
            <name>DOCKER_IMAGE</name>
            <defaultValue>mia_template_image_name_placeholder</defaultValue>
            <trim>false</trim>
          </hudson.model.StringParameterDefinition>
          <hudson.model.StringParameterDefinition>
            <name>PROJECT_URL</name>
            <defaultValue>%GIT_PROVIDER_BASE_URL%/%GIT_PROVIDER_GROUP%/%GIT_PROVIDER_PROJECT%</defaultValue>
            <trim>false</trim>
          </hudson.model.StringParameterDefinition>
          <hudson.model.StringParameterDefinition>
            <name>GIT_BRANCH</name>
            <trim>false</trim>
          </hudson.model.StringParameterDefinition>
        </parameterDefinitions>
      </hudson.model.ParametersDefinitionProperty>
      <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
        <triggers>
          <org.jenkinsci.plugins.gwt.GenericTrigger plugin="generic-webhook-trigger@2.2.2">
            <spec />
            <genericVariables>
              <org.jenkinsci.plugins.gwt.GenericVariable>
                <expressionType>JSONPath</expressionType>
                <key>GIT_BRANCH</key>
                <value>$.resource.refUpdates[0].name</value>
                <regexpFilter>refs/heads/</regexpFilter>
                <defaultValue>master</defaultValue>
              </org.jenkinsci.plugins.gwt.GenericVariable>
            </genericVariables>
            <regexpFilterText />
            <regexpFilterExpression />
            <printPostContent>false</printPostContent>
            <printContributedVariables>false</printContributedVariables>
            <causeString>Build template by user update</causeString>
            <token>%SECRET_TOKEN%</token>
            <tokenCredentialId />
            <silentResponse>false</silentResponse>
            <overrideQuietPeriod>false</overrideQuietPeriod>
            <shouldNotFlattern>false</shouldNotFlattern>
            <allowSeveralTriggersPerBuild>false</allowSeveralTriggersPerBuild>
          </org.jenkinsci.plugins.gwt.GenericTrigger>
        </triggers>
      </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
    </properties>
    <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition"
      plugin="workflow-cps@3908.vd6b_b_5a_a_54010">
      <scm class="hudson.plugins.git.GitSCM" plugin="git@5.2.2">
        <configVersion>2</configVersion>
        <userRemoteConfigs>
          <hudson.plugins.git.UserRemoteConfig>
            <url>https://git.tools.mia-platform.eu/platform/console/marketplace/pipelines/jenkins-pipelines.git</url>
            <credentialsId>GitlabMiaPlatformToken</credentialsId>
          </hudson.plugins.git.UserRemoteConfig>
        </userRemoteConfigs>
        <branches>
          <hudson.plugins.git.BranchSpec>
            <name>*/main</name>
          </hudson.plugins.git.BranchSpec>
        </branches>
        <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
        <submoduleCfg class="empty-list" />
        <extensions />
      </scm>
      <scriptPath>build/node/Jenkinsfile</scriptPath>
      <lightweight>true</lightweight>
    </definition>
    <triggers />
    <disabled>false</disabled>
  </flow-definition>
  ```



### Pipeline configuration

## 2. Create a service in your Project using the template

## 3. Configure the Jenkins instance


FIXME: OUTDATED ↓

## Marketplace service configuration

After having created a template following our [guide](/marketplace/add_to_marketplace/add_item_by_type/add_template_or_example.md), you can:

- include the XML template of the Jenkins job that will build your service somewhere in the repo template (e.g. at `path/to/xml/build/build-job.xml`). [Here](/docs_files_to_download/build-job.xml) you
can find an example of this file.
- in the `marketplace` collection on MongoDB, the object corresponding to your template must contain a `pipelines.jenkins` field structured as in the example below:

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
                "gitProjectId" : "<PROJECT_ID>",
                "gitPath" : "path/to/xml/build/file",
                "gitBranch" : "master"
            },
            "gitWebhookOptions" : {
                "pushEvents" : true,
                "tagPushEvents" : true
            }
        }
    },
}
```

:::note
`gitWebhookOptions` replaces the deprecated `gitlabWebhookOptions`, which at the moment is still supported but will be removed in the future.

`gitProjectId`, `gitPath` and `gitBranch` replaces the deprecated `gitlabProjectId`, `gitlabPath` and `gitlabBranch`, which at the moment are still supported but will be removed in the future.
:::

The `xmlTemplate` pipeline file can contain `%SECRET_TOKEN%`, which will be replaced by a secret token generated by the Console and used by the git provider Webhook.

In this way, when you create a new service from this template, the relative build pipeline will be automatically created on Jenkins, and the corresponding webhook will be set on the git provider.
