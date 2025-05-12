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
  - `<GIT_PROJECT_PATH>` is the path of the repository

  For Jenkins, it's possible to customize the trigger behavior based on the git provider of choice, as an example, this `resources.services.nodejs-template.pipelines.jenkins` configuration will instruct the git provider to trigger the pipeline on every push to the repository:

  ```yaml
  gitWebhookOptions:
    gitlab:
      gitPush: true
    azure-devops:
      events:
        - type: git.push
          filter:
            branch: master
  ```

  For more information on the available events check the provider documentation.

- Apply the resource using `miactl`

  ```sh
  miactl catalog apply -f jenkins-service-template.yaml
  ```

- In the linked repository create the Jenkins pipeline template at `services/node.xml`, this will instruct Jenkins to build the service when a new commit is pushed to the repository and run the
pipeline as defined in the linked `Jenkinsfile`. This template will be interpolated every time a new service is created from the template.

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
            <url>PIPELINE_URL</url>
            <credentialsId>PIPELINE_TOKEN</credentialsId>
          </hudson.plugins.git.UserRemoteConfig>
        </userRemoteConfigs>
        <branches>
          <hudson.plugins.git.BranchSpec>
            <name>PIPELINE_BRANCH</name>
          </hudson.plugins.git.BranchSpec>
        </branches>
        <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
        <submoduleCfg class="empty-list" />
        <extensions />
      </scm>
      <scriptPath>JENKINSFILE_PATH</scriptPath>
      <lightweight>true</lightweight>
    </definition>
    <triggers />
    <disabled>false</disabled>
  </flow-definition>
  ```
  
  Here we define a pipeline that will be triggered by a webhook on the repository of the service and will clone the pipeline repository at `PIPELINE_URL` and run the pipeline defined in the `JENKINSFILE_PATH`.
  The configuration of the `GenericTrigger` reported here is specific to Azure DevOps, and is instructed to extract the correct branch name of the service repository from the webhook payload.
  
  For GitLab hosted repository use the following configuration inside `<triggers>`:

  ```xml
  <com.dabsquared.gitlabjenkins.GitLabPushTrigger plugin="gitlab-plugin@1.8.1">
    <spec></spec>
    <triggerOnPush>true</triggerOnPush>
    <triggerToBranchDeleteRequest>false</triggerToBranchDeleteRequest>
    <triggerOnMergeRequest>true</triggerOnMergeRequest>
    <triggerOnlyIfNewCommitsPushed>false</triggerOnlyIfNewCommitsPushed>
    <triggerOnPipelineEvent>false</triggerOnPipelineEvent>
    <triggerOnAcceptedMergeRequest>false</triggerOnAcceptedMergeRequest>
    <triggerOnClosedMergeRequest>false</triggerOnClosedMergeRequest>
    <triggerOnApprovedMergeRequest>true</triggerOnApprovedMergeRequest>
    <triggerOpenMergeRequestOnPush>never</triggerOpenMergeRequestOnPush>
    <triggerOnNoteRequest>true</triggerOnNoteRequest>
    <noteRegex>Jenkins please retry a build</noteRegex>
    <ciSkip>true</ciSkip>
    <skipWorkInProgressMergeRequest>true</skipWorkInProgressMergeRequest>
    <labelsThatForcesBuildIfAdded></labelsThatForcesBuildIfAdded>
    <setBuildDescription>true</setBuildDescription>
    <branchFilterType>All</branchFilterType>
    <includeBranchesSpec></includeBranchesSpec>
    <excludeBranchesSpec></excludeBranchesSpec>
    <sourceBranchRegex></sourceBranchRegex>
    <targetBranchRegex></targetBranchRegex>
    <secretToken>%SECRET_TOKEN%</secretToken>
    <pendingBuildName></pendingBuildName>
    <cancelPendingBuildsOnUpdate>false</cancelPendingBuildsOnUpdate>
  </com.dabsquared.gitlabjenkins.GitLabPushTrigger>
  ```

  In the previous snippets you can use the following interpolation variables:

  - `mia_template_service_name_placeholder` name of the service, as specified in the Project
  - `mia_template_project_id_placeholder` the identifier of the Project
  - `mia_template_image_name_placeholder` the image name of the service, as specified in the Project
  - `%CUSTOM_PLUGIN_PROJECT_NAME%` name of the Project
  - `%CUSTOM_PLUGIN_SERVICE_DESCRIPTION%` service description
  - `%CUSTOM_PLUGIN_CREATOR_USERNAME%` username of the user who created the service
  - `%CUSTOM_PLUGIN_PROJECT_FULL_PATH%` the full path of the Project in the Git provider
  - `%GIT_PROVIDER_BASE_URL%` the base URL of the Git provider hosting the service repository
  - `%GIT_PROVIDER_GROUP%` the group of service repository
  - `%GIT_PROVIDER_PROJECT%` the name of the service repository
  - `%CUSTOM_PLUGIN_PROJECT_GIT_PATH%` the full path of the service repository
  - `%NEXUS_HOSTNAME%` registry hostname
  - `%SECRET_TOKEN%`secret token used to trigger the pipeline

- create the build pipeline definition `Jenkinsfile`

  ```groovy
  pipeline {
      agent {
        ...
      }
      
      stages {
          stage('Checkout') {
              steps {
                  git branch: "${env.gitlabSourceBranch}",
                      url: "${params.PROJECT_URL}",
                      credentialsId: <CREDENTIALS_ID>
              }
          }
  
          stage('Build') {
              steps {
                  container('node') {
                      sh 'node --version'
                      sh 'npm run build'
                  }
              }
          }
      }
  }
  ```

## 2. Create a service in your Project using the template

In the Project design section create a new microservice from the template you created. This process will:

1. Create the microservice repository from the interpolated template archive.
1. Create the Jenkins job to build the service.
1. Register a webhook that triggers the Jenkins pipeline when a push event occurs in the microservice repository

## 3. Configure the Jenkins instance

To receive the webhook events, you need to configure the Jenkins instance by installing one of the following plugins:

- If your Project is hosted on a GitLab instance, install the `GitLab` plugin
- Otherwise, install `Generic Webhook Trigger` plugin
