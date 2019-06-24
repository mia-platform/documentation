##Deploy
The Developers Console is the sections that allows developers to directly deploy your configurations in the different environments and check the past history of all the releases on that project.
Thanks to this automation the **Continuos Deploy** is more simple and immediate.
Furthermore, the deployment automatically starts the tests to verify that the branch can be released without damaging the existing project.

The Deploy section is divided into two areas: **Environments** and **History**.

When an user enters the Deploy section, he is automatically led to Environments area.
The Environments area is composed of an introductory page with an overview of the different environments and of the single pages that give the details of the specific environment.

###Overview page of all the Environments

![environments overview](img/environments-overview-page.png)

The environments overview page shows in a table all the different environments on which it is possible to release. For each environment the user has the possibility to visualize which is the most recent deploy that was successful. This table allows the user to be able to know what has is currently deployed in every environment.

The information that are visualized are the following:
* Environment name;
* Environment description;
* Environment status that alerts the user if there is a deploy going on or if the deploy is already finished.
* The latest version that has been deployed: it gives information about the commit, how much time ago it happened and who made it;
* Deploy type (ex. if the deploy released all the service or only part of them);
* Who made the deploy.

Finally, for each row the user can also enter the **detail section** where he can actually deploy the services.

To release you must have **Owner** permissions on Gitlab.

To release the user will have to select the environment and the branch.

###Deploy Details Page

From the Environments Overview Page it is possible to directly enter the Details Page of the single Environment.
This page is divided in two areas:

![deploy details](img/environments-deploy-detail.png)

1. An insight on the most recent deploy and on the details on the environment
Un approfondimento sull’ultimo deploy effettuato e sui dettagli del mio ambiente.
In questa sezione visualizzo infatti una prima parte di informazioni generali:
il nome dell’ambiente
La descrizione
I pod attivi
E i link al monitoraggio di quell’ambiente o alle sue configurazioni
Visualizzo poi tutte le informazioni legate all’ultimo deploy di successo:
La versione rilasciata
Il tipo
Chi lo ha rilasciato e quando
Le note lasciate in fase di deploy


![deploy](img/deploy.PNG)
