# v5.7.1 (May 19,2020)

## Improvements

* **API Portal** 
    You can now call an Endpoint from DevOps Console **without specifying one of the headers**.

    ![API-portal-header](img/API-portal-header.png)

* Now you have the possibility to **resize columns** in the Pre/Post section of DevOps Console.

## Fixed

* **Deploy** 

    Horizontal Pod Autoscaler (HPA) file is now **generated with *.yml* extension** instead of *.yaml*. So, HPA files are now deployed.

!!! info

        Mia Platform recommends you to delete al the *.hpa.yaml* files and to mantain all the *.hpa.yml* files.


