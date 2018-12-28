Architettura
La piattaforma si compone di diversi servizi esposti da OpenResty. È possibile spostare i servizi da un Mia-Platform container ad un altro in modo trasparente.

A sinistra tutti i microservizi in un solo container di Mia-Platform, a destra un esempio di distribuzione.

Ogni Mia-Platform container è contenuto a sua volta in un Docker container. A livello logico i vari microservizi sono organizzati come da schema seguente


Architettura Logica di Mia-Platform Suite

La piattaforma è un Enterprise Mobile Backend for Frontend che disaccoppia i sistemi core aziendali dai servizi pubblicati su rete pubblica e accessibili da utenti finali, sia dipendenti Cattolica, sia clienti o potenziali tali.

Disaccoppiamento dei sistemi core dai sistemi End User pubblici.

Inoltre consente di modellare i servizi End-User in modo standard grazie all’Open API Specification generata.

Mia-Platform esposta a terze parti con documentazione delle API
Possibili soluzioni infrastrutturali
Il rilascio della piattaforma in produzione prevede un dimensionamento in base al numero delle applicazioni basate sulla piattaforma, al numero di utenti che utilizzano le varie applicazioni e alla complessità delle diverse applicazioni.

Con le informazioni ad oggi disponibili è possibile dimensionare l’infrastruttura per il rilascio in Demo. Quella per Quality Assurance e Produzione le potremo dimensionare una volta note le informazioni mancanti.


Schema logico dei vari container orchestrati da Kubernetes.

Entrambe le soluzioni prevedono l’utilizzo di Kubernetes come orchestratore. In un caso gestito da OpenShift, in un altro caso da Google Cloud Engine. I server di Deployments e le macchine di sviluppo sono esterne a Kubernetes.



On Premise
La soluzione On Premise prevede OpenShift di RedHat come gestore di Kubernetes.


OpenShift nel Datacenter di Rozzano

In questo modo è possibile creare una infrastruttura uguale a quella che si ha su Cloud e fare scaling delle risorse aggiungendole a OpenShift. In un futuro questa soluzione può anche essere impostata come Cloud Ibrido.

I requisiti minimi di hardware per una installazione Single Master (https://docs.openshift.org/latest/install_config/install/advanced_install.html#single-master) sono descritti a questo link: https://docs.openshift.org/latest/install_config/install/prerequisites.html 

Masters
Physical or virtual system, or an instance running on a public or private IaaS.
Base OS: Fedora 21, CentOS 7.3, or RHEL 7.3 with the "Minimal" installation option and the latest packages from the Extras channel, or RHEL Atomic Host 7.3.2 or later. RHEL 7.2 is also supported using Docker 1.12 and its dependencies.
2 vCPU.
Minimum 16 GB RAM.
Minimum 40 GB hard disk space for the file system containing /var/.

Nodes
Physical or virtual system, or an instance running on a public or private IaaS.
Base OS: Fedora 21, CentOS 7.3, or RHEL 7.3 or later with "Minimal" installation option, or RHEL Atomic Host 7.3.2 or later. RHEL 7.2 is also supported using Docker 1.12 and its dependencies.

NetworkManager 1.0 or later.
1 vCPU.
Minimum 8 GB RAM.
Minimum 15 GB hard disk space for the file system containing /var/.
An additional minimum 15 GB unallocated space to be used for Docker’s storage back end; see Configuring Docker Storage.

Si prevedono 2 Master e 2 Node.

On Cloud
La soluzione Cloud prevede la sottoscrizione di tre servizi:

Google Container Engine: un cluster manager e orchestratore cloud basato su Kubernetes.
Google Container Registry: un registro per le immagino Docker.
Mongo Atlas: Mongo as a Service


Soluzione Cloud

I servizi possono inizialmente essere presi al minimo delle risorse necessarie:

Google Cloud: 3 nodi 1vCPU, 3,5GB Ram
Mongo Atlas: Istance size M0 in replica set - 3 nodi

Si stima che approssimativamente il costo mensile per questa soluzione è tra i 150 e 200 euro.
Sviluppo e supporto ai rilasci
Per supportare i rilasci sono necessari:

GitLab 9.3 o superiore
Jenkins 2.60 o superiore

Si consiglia di installare i due server su macchine CentOS o Ubuntu, vanno bene macchine virtuali.

Per entrambe si consigliano:

4 Core
8 GB Ram
100 GB Disco

Per lo sviluppo delle estensioni di Mia-Platform si consiglia:

Sistema Operativo Linux o Mac
80 GB di spazio libero su disco
8 GB di Ram
