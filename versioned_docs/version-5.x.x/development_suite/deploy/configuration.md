---
id: configuration
title:  Configure a custom Webhook
sidebar_label: Configure a custom Webhook
---
The Developers Console can also trigger a deploy using a custom Webhook (for example if you use an external CI server such as Jenkins).

In order to enable your project to deploy using a custom Webhook you should edit your environments configuration of the project on mongo with additional Webhook details.  
Environments should have an object `deploy` with the following informations:  

* type: is the type of deploy (should be `webhook`)
* url: is the url of the webook (i.e.: <http://jenkins.hostname.it/jenkins/view/job/yourjob/>)
* statusUrl: is the url to retrieve the status of the triggered pipeline (i.e.: <http://jenkins.hostname.it/jenkins/view/job/yourjob/api/json?tree=builds[result,queueId>])
* pipelineIdPathTemplate: is the template of the location returned by the pipeline trigger in order to retrieve the pipelineId (i.e.: `/jenkins/queue/item/:pipelineId/`)
* paramsMap: is a parameters mapping for the parameters needed in your webhook pipeline (i.e.: if your pipeline needs revision parameters to be named as tag, this object should be: `{'revision': 'tag'}`)  

In `projects` collection, choose your project document. `deploy` object must be inside your environment configuration (i.e.: `project.environments[0].deploy`).  
Sample `deploy` JSON:  

```json
{
  "deploy": {
    "type": "webhook",
    "url": "http://jenkins.hostname.it/jenkins/view/job/yourjob/",
    "statusUrl": "http://jenkins.hostname.it/jenkins/view/job/yourjob/api/json?tree=builds[result,queueId]",
    "pipelineIdPathTemplate": "/jenkins/queue/item/:pipelineId/",
    "paramsMap" : {
        "revision" : "TAG",
        "environment" : "ENVIRONMENT"
    }
  }
}
```
