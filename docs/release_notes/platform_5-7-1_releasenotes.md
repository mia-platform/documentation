# v5.7.1 (May 19,2020)

## Improvements

* **CMS**      

    From CMS it is possible to configure default environment variables, that are different for each template, in order to overwrite the defaults applied by DevOps Console.

* You have the possibility to **resize columns** in the Pre/Post section of DevOps Console.

    ![column-resize](img/column-resize.png)

    ![column-resize-1](img/column-resize-1.png)

## Fixed

* **Deploy**      

    Horizontal Pod Autoscaler (HPA) file is  **generated with *.yml* extension** instead of *.yaml*. So, HPA files can now be deployed successfully.

!!! info

    Mia Platform recommends you to delete al the *.hpa.yaml* files and to mantain all the *.hpa.yml* files.

* **Logs are in *json* format** for both the consumer and the producer.


## How to update your DevOps Console?

In case of on-premise Console, to use the previous features, you have to update:

* Console website @1.20.0

* Console backend @1.20.0
