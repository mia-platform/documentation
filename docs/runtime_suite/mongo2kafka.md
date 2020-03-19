# MongoStream2Kafka 

## What is MongoStream2Kafka?
Using this architectural solution, the Custom microservice, that writes on Mongo, queues the correct changes on Kafka.      
MongoStream2Kafka has several advantages:    

 * It’s a simple and easy to use component since it can be efficient in limited budget and time situations.    

 * It’s the perfect solution for you if you are using CRUD since MongoStream2Kafka allows to execute operations at each data modification.     


## When to use MongoStream2Kafka and when not to use it?
!!! Be Careful: in the followiing situations, MongoStream2Kafka is not the optimal component to be used:    

 * **When MongoChangeStream is not used in a cluster configuration**: MongoChangeStream use the oplog internal collection and it is used by mongo only for updating the replicas. If your Mongo cluster is not configured as clustered, you cannot use MongoChangeStream and MongoChange2Kafka.

 * **When you want to scale at MongoDB side**: MongoChangeStream is not partitioned/sharded and, so, it does not scale at MongoDB side.   
 > To solve this issue, two solutions are possible:      
 > - You can deploy multiple MongoStream2Kafka instances by setting a query to the MongoChangeStream. In this way you are partitioning the event, but your application does not scale up if a spike of traffic occurs. Moreover ,the partition key has to be a good one: a spike cannot follow your key since one partition is used more than other.         
 > - You can shard your cluster. But be aware from sharding your cluster, you cannot revert this choice!


In the situations in which MongoStream2Kafka is not the most suitable component to be used, you can ask to our specialists for architectural advices about other solutions.

## Which are MongoStream2Kafka strengths and weaknesses?

!! Be Careful: in any case, MongoStream2Kafka can be exposed to limitations, that sometimes can be solved by some workarounds:    

 * **Delete event sends only “_id”**: since the full document is lost and you cannot access to its properties, the Delete event cannot send other information than “_id”.     

 * **Kafka events are not sent to topic in the right order**: the resumetoken is used as kafka message key and it is an unique identifier used by Mongo for tracking the stream cursor.     
 > To solve this issue, you can choose to create topic with only one partition to allow messages to arrive in the correct order, but you may occur in performance problem at consumer-side.    

 * **Changes are not atomic**: MongoChangeStream sends you the last document version. So if multiple changes occur on the same document, Mongo may choose to send you only a change that contains only last document version since. In this case you loose the granularity of “each change”.    

 * **Lost event on spike traffic**: The oplog collection is a capped one and, so, it is limited in time and space. On spike traffic, this collection may contains too many changes, so mongo may decides to trash some old changes. If MongoChange2Kafka de-queues slowly, some changes will be lost.     
 > To solve this issue, you can increase the oplog window in order to avoid that Mongo trashes any old change.




