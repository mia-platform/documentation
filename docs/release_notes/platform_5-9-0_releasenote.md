## v5.9.0 (June 25,2020)

### New features

#### New Deploy area version

* **Compare services**        
    You can now **compare the services that you are going to deploy** with the services already deployed.

    ![deploy-compare-serv](himg/deploy-compare-serv.png)

* **Experience**       
    **New deployment experience**: when you click the "Deploy" button a new modal appears to inform you about deployment progress.

![deploy-release](hmg/deploy-release.png)


#### New Deploy area version

* **Marketplace**      
    The Marketplace experience on GitHub has been improved. Moreover, the new microservice **Go Example** is now available!

### Improvements



### Fixes

When you switch from advanced to standard configuration, for the environment variables 

Nella sezione microservizi della Console, quando viene disabilitata la configurazione avanzata (quindi quando si passa dalla configurazione avanzata alla standard riportando le variabili d'ambiente contenute nel deployment.yml ), per le variabili il cui valore deve essere interpolato, quindi nel formato '{{nomeEnv}}', se il valore della Env non contiene gli apici  (e.g. {{nomeEnv}} ) il risultato e'
