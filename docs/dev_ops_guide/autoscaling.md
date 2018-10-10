# Autoscaling dei servizi

L’autoscaling dei servizi rilasciati sulla piattaforma sia in cloud che on premise è affidata alla risorsa di
Kubernetes chiamata [Horizontal Pod Autoscaler][hpa].  
Questa risorsa utilizza le metriche raccolte da Kubernetes stesso per valutare la neccessità o meno di istanziare
nuovi pod per suddividere il lavoro fino ad un massimo impostato.

Le risorse che vengono prese in considerazione sono l’utilizzo di cpu e memoria. Se uno di questi valori supera una
soglia espressa in percentuale allora il sistema creerà una nuova istanza del pod per suddividere il carico che verrà
eliminata dopo un lasso di tempo in cui tutte le istanze disponibili rimangono sotto la soglia impostata.  
Questa percentuale viene calcolata con questa espressione:

```
replicheDesiderate = ceil[replicheCorrenti * ( valoreMetricaCorrente / valoreMetricaDesisderato )]
```

Il valore della metrica desiderato per il servizio in questione verrà preso dal valore impostato nel blocco
`request` contenuto in `resources` del `Deployment` di Kubernetes.

[hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
