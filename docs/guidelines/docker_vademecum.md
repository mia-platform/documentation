## Perchè Docker ##

[Lo scopo di Docker](https://www.docker.com/why-docker#copy1) è rendere più facile la creazione, il deploy e l’esecuzione di applicazioni utilizzando i Container. I Container consentono allo sviluppatore di pacchettizzare una applicazione con tutte le parti necessarie (le librerie e altre risorse correlate) e consegnarla appunto come un unico pacchetto.

In questo modo, grazie al Container, lo sviluppatore è certo del fatto che l’applicazione stessa girerà su qualsiasi macchina Linux indipendentemente da qualsiasi customizzazione dei setting di quella stessa macchina, setting per i quali quella macchina potrebbe differire da quella che è stata usata per scrivere l’applicazione o per testarne il codice.

## Installazione

### Linux

Ti proponiamo 3 alternative diverse per installare docker:

1. [Tutorial per chi non ha mai usato Docker](https://docs.docker.com/get-started/)
2. **Script generico fornito da docker**: `curl -sSL https://get.docker.com/ | sh`
3. Per chi vuole seguire le [istruzioni specifiche](https://docs.docker.com/install/) sul proprio sistema operativo

### MacOS

Segui i seguenti passi:

1. Scarica e Installa [Docker Community Edition](https://www.docker.com/products/docker-engine)
2. Una volta installato clicca sull'icona e avvia la app: `docker run hello-world`

## Comandi Base - Ciclo di vita

* `docker create` crea un container ma non lo avvia.
* `docker rename` consente di rinominare il container.
* `docker run` crea e avvia un container in un'unica operazione.
* `docker rm` cancella un container.
* `docker update` aggiorna i limiti di risorse di un container.

## Avvio e Arresto

* `docker start` avvia un contenitore in modo che sia in esecuzione.
* `docker stop` ferma un container in esecuzione.
* `docker restart` si ferma e avvia un container.
* `docker pause` mette in pausa un container funzionante, "congelandolo" al suo posto.
* `docker unpause` riattiverà un container in esecuzione.
* `docker wait` blocchi fino a quando il container non si ferma.
* `docker kill` invia un SIGKILL a un container in esecuzione.
* `docker attach` si connetterà a un container funzionante.

## Informazioni

* `docker ps` mostra i contenitori funzionanti.
* `docker logs` ottiene i log dal container.
* `docker inspect` ottiene tutte le informazioni su un container (incluso l'indirizzo IP).
* `docker events` ottiene eventi dal container.
* `docker port` mostra la porta pubblica del container.
* `docker top` mostra i processi in esecuzione nel container.
* `docker stats` mostra le statistiche sull'utilizzo delle risorse dei container.
* `docker diff` mostra i file modificati nel container's FS.
* `docker ps -a` mostra i container funzionanti e fermi.
* `docker stats --all` mostra l'elenco dei container in esecuzione.

## Importa / Esporta

* `docker cp` copia file o cartelle tra un container e il filesystem locale.
* `docker export` trasforma il filesystem del container nel flusso di archivio tarball in STDOUT.

## Immagini Docker
Le immagini sono dei template dei Container.[A questo link](https://docs.docker.com/engine/docker-overview/) maggiori informazioni.

* `docker images` mostra tutte le immagini.
* `docker import` crea un'immagine da un tarball.
* `docker build` crea un'immagine da Dockerfile.
* `docker commit` crea un'immagine da un contenitore, interrompendolo temporaneamente se è in esecuzione.
* `docker rmi` rimuove un'immagine.
* `docker load` carica un'immagine da un archivio tar come STDIN, incluse immagini e tag (a partire da 0.7).
* `docker save` salva un'immagine in un flusso di archivio tar su STDOUT con tutti i livelli, i tag e le versioni parent (a partire da 0.7).
* `docker history` mostra la storia dell'immagine.
* `docker tag` etichetta un'immagine con un nome (locale o registro).


[A questo Link altri consigli utili](https://github.com/wsargent/docker-cheat-sheet#dockerfile)
